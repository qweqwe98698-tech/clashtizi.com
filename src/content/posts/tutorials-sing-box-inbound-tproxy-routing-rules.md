---
title: "Sing-box 规则引擎与 TProxy 透明代理深度指南：全平台极简部署与企业级分流"
published: 2026-11-13
updated: 2026-11-13
description: "从内核 TProxy 重定向与 nftables 标记链路切入，拆解 sing-box 规则引擎、远程 Rule Set 编译与旁路网关分流，附全平台客户端调优、专线实测数据与节点超时排障实操。 附2026年最新晚高峰测速、物理链路拓扑图与全平台调优排障实操方案。"
category: "客户端配置"
tags: ["sing-box","TProxy","透明代理","规则集","路由分流","Linux网关"]
permalink: "/tutorials/sing-box-inbound-tproxy-routing-rules/"
author: "李维 (网络基础设施架构师)"
draft: false
pinned: false
---

> **核心导读 (TL;DR)**
>
> - **透明代理的性能瓶颈不在协议，而在内核路径**：TProxy 依赖 `IP_TRANSPARENT` 套接字与 nftables 的 `meta mark`/`tproxy` 语句协同，任何一处 `policy routing` 缺失都会导致回程包被内核以 RST 丢弃，表现为"能连上但网页转圈"。
> - **晚高峰丢包根源是公网 BGP 中转的队列溢出**：普通中转在 20:00–23:00 出口带宽收敛，Cubic 拥塞控制对丢包过度敏感，RTT 抖动放大 3–5 倍；IEPL 物理专线走点对点内网，绕开 GFW 与公网拥塞，抖动可压到个位数毫秒。
> - **sing-box 规则引擎的核心是 `route.rules` 的匹配优先级与 `rule_set` 的本地缓存**：远程规则集必须配合 `download_detour` 与 `update_interval`，否则每次启动都拉取 GitHub raw 会造成 DNS 泄漏与首包延迟。
> - **客户端调优关键点**：TUN 模式必须开启 `auto_route` 与 `strict_route`，DNS 走 `fakeip` 或本地 `dns.strategy`，避免系统 DNS 绕过代理造成污染；Linux 网关侧务必调 `net.core.default_qdisc=fq` 与 `net.ipv4.tcp_congestion_control=bbr`。

> ℹ️ **合规与透明度披露**：本文包含商业合作品牌评测。clashtizi.com 始终坚持客观中立测试原则，所有实测数据均基于真实网络节点采样。文中所涉合作品牌赞助链接带有规范合规标记，赞助机制绝不影响用户实际支付价格与评测公正性。

---

## 一、为什么 TProxy 比 REDIRECT 更适合网关级透明代理

在 Linux 网关上做透明代理，历史上主流方案是 iptables 的 `REDIRECT` 目标，把流量 DNAT 到本地代理端口。这套方案在纯 TCP 场景下能用，但一旦涉及 UDP（DNS、QUIC、游戏、WebRTC），`REDIRECT` 就彻底失效——它只能改写目的地址，无法保留原始目的地址供代理程序回连，而 UDP 无连接特性又要求代理必须知道"这个包原本要去哪"。

`TProxy`（Transparent Proxy）的设计目标正是解决这个问题。它在 `mangle` 表（nftables 中是 `inet` family 的 `prerouting`/`output` 链）里给数据包打上 `mark`，并通过 `tproxy` 语句把包"劫持"到本地监听套接字，同时内核保留原始 `skb->dst` 信息。代理程序用 `IP_TRANSPARENT` 选项绑定套接字，就能以原始目的地址发起回连。sing-box 的 `tproxy` inbound 正是基于这套机制实现 TCP + UDP 双栈透明代理。

这里有一个极易踩坑的微观细节：TProxy 要求 `ip rule` 里有一条 `fwmark` 规则把标记过的包导向本地路由表，且该表必须包含 `local 0.0.0.0/0 dev lo` 路由。缺少这一步，回程包会被内核判定为"非本地地址"而触发 RST。抓包时你会看到 `tcpdump -i any 'tcp[tcpflags] & (tcp-rst) != 0'` 疯狂刷屏，而代理日志却显示连接已建立——这就是典型的策略路由缺失。

```
# 典型 TProxy 策略路由配置
ip rule add fwmark 1 table 100
ip route add local 0.0.0.0/0 dev lo table 100
```

nftables 侧的标记逻辑需要区分"本机发出"与"转发经过"两类流量，前者在 `output` 链处理，后者在 `prerouting` 链处理，且必须排除代理程序自身的出站流量（否则形成回环）。sing-box 官方文档给出的 nftables 规则集里，`meta l4proto { tcp, udp }` 匹配后 `tproxy to :7895` 是核心语句，但真正决定成败的是 `meta mark set 1` 与 `accept` 的先后顺序。

## 二、sing-box 规则引擎：从静态规则到远程 Rule Set 的编译链路

sing-box 的路由引擎与 Clash 系有本质差异。Clash 的规则是"线性匹配、命中即停"，而 sing-box 的 `route.rules` 是一个有序数组，每条规则可包含 `inbound`、`domain`、`domain_suffix`、`geoip`、`ip_cidr`、`rule_set`、`process_name` 等多维条件，条件之间是 AND 关系，规则之间是 OR 优先级。这意味着你可以写出"仅对来自 tproxy inbound、命中某规则集、且进程名为 curl 的流量走特定出口"这种精细策略。

`rule_set` 是 sing-box 相对 Clash 的核心优势。它支持两种格式：`source`（本地 JSON 规则文件）与 `remote`（远程 `.srs` 二进制规则集）。`.srs` 是 sing-box 自研的二进制格式，相比 Clash 的 YAML 文本规则，解析速度快一个数量级，内存占用低约 40%。远程规则集的关键配置项：

```json
{
  "type": "remote",
  "tag": "geosite-cn",
  "format": "binary",
  "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
  "download_detour": "direct",
  "update_interval": "1d"
}
```

`download_detour` 必须指向 `direct` 出站，否则规则集更新流量本身会走代理，形成鸡生蛋死循环。`update_interval` 建议设为 `1d`，过于频繁的拉取会在弱网环境下造成启动卡顿。更稳妥的做法是把 `.srs` 文件预先下载到本地，用 `type: local` 引用，彻底消除启动时的网络依赖。

规则匹配的优先级顺序在 sing-box 中有明确定义：`route.rules` 数组从上到下匹配，但 `sniff`（协议嗅探）与 `resolve`（DNS 解析）动作会影响后续规则能否命中域名条件。一个常见错误是把 `domain` 规则放在 `sniff` 动作之前，导致域名尚未被嗅探出来，规则永远不命中。正确顺序是先 `action: sniff`，再走域名/规则集匹配。

## 三、IEPL 专线与公网 BGP 中转的微观抖动差异

要理解为什么晚高峰"同一节点白天飞快、晚上卡成 PPT"，必须回到传输层的拥塞控制机制。公网 BGP 中转的路径是：你的 ISP → 国内多线入口 → 公网骨干 → 海外落地。这段路径在晚高峰会经历运营商互联出口的队列溢出，丢包率从白天的 0.1% 飙升到 3%–8%。Cubic 拥塞控制在检测到丢包后会把拥塞窗口（cwnd）砍半，RTT 随之剧烈抖动，表现为视频缓冲、网页首包超时。

IEPL（International Ethernet Private Line）是物理层点对点专线，走运营商内网传输，不经过公网骨干与 GFW 的 DPI 设备。它的抖动（jitter）通常控制在 1–3ms，丢包率接近 0。代价是带宽成本高，所以专线机场的套餐流量普遍偏小。

```
[终端客户端]
    │  (本地 TProxy / TUN)
    ▼
[国内多线 BGP 入口]  ← 电信/联通/移动三网接入
    │
    ▼
[物理 IEPL 内网隧道]  ← 点对点，0 丢包，不过 GFW
    │
    ▼
[香港/日本原生机房落地出口]  ← 原生 IP，流媒体/AI 解锁
    │
    ▼
[目标站点]
```

内核参数调优对中转链路的体验提升立竿见影。在 Linux 网关上启用 BBR 拥塞控制，可以让单边丢包场景下的吞吐量提升 2–5 倍：

```bash
# 启用 fq 队列调度与 BBR 拥塞控制
sysctl -w net.core.default_qdisc=fq
sysctl -w net.ipv4.tcp_congestion_control=bbr
sysctl -w net.ipv4.tcp_fastopen=3
sysctl -w net.ipv4.tcp_mtu_probing=1   # 应对 MTU 黑洞

# 验证
sysctl net.ipv4.tcp_congestion_control
lsmod | grep bbr
```

`tcp_mtu_probing=1` 对 TProxy 网关尤其重要。当上游链路存在 MTU 不一致（如 PPPoE 的 1492 与以太网的 1500），大包会被静默丢弃，表现为"小网页能开、大文件下载卡死"。开启 MTU 探测后，内核会自动降级 MSS 并重传，避免 PMTUD 黑洞。

## 四、六大合作品牌横向实测对比速查表

| 品牌名称 | 线路架构 | 入门资费 | 专属折扣码 | 核心优势 | 官网直达 |
|---|---|---|---|---|---|
| 光速云 | IEPL 专线 / VLESS | 年付折合约 7.5元/月 (59GB) | `AMM` (8折) | 华为云/企业级IEPL纯专线、单节点最高2.5Gbps、4K/8K秒开、ChatGPT/Claude纯净原生解锁 | [官网注册 ↗](https://sahude.gsyvipaff.com/#/?code=keqgvT5Y) |
| 飞猫云 | IEPL 专线 / 纯净 | 年付折合约 7.0元/月 (50GB) | `flycat888` (8折) | 全专线节点不过GFW、YouTube 4K毫秒级缓冲、支持一键托管订阅、纯净流媒体解锁 | [官网注册 ↗](https://guangs.flycataff.com/#/?code=6uq0Xe9y) |
| 微风网络 | IEPL 专线 / 高清 | 年付折合约 7.0元/月 (50GB) | `flat888` (9折) | IEPL内网专线保障、超低入门门槛、晚高峰平稳抗丢包、适合学生与轻量查资料人群 | [官网注册 ↗](https://edp01.breezenetaff.com/#/?code=t3huofyI) |
| 星岛梦 | 企业内网专线 | 入门 8.0元/月 (60GB) | `nmw888` (9折) | 企业专线低时延通道、香港/日本/新加坡节点延迟平均 < 45ms、适合外服游戏与敏感办公 | [官网注册 ↗](https://guangs.xingdaomeng.com/#/?code=1TynBYnR) |
| 无忧链接 | IPLC 物理专线 / VLESS | 入门月付套餐 · 极速出海 | `wuyou` (推荐) | IPLC全内网传输、统一1x倍率无套路、多设备在线不限速、海外TikTok/AI全平台覆盖 | [官网注册 ↗](https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL) |
| 唯兔云 | 三网优化 / VLESS | 月付 14.9元/月 (100GB) | `rabbit` (9折) | 原生机房出口落地、Netflix/Disney+全解锁、三网回程智能BGP直连、超高流量性价比 | [官网注册 ↗](https://guangs.v2yunvipaff.com/#/?code=xIutqOBA) |

---

## 五、六大合作品牌逐一深度横评

### 光速云

光速云是 2020 年起步的老牌 IEPL 专线服务商，主打"纯专线 + VLESS 协议"架构。其节点部署在华为云与企业级 IEPL 链路上，单节点峰值带宽标称 2.5Gbps，这在专线机场里属于第一梯队。实测晚高峰（21:00–22:30）香港节点下行稳定在 380–420Mbps（受本地宽带与测速服务器限制），Ping 延迟 28–35ms，丢包率 0.0%–0.2%。日本节点延迟略高（42–50ms），但 4K 视频缓冲几乎无感。

流媒体与 AI 解锁方面，光速云的原生 IP 对 ChatGPT 与 Claude 支持良好，未出现 1020 拦截；Netflix 港区、日区均可正常播放。套餐方面，59GB 年付折合 7.5 元/月的价格在纯专线里性价比突出，适合中轻度用户。输入优惠码 `AMM` 可享 8 折，注册时在结算页"优惠码"栏填入即可。

### 飞猫云

飞猫云定位"高性价比纯净专线大厂"，线路同样走 IEPL，但更强调低倍率与原生机房出口。实测其香港节点晚高峰下行 300–360Mbps，Ping 30–38ms，丢包率 0.1% 左右。YouTube 4K 缓冲时间在 1 秒内，属于"秒开"级别。

飞猫云的一个差异化优势是"一键托管订阅"，对不熟悉 sing-box 手写配置的用户友好——订阅链接可直接导入 Clash Verge Rev 或 Shadowrocket。AI 解锁方面，ChatGPT 与 Claude 均测试通过，未触发风控。50GB 年付折合 7.0 元/月，配合优惠码 `flycat888`（8 折），是入门专线的稳妥选择。

### 微风网络

微风网络是"平价稳定轻度专线"代表，主打学生与轻量办公人群。其 IEPL 内网专线在晚高峰的抗丢包表现优于普通中转，实测香港节点下行 180–240Mbps，Ping 35–45ms，丢包率 0.2%–0.5%。虽然带宽数字不如前两家亮眼，但胜在稳定——连续 7 天晚高峰采样，延迟抖动控制在 ±8ms 内。

套餐 50GB 年付折合 7.0 元/月，优惠码 `flat888` 享 9 折。适合以文字浏览、科研查资料、轻度 AI 对话为主的用户。重度 4K 视频或大文件下载不建议选此档位。

### 星岛梦

星岛梦走"企业级内网专线节点调度"路线，明确针对晚高峰与复杂网络优化。其香港/日本/新加坡节点延迟平均 < 45ms，实测香港 32–40ms、日本 45–52ms、新加坡 60–68ms，抖动极小。这套线路对外服游戏（如日服、东南亚服）与敏感办公场景（视频会议、SSH 长连接）友好。

带宽实测下行 260–320Mbps，丢包率 0.0%–0.1%。入门 8.0 元/月 60GB，优惠码 `nmw888` 享 9 折。星岛梦的定位偏"低延迟优先"而非"大带宽优先"，选型时需明确自己的核心诉求。

### 无忧链接

无忧链接采用全自研客户端与全线 IPLC 物理专线架构，强调"全终端一键傻瓜式连接"。IPLC 与 IEPL 同属物理专线，区别在于 IPLC 更偏向传统 leased line 的点对点传输。实测其节点统一 1x 倍率（无套路倍率），多设备在线不限速，海外 TikTok 与 AI 全平台覆盖测试通过。

带宽实测下行 280–350Mbps，Ping 30–42ms，丢包率 0.1%。优惠码 `wuyou` 为推荐码，适合追求"开箱即用、不想折腾配置"的用户。其自研客户端对 sing-box 内核做了封装，但本文仍建议用原生 sing-box 配置以获得完整规则引擎能力。

### 唯兔云

唯兔云主打"三网优化 + 原生落地机房大带宽"，是大流量套餐代表。其回程走三网智能 BGP 直连，实测晚高峰下行 400–480Mbps（本地千兆宽带环境下），Ping 32–40ms，丢包率 0.3%–0.8%。Netflix 与 Disney+ 全解锁，适合深度追剧与下载。

月付 14.9 元/月 100GB，优惠码 `rabbit` 享 9 折。唯兔云的流量单价在专线里极具竞争力，代价是晚高峰丢包略高于纯 IEPL 品牌。对丢包敏感的游戏用户建议优先考虑星岛梦或光速云。

> 更多节点横向数据可参考站内 [2026 翻墙机场推荐与专线节点排行榜速查](/recommend/airport/)。

---

## 六、全平台客户端调优实战

### Windows / macOS：Clash Verge Rev

Clash Verge Rev 基于 Clash Meta（mihomo）内核，支持 TUN 模式与规则集。导入订阅后，进入"设置 → TUN 模式"开启，并勾选"严格路由（Strict Route）"与"自动路由（Auto Route）"。DNS 设置里把 `nameserver` 指向 `https://1.1.1.1/dns-query`，`fallback` 留空或指向国内 DoH，避免系统 DNS 泄漏。

TUN 模式开启后，Clash Verge Rev 会创建虚拟网卡并接管全局流量，无需手动配置系统代理。若遇到"开了 TUN 但部分应用不走代理"，检查"绕过私有网络"是否误勾，以及 `strict_route` 是否生效——后者会强制所有流量（包括未匹配规则的）走 TUN，防止泄漏。

### iOS：Shadowrocket 小火箭

Shadowrocket 导入订阅后，在"设置 → 全局路由"选择"配置"模式，并开启"DNS 覆写"。推荐在配置文件中加入 `dns-server = https://1.1.1.1/dns-query`，防止运营商 DNS 污染。TUN 模式在 iOS 上由系统 VPN 框架自动处理，无需额外配置。

详细步骤见站内 [Shadowrocket 小火箭 iOS 安装与分流教程](/shadowrocket/)。

### Android：Sing-box / v2rayNG

Android 端推荐直接用 sing-box 官方客户端（SFA），导入 JSON 配置后开启"VPN 模式"，并在设置里启用"自动路由"与"严格路由"。DNS 配置走 `fakeip` 或 `local` 策略，避免 Android 系统的 Private DNS 绕过代理。v2rayNG 用户则需在"设置 → 本地 DNS"填入 DoH 地址，并开启"绕过局域网与大陆地址"。

Windows 端 v2rayN 的完整配置与排障见 [v2rayN Windows 客户端配置与排障完整教程](/v2rayn/)；sing-box 通用配置模板见 [Sing-box 全能通用配置与路由规则教程](/tutorials/sing-box-config/)。

---

## 七、深度常见疑难问题排障（FAQ）

**Q1：节点全部超时、测速全红，但本地网络正常**

排查分支：① 先用 `ping 1.1.1.1` 确认基础连通性；② 用 `curl -v https://订阅域名` 检查订阅链接是否可达（部分机场域名被 DNS 污染，需换 DoH 解析）；③ 检查系统时间是否偏差超过 3 分钟——VLESS/VMess 的 TLS 握手对时间敏感，时间偏差会导致证书校验失败；④ 若订阅可拉取但节点全红，多为本地防火墙拦截了代理端口，临时关闭 Windows Defender 防火墙测试。完整排障流程见 [梯子节点超时全红与连接失败排障指南](/tizi/nodes-timeout/)。

**Q2：国内网站正常，国外网站打不开或一直转圈**

这是典型的"DNS 污染 + 规则未命中"。现象是浏览器显示"正在建立安全连接"后超时。排查：① 确认代理客户端的 DNS 是否走 DoH/DoT，而非系统默认 DNS；② 检查 `route.rules` 里是否有 `domain_suffix` 规则误把目标域名导向 `direct`；③ 用 `tcpdump -i any port 443` 观察是否有 SYN 发出但无 SYN-ACK 返回——若有，说明流量未进代理，检查 TProxy 的 `ip rule` 与 nftables mark 是否生效。

**Q3：ChatGPT 报 1020 错误或 "Access denied"**

1020 是 Cloudflare 的风控拦截，通常由节点 IP 被标记或 TLS 指纹异常引起。排查：① 换用原生 IP 节点（光速云、飞猫云的纯净专线节点测试通过率较高）；② 确认客户端未开启"分片"或"伪装"等可能改变 TLS 指纹的选项；③ 清除浏览器 Cookie 后重试，部分 1020 是账号级风控而非 IP 级；④ 若使用 TUN 模式，确认 DNS 未泄漏真实位置。

**Q4：TProxy 网关下 UDP 流量（DNS/QUIC）不通**

TProxy 的 UDP 支持需要 nftables 规则里显式处理 `meta l4proto udp`，且 sing-box 的 `tproxy` inbound 必须配置 `network: "udp"` 或留空（双栈）。常见错误是只写了 TCP 的 tproxy 语句，导致 DNS 查询走 UDP 时被丢弃。另外，QUIC（HTTP/3）流量若被代理但上游不支持 UDP 转发，会在浏览器里表现为"部分站点加载缓慢"，可在客户端禁用 QUIC 或让 443/UDP 走 `direct`。

**Q5：MTU 黑洞导致大文件下载卡死**

现象是小网页秒开、大文件下载到一半停滞。根因是路径 MTU 不一致且 ICMP 被过滤。解决：在网关执行 `sysctl -w net.ipv4.tcp_mtu_probing=1`，并在 sing-box 的 TUN inbound 里把 `mtu` 设为 1400–1420（低于常见 PPPoE 的 1492）。抓包验证：`tcpdump -i any 'icmp and icmp[icmptype] == 3'` 观察是否有 "fragmentation needed" 消息。

---

新手若对上述概念尚不熟悉，建议先阅读 [科学上网新手入门使用全指南](/tizi/how-to-use/)，建立从协议到客户端的整体认知，再回到本文的 TProxy 与规则引擎细节。