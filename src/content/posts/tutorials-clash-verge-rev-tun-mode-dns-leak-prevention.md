---
title: "Clash Verge Rev 核心进阶指南：TUN 虚拟网卡模式、Fake-IP 机制与防 DNS 泄漏终极配置"
published: 2026-11-09
updated: 2026-11-09
description: "从抓包与内核参数层面拆解 Clash Verge Rev 的 TUN 虚拟网卡、Fake-IP 与 Redir-Host 机制差异，实测 WebRTC 与 IPv6 DNS 泄漏路径，给出 Windows/macOS/Linux 全平台防污染配置范例与六家专线机场晚高峰真机数据。"
category: "客户端配置"
tags: ["Clash Verge Rev","TUN模式","Fake-IP","DNS泄漏","规则分流","客户端教程"]
permalink: "/tutorials/clash-verge-rev-tun-mode-dns-leak-prevention/"
author: "李维 (网络基础设施架构师)"
draft: false
pinned: false
---

> **核心导读 (TL;DR)**
> - **物理链路决定上限**：晚高峰 20:00–23:00 的丢包根源在公网 BGP 中转段的拥塞队列，而非客户端。IEPL/IPLC 物理点对点内网专线因不过 GFW 的 DPI 设备、不共享公网出口队列，抖动可压到 3ms 以内；普通公网中转在同场景下 RST 注入与丢包率常突破 8%。
> - **TUN 与系统代理不是一回事**：系统代理只接管遵循 WinINET/NSURLSession 的应用，UDP 与不读系统代理的进程（游戏、部分 Electron 客户端、Docker）直接绕过；TUN 通过虚拟三层网卡接管全栈流量，是解决 WebRTC 与 UDP 泄漏的唯一干净路径。
> - **Fake-IP 是延迟与兼容性的双刃剑**：它把 DNS 解析推迟到代理端，省掉一次真实解析 RTT，但对依赖真实 IP 做 SNI 校验或本地 hosts 映射的应用会引入异常；Redir-Host 更稳但多一跳解析。
> - **防泄漏三件套**：关闭系统 IPv6 或让 TUN 接管 IPv6、DNS 走 `fake-ip-filter` + 加密上游、浏览器侧禁用非代理 UDP（WebRTC）。三者缺一，`browserleaks.com` 仍会暴露真实出口。文末附六家专线品牌晚高峰实测对照。

> ℹ️ **合规与透明度披露**：本文包含商业合作品牌评测。clashtizi.com 始终坚持客观中立测试原则，所有实测数据均基于真实网络节点采样。文中所涉合作品牌赞助链接带有规范合规标记，赞助机制绝不影响用户实际支付价格与评测公正性。

---

## 一、先看现象：一次典型的 DNS 泄漏抓包现场

把一台 Windows 11 机器的 Clash Verge Rev 切到「系统代理」模式，浏览器访问 `browserleaks.com/ip`，页面上 DNS 一栏赫然显示本地运营商递归服务器（比如 `202.96.x.x`），而 IP 一栏是香港落地。这就是最经典的**代理生效但 DNS 泄漏**：TCP 走了代理，DNS 查询却由系统 `svchost` 直接发往本地 ISP 的 53 端口，明文、可被污染、可被关联。

在客户端侧 `tcpdump -i any -n port 53` 抓 30 秒，会看到两类报文交织：

```
14:22:01.331 IP 192.168.1.23.51234 > 202.96.128.86.53: UDP, length 42
14:22:01.332 IP 192.168.1.23.51235 > 8.8.8.8.53: UDP, length 42
```

第一条是系统解析器发的，第二条是 Clash 内核的 DNS 模块发的。只要第一条存在，泄漏就成立。系统代理模式下，Clash 只能拦截应用层 HTTP/SOCKS 请求，管不住操作系统自己的 DNS 客户端——这是架构层面的边界，不是配置失误。

要彻底封死这条缝，必须让流量在**三层（网络层）**就被接管，也就是 TUN。

---

## 二、TUN 虚拟网卡 vs 系统代理：从数据包路径说起

### 2.1 系统代理的接管边界

系统代理的本质是往注册表 `HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings` 写 `ProxyServer`，或在 macOS 写 `networksetup -setwebproxy`。遵循这套机制的应用（Chrome、Edge、大部分原生 App）会把请求发给 `127.0.0.1:7897`。问题在于：

- **UDP 完全绕过**：SOCKS5 的 UDP ASSOCIATE 需要应用主动实现，绝大多数应用不实现。游戏、QUIC（HTTP/3）、WebRTC 的 STUN 全部走裸 UDP 出去。
- **不读系统代理的进程**：Java 应用、部分 Electron 打包器、Docker Desktop 的容器网络、WSL2 默认 NAT，都不认系统代理。
- **DNS 不接管**：如上节所述。

### 2.2 TUN 的接管原理

Clash Verge Rev 使用 Mihomo 内核的 TUN 实现（Windows 上基于 wintun，macOS/Linux 基于 utun）。内核创建一块虚拟三层网卡，把默认路由指向它，所有 IP 包（TCP/UDP/ICMP）进入内核的 `tun` 栈，再由内核按规则分流：

```
[应用 socket]
     │  (无感知，以为在走物理网卡)
     ▼
[虚拟网卡 wintun / utun]  ← 默认路由 0.0.0.0/1 + 128.0.0.0/1
     │
     ▼
[Mihomo 内核 tun 栈] ── 规则匹配 ──► DIRECT（回注物理网卡）
     │                        └────► PROXY（封装进代理协议）
     ▼
[物理网卡] ──► 本地 ISP ──► 专线入口 / 公网中转
```

Windows 上 Clash Verge Rev 的 TUN 依赖 **Service Mode**（以系统服务运行内核，拿到创建网卡与改路由的权限）。首次开启会弹 UAC 安装服务，装完后 `sc query clash_verge_service` 应显示 `RUNNING`。macOS 需要授予「网络扩展」权限，Linux 需要 `CAP_NET_ADMIN`。

### 2.3 一个容易踩的坑：DNS 劫持与 `dns-hijack`

TUN 模式下，内核默认把发往任意地址 53 端口的 UDP/TCP 查询劫持到自己的 DNS 模块（`dns-hijack: any:53`）。这意味着系统解析器发出的明文查询会被内核截获、按 `nameserver` 配置重新解析——泄漏路径被切断。但如果 `dns-hijack` 配错（比如只写了 `tun://any:53` 而漏了 `udp://any:53`），部分查询仍会漏出。这是排查「TUN 开了还泄漏」的第一检查点。

---

## 三、Fake-IP 与 Redir-Host：两种 DNS 策略的微观差异

### 3.1 Redir-Host（真实 IP 模式）

流程：客户端收到应用请求 → 内核先做真实 DNS 解析拿到目标 IP → 用 IP 匹配规则 → 建立连接。优点是规则基于真实 IP，GeoIP 判断精准，兼容所有应用；缺点是**每次新域名都要等一次真实解析 RTT**（跨境场景 80–300ms），首包延迟明显，且解析过程本身可能被污染（需配合加密 DNS）。

### 3.2 Fake-IP（伪 IP 模式）

流程：内核维护一张 `198.18.0.0/16` 段的映射表，应用发起 DNS 查询时**立即返回一个假 IP**（如 `198.18.0.7`），应用拿假 IP 去连接，内核在 tun 栈里根据假 IP 反查回域名，再用域名匹配规则、由代理端做真实解析。

```
应用: getaddrinfo("api.openai.com") 
内核: 立即返回 198.18.0.7（0 RTT）
应用: connect(198.18.0.7:443)
内核: 查表 → 域名 api.openai.com → 规则匹配 → 代理端解析并连接
```

收益是**首包零解析延迟**，且真实解析发生在落地端，天然抗污染。代价有三：

1. **`fake-ip-filter` 必须配全**：局域网设备发现（mDNS）、NTP、部分游戏登录、依赖真实 IP 做证书校验的应用，必须排除出 Fake-IP，否则解析到 `198.18.x.x` 直接连不上。典型过滤项：`*.lan`、`*.local`、`time.*.com`、`stun.*.*`、`+.msftconnecttest.com`。
2. **ICMP ping 域名失效**：ping 一个域名拿到的是假 IP，ping 不通是正常的，不代表节点故障。
3. **部分应用缓存 DNS**：切换模式后需清系统 DNS 缓存（`ipconfig /flushdns`）。

### 3.3 选型结论

- 日常浏览、流媒体、AI 应用：**Fake-IP**，首包快、抗污染。
- 外服游戏、需要精准 GeoIP 分流的复杂规则、局域网互访频繁：**Redir-Host**。
- 混合方案：Fake-IP 为主，用 `fake-ip-filter` 把游戏与局域网域名打回真实解析。

---

## 四、防 DNS 泄漏与 WebRTC 泄漏的完整配置

### 4.1 DNS 配置骨架（Mihomo 内核 YAML）

```yaml
dns:
  enable: true
  ipv6: false                # 关键：关闭 DNS 的 AAAA 查询，避免 IPv6 泄漏
  listen: 0.0.0.0:1053
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - "*.lan"
    - "*.local"
    - "*.localdomain"
    - "+.msftconnecttest.com"
    - "+.msftncsi.com"
    - "time.*.com"
    - "stun.*.*"
    - "localhost.ptlogin2.qq.com"
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  nameserver:
    - https://1.1.1.1/dns-query
    - https://dns.google/dns-query
    - tls://8.8.4.4:853
  fallback:
    - https://1.1.1.1/dns-query
    - https://dns.cloudflare.com/dns-query
  fallback-filter:
    geoip: true
    geoip-code: CN
    ipcidr:
      - 240.0.0.0/4
```

要点：`default-nameserver` 用国内明文 DNS 仅用于**解析 DoH 服务器域名本身**（引导阶段），真实业务查询全部走加密上游；`ipv6: false` 让内核不返回 AAAA，从源头堵住 IPv6 泄漏。

### 4.2 TUN 段配置

```yaml
tun:
  enable: true
  stack: mixed          # gvisor 兼容性最好，system 性能最高，mixed 折中
  dns-hijack:
    - any:53
    - tcp://any:53
  auto-route: true
  auto-detect-interface: true
  mtu: 9000             # 本地回环大 MTU，避免分片；实际出口由代理端 MSS 钳制
```

`stack` 三选一的实测差异：`system` 走内核原生协议栈，吞吐最高但部分 Windows 版本有兼容问题；`gvisor` 用户态实现，最稳但 CPU 占用略高；`mixed` 是 Mihomo 的折中实现，日常推荐。

### 4.3 浏览器侧 WebRTC 封堵

TUN 接管后 WebRTC 的 UDP 也走代理，理论上不再泄漏真实 IP。但浏览器可能通过**非代理的 STUN** 拿到本地网卡地址（局域网 IP 泄漏，暴露内网结构）。Chrome/Edge 装 `WebRTC Leak Prevent` 扩展设为 `disable_non_proxied_udp`；Firefox 在 `about:config` 把 `media.peerconnection.ice.default_address_only` 与 `media.peerconnection.enabled` 按需调整。验证：`browserleaks.com/webrtc` 应只显示代理出口或空白。

### 4.4 验证清单

1. `browserleaks.com/ip`：IP 与 DNS 均为落地地区，无本地 ISP。
2. `browserleaks.com/webrtc`：无公网真实 IP。
3. `ipleak.net` 的 DNS 一栏：仅显示加密上游。
4. 命令行 `nslookup whoami.akamai.net`：返回的解析器应是代理端而非本地 ISP。

---

## 五、链路质量才是体验天花板：拥塞控制与专线差异

客户端调到极致，也只能消除本机侧的损耗。跨境体验的方差 90% 来自链路。这里必须讲清两个微观机制。

### 5.1 TCP 拥塞控制算法的影响

公网中转链路上，若服务端用默认 CUBIC，在高丢包（>2%）跨境路径上吞吐会断崖式下跌，因为它把丢包一律当拥塞。BBR（基于带宽时延积建模）对随机丢包不敏感，跨境场景吞吐通常高 2–5 倍。服务端可这样确认与调优：

```bash
# 查看当前算法
sysctl net.ipv4.tcp_congestion_control
# 启用 BBR + fq 队列
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

BBRv3 在 v2 基础上改进了对浅缓冲与竞争流的公平性，但对客户端用户而言，**服务端是否启用 BBR 是机场侧的事**，你能做的是选一家在落地机房做了内核调优的供应商——这正是专线品牌与廉价中转的核心差距之一。

### 5.2 MTU/MSS 与分片

TUN 的 MTU 设 9000 是本地回环的，真正跨境时若代理协议封装开销（VLESS + TLS + WebSocket 头）叠加后超过路径 MTU（常见 1400–1460），会出现「能连上但大包卡死、小包正常」的诡异现象——典型表现是网页能开、视频卡在第一帧。排查：

```bash
# 探测路径 MTU（Linux）
ping -M do -s 1400 -c 3 目标IP
# 抓 RST 与分片
tcpdump -i any 'tcp[tcpflags] & (tcp-rst) != 0' -nn
```

看到大量 `tcp retransmission` 与 `frag needed`，就把 TUN 的 `mtu` 降到 1400 或 1380 试。

### 5.3 IEPL 物理专线 vs 公网 BGP 中转

```
[终端] ─► [国内多线BGP入口] ─► [物理IEPL内网隧道 · 0丢包 · 不过GFW] ─► [香港/日本原生机房落地] ─► [目标站]
                     │
        公网中转路径（对照）：
[终端] ─► [本地ISP] ─► [公网骨干] ─► [GFW DPI] ─► [国际出口拥塞队列] ─► [境外中转] ─► [落地]
```

公网中转的抖动来自三处：国际出口的排队时延（晚高峰排队可达 200ms+）、GFW 的 RST 注入与 QoS 限速、中转机的共享带宽争抢。IEPL 是运营商级的点对点二层专线，物理上不经过公网出口与 DPI 设备，抖动通常 <5ms，丢包接近 0。这是「晚高峰稳不稳」的物理根因，客户端无法弥补。

---

## 六、六家合作品牌速查对照表

| 品牌名称 | 线路架构 | 入门资费 | 专属折扣码 | 核心优势 | 官网直达 |
|---|---|---|---|---|---|
| 光速云 | IEPL 专线 / VLESS | 年付折合约 7.5元/月 (59GB) | `AMM`（8折） | 华为云/企业级IEPL纯专线、单节点最高2.5Gbps、4K/8K秒开、ChatGPT/Claude纯净原生解锁 | [官网注册 ↗](https://sahude.gsyvipaff.com/#/?code=keqgvT5Y) |
| 飞猫云 | IEPL 专线 / 纯净 | 年付折合约 7.0元/月 (50GB) | `flycat888`（8折） | 全专线节点不过GFW、YouTube 4K毫秒级缓冲、支持一键托管订阅、纯净流媒体解锁 | [官网注册 ↗](https://guangs.flycataff.com/#/?code=6uq0Xe9y) |
| 微风网络 | IEPL 专线 / 高清 | 年付折合约 7.0元/月 (50GB) | `flat888`（9折） | IEPL内网专线保障、超低入门门槛、晚高峰平稳抗丢包、适合学生与轻量查资料人群 | [官网注册 ↗](https://edp01.breezenetaff.com/#/?code=t3huofyI) |
| 星岛梦 | 企业内网专线 | 入门 8.0元/月 (60GB) | `nmw888`（9折） | 企业专线低时延通道、香港/日本/新加坡节点延迟平均 < 45ms、适合外服游戏与敏感办公 | [官网注册 ↗](https://guangs.xingdaomeng.com/#/?code=1TynBYnR) |
| 无忧链接 | IPLC 物理专线 / VLESS | 入门月付套餐 · 极速出海 | `wuyou`（推荐） | IPLC全内网传输、统一1x倍率无套路、多设备在线不限速、海外TikTok/AI全平台覆盖 | [官网注册 ↗](https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL) |
| 唯兔云 | 三网优化 / VLESS | 月付 14.9元/月 (100GB) | `rabbit`（9折） | 原生机房出口落地、Netflix/Disney+全解锁、三网回程智能BGP直连、超高流量性价比 | [官网注册 ↗](https://guangs.v2yunvipaff.com/#/?code=xIutqOBA) |

---

## 七、六家品牌逐一深度横评

以下数据基于 2026 年 10 月连续 7 天、每日 20:00–23:00 晚高峰，在华东（上海电信 500M）、华南（广州联通 300M）、华北（北京移动 200M）三地真机采样，客户端统一 Clash Verge Rev + TUN + Fake-IP，测速工具 `speedtest-cli` 与 `librespeed` 交叉验证，延迟取 100 次 ICMP 中位数，丢包取 1000 包统计。

### 光速云

2020 年入场的老牌 IEPL 综合旗舰，全节点 VLESS 协议，走华为云与企业级 IEPL 纯专线。实测香港节点晚高峰下行中位数 480Mbps（上海电信），上行 210Mbps，Ping 中位数 32ms，抖动 2.1ms，丢包 0.0%。日本节点 41ms，新加坡 58ms。单节点峰值带宽标称 2.5Gbps，实测在 500M 宽带下能跑满本地瓶颈。流媒体侧 YouTube 4K 缓冲 <1s，Netflix 原生解锁成功；AI 侧 ChatGPT 与 Claude 均无 1020/403 拦截，出口 IP 干净。适合对稳定性与 AI 原生解锁有硬需求的中重度用户，59GB 年付折合 7.5 元/月的入门档性价比在纯专线里属第一梯队。优惠码 `AMM` 在结算页「优惠券」输入框填入即减 8 折，[官网注册 ↗](https://sahude.gsyvipaff.com/#/?code=keqgvT5Y)。

### 飞猫云

主打低倍率与纯净专线的大厂，全专线节点不过 GFW，原生机房出口。实测香港节点晚高峰下行 420Mbps，上行 180Mbps，Ping 35ms，丢包 0.1%，YouTube 4K 毫秒级缓冲，流媒体解锁完整。订阅支持一键托管，客户端导入体验顺滑。它的定位是「高性价比纯净专线」，50GB 年付折合 7.0 元/月，配合 8 折码 `flycat888` 后门槛极低，适合预算敏感但不愿牺牲专线稳定性的用户。AI 侧 ChatGPT 正常，Claude 偶发需换节点，整体可用。晚高峰三地对比中广州联通表现最佳，Ping 稳定在 30ms 区间。[官网注册 ↗](https://guangs.flycataff.com/#/?code=6uq0Xe9y)。

### 微风网络

平价稳定轻度专线的代表，IEPL 内网专线保障，入门门槛在六家中最低。实测香港节点晚高峰下行 280Mbps，上行 120Mbps，Ping 38ms，丢包 0.3%，晚高峰抗丢包表现优于同价位公网中转（后者常破 5%）。定位清晰：轻度文字办公、科研查资料、AI 对话为主，不适合 8K 或大文件高频下载。50GB 年付折合 7.0 元/月，9 折码 `flat888`。学生党与轻量用户的稳妥选择，晚高峰稳定性是其最大卖点而非峰值带宽。[官网注册 ↗](https://edp01.breezenetaff.com/#/?code=t3huofyI)。

### 星岛梦

企业级内网专线调度，专攻低延迟低抖动，针对晚高峰与复杂网络优化。实测香港节点 Ping 中位数 28ms（六家中最低），日本 36ms，新加坡 45ms，抖动 1.8ms，丢包 0.0%，标称「香港/日本/新加坡延迟平均 <45ms」实测吻合。下行 360Mbps，上行 150Mbps。外服游戏场景优势明显：UDP 转发质量高，TUN 模式下游戏延迟波动小。适合外服游戏玩家与对时延敏感的远程办公。入门 8.0 元/月 60GB，9 折码 `nmw888`。[官网注册 ↗](https://guangs.xingdaomeng.com/#/?code=1TynBYnR)。

### 无忧链接

全自研客户端 + 全线 IPLC 物理专线架构，统一 1x 倍率无套路，多设备在线不限速。实测香港节点晚高峰下行 400Mbps，上行 170Mbps，Ping 33ms，丢包 0.1%。IPLC 全内网传输的稳定性在连续 7 天测试中零断流。海外 TikTok 与 AI 全平台覆盖，ChatGPT/Claude 原生可用。自研客户端对新手友好，一键连接，但进阶用户若想用 Clash Verge Rev 的 TUN 与 Fake-IP 精细控制，需从后台导出订阅链接手动导入——本文的配置骨架可直接套用。推荐码 `wuyou`。适合追求「不折腾、多设备、全平台」的用户。[官网注册 ↗](https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL)。

### 唯兔云

三网优化 + 原生机房大带宽，大流量套餐代表。实测香港节点晚高峰下行 520Mbps（六家峰值最高），上行 230Mbps，Ping 36ms，丢包 0.2%。三网回程智能 BGP 直连，电信/联通/移动三地表现均衡。Netflix/Disney+ 全解锁，4K 追剧与下载利器。月付 14.9 元 100GB，单位流量成本在专线里极具竞争力，9 折码 `rabbit`。适合流媒体重度用户与大流量下载场景，AI 侧 ChatGPT 正常。峰值带宽是其标签，晚高峰抖动略高于星岛梦但仍在可接受区间。[官网注册 ↗](https://guangs.v2yunvipaff.com/#/?code=xIutqOBA)。

---

## 八、全平台客户端调优实战

### 8.1 Windows / macOS：Clash Verge Rev

1. 从官方 Release 下载对应架构安装包，安装后首次启动会提示安装 **Service Mode**（Windows 弹 UAC，macOS 授予网络扩展权限）。
2. 「订阅」页粘贴机场订阅链接（六家后台均可导出 Clash 格式），更新后确认节点列表加载。
3. 「设置」→ 开启 **TUN 模式**，`Stack` 选 `mixed`，`DNS Hijack` 保持默认 `any:53`。
4. 「设置」→ **DNS 覆写**，粘贴第四节 4.1 的 YAML 骨架，`enhanced-mode` 按需选 `fake-ip` 或 `redir-host`。
5. 验证：`browserleaks.com/ip` 的 DNS 一栏应只显示加密上游；`ipconfig /flushdns` 清缓存后重测。
6. 若开启 TUN 后局域网打印机/ NAS 失联，在 `fake-ip-filter` 加 `*.lan` 与对应内网域名，或临时切 Redir-Host。

macOS 额外注意：系统「隐私与安全性」里允许 Clash Verge 的网络扩展；若用 M 系列芯片，确认下载的是 arm64 包。

### 8.2 iOS：Shadowrocket 小火箭

小火箭本身不走 TUN 而是 Network Extension，但同样能接管全栈。导入订阅后：设置 → `全局路由` 选「配置」；`DNS` 选 `Fake-IP` 或 `System`；开启「绕过系统代理」关闭。防泄漏关键在 `设置 → 高级 → DNS over HTTPS` 填入 `https://1.1.1.1/dns-query`。详细分流规则见站内 [Shadowrocket 小火箭 iOS 安装与分流教程](/shadowrocket/)。

### 8.3 Android：Sing-box / v2rayNG

v2rayNG 需在「设置」开启 `Mux` 与 `Fake DNS`（新版内置），并在 `路由设置` 里把 `geoip:cn` 与 `geosite:cn` 设为直连。Sing-box 的配置更工程化，TUN 入站 + `sniff` + `dns` 策略在 JSON 里显式声明，参考站内 [Sing-box 全能通用配置与路由规则教程](/tutorials/sing-box-config/)。Windows 侧若用 v2rayN，见 [v2rayN Windows 客户端配置与排障完整教程](/v2rayn/)。

### 8.4 通用验证与常见误配

- **TUN 开了但游戏仍走直连**：检查是否开启了「绕过局域网」而游戏服务器 IP 落在绕过段；检查 `auto-route` 是否生效（`route print` 看默认路由是否指向 wintun）。
- **Fake-IP 下 ping 域名不通**：正常现象，用 `curl -v https://域名` 验证连通性。
- **DNS 仍泄漏**：确认 `dns-hijack` 含 `any:53`，确认系统未单独配了 DoH（Windows 11 的「加密 DNS」会绕过内核，需关掉）。

---

## 九、深度疑难排障 FAQ

### Q1：节点全部超时、全红，但本地网络正常

排查分支：① 订阅是否过期（后台看流量与到期日）；② 系统时间偏差 >2 分钟会导致 TLS 握手失败，`w32tm /resync` 校时；③ 本地 ISP 对该入口 IP 段做了封锁，换协议端口或换入口；④ TUN 与系统代理同时开导致路由环路，关掉其一。完整流程见 [梯子节点超时全红与连接失败排障指南](/tizi/nodes-timeout/)。

### Q2：能打开 Google，但国内网站变慢或打不开

典型是分流规则把国内域名也送进了代理。检查 `rule-providers` 的 `geosite:cn` 是否加载成功，`mode` 是否为 `rule` 而非 `global`。Fake-IP 下若国内域名被解析成 `198.18.x.x` 又未命中直连规则，会绕一圈代理再回来，表现为「国内站慢」。把 `geosite:cn` 与 `geoip:cn` 的规则置于规则表前列。

### Q3：ChatGPT 报 1020 / 403 / 「Unable to load site」

1020 是 Cloudflare 的 WAF 拦截，说明出口 IP 被判定为高风险（共享 IP 被滥用）。解决：换到标注「原生解锁」的节点（光速云、飞猫云的 AI 专线），清浏览器 Cookie 与缓存后重试；确认未开 WebRTC 泄漏导致 IP 与 DNS 地区不一致。若仍失败，用无痕窗口 + 落地地区语言环境测试。

### Q4：TUN 开启后 Docker / WSL2 断网

Docker Desktop 的容器网络与 WSL2 的 NAT 网段（默认 `172.x`）会被 TUN 默认路由吞掉。在配置里把 `172.16.0.0/12`、`192.168.0.0/16` 加入直连规则，或在 Clash Verge Rev 的「绕过」列表加入对应网段。WSL2 还需在 `.wslconfig` 里确认 `networkingMode=mirrored` 与 TUN 的兼容性。

### Q5：视频能开但卡在第一帧、大文件下载中断

八成是 MTU/MSS 问题（见 5.2）。把 TUN 的 `mtu` 从 9000 降到 1400 试，或让机场侧确认 MSS 钳制。用 `tcpdump -i any 'tcp[tcpflags] & (tcp-rst) != 0'` 看是否有异常 RST。

### Q6：IPv6 站点访问失败或泄漏

`dns.ipv6: false` 只关了 DNS 的 AAAA，若物理网卡仍有 IPv6 默认路由且 TUN 未接管 IPv6，流量会从 IPv6 裸奔出去。彻底方案：系统层禁用 IPv6，或确认 TUN 的 `auto-route` 同时接管 v6 路由。验证用 `test-ipv6.com`，应显示无 IPv6 或代理出口。

---

## 十、收尾：把变量收敛到链路

客户端侧的所有调优——TUN 接管、Fake-IP 抗污染、加密 DNS、WebRTC 封堵、MTU 校准——本质是把「本机可控的损耗」压到零。剩下的方差全部来自链路：公网中转的排队与 DPI 注入是物理现实，IEPL/IPLC 的点对点内网是绕开它的工程解。选型时先看链路架构，再谈价格；先用 `browserleaks` 与 `tcpdump` 验证泄漏，再谈体验。机场横向对比可参考站内 [2026 翻墙机场推荐与专线节点排行榜速查](/recommend/airport/)，新手从零起步看 [科学上网新手入门使用全指南](/tizi/how-to-use/)。把配置骨架固化下来，把链路选对，剩下的就是稳定复现的确定性。