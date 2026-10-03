---
title: >-
  Sing-box 跨平台新手配置指南：Windows、macOS、Android、iOS 与 Hysteria2 / TUIC / VLESS
  教程（2026）
published: 2026-08-29T00:00:00.000Z
updated: 2026-08-29T00:00:00.000Z
description: >-
  Sing-box 怎么安装和配置？本文介绍 Windows、macOS、Android、iOS 使用方式、JSON
  配置、订阅导入、TUN、DNS、路由，以及 Hysteria2、TUIC、VLESS
  的区别与常见故障排查。详细讲解客户端安装激活、节点订阅导入与分流模式调优，助您轻松上手高速稳定的科学上网环境。
category: 客户端教程
tags:
  - Sing-box
  - Hysteria2
  - TUIC
  - VLESS
  - JSON配置
  - TUN
  - 客户端教程
pinned: false
permalink: /tutorials/sing-box-config/
---

> **文章摘要**：
> **sing-box** 是由开源社区打造的现代化、高性能通用网络代理核心（Universal Proxy Platform），以极致的运行性能、模块化架构和超低资源占用著称。它原生支持 **Hysteria 2**、**TUIC v5**、**VLESS (Reality)**、Shadowsocks 等主流与前沿传输协议，并支持在 Windows、macOS、Linux、Android 与 iOS 跨平台运行。与开箱即用的传统图形客户端不同，sing-box 本质上是由核心驱动的配置体系，新手需要理清“Core 核心、GUI 前端、JSON 配置、路由分流与协议机制”之间的关系。本文提供了一站式新手入门、协议选型、跨平台配置与故障排查指南。

---

## ⚡ 30 秒快速理解 sing-box (Quick Answer)

**在开始配置前，请先掌握关于 sing-box 的三个核心认知：**

```text
┌───────────────────────────────────────────────────────────┐
│ 1. sing-box 是一个「底层代理核心 (Core)」，不等于单一客户端软件。 │
│ 2. sing-box 采用「JSON 格式」配置，原生不支持旧版 Clash YAML 语法。 │
│ 3. 普通用户既可以通过「命令行 Core」运行，也可以配合「图形 GUI 客户端」使用。 │
└───────────────────────────────────────────────────────────┘
```

- **数据流转简图**：
  ```text
  [用户 / 应用程序] ──► [GUI 前端 / CLI] ──► [JSON 配置文件] ──► [sing-box Core 内核] ──► [DNS / Route / TUN] ──► [远端节点]
  ```
- **新手上手原则**：不要一上来就手工编写数百行的复杂 JSON 配置。优先选用支持 sing-box 的跨平台图形客户端，直接导入服务商提供的标准订阅，待熟悉后再尝试定制分流规则。

---

## 💻 跨平台支持与使用形态对照表 (表 1)

sing-box 在各大操作系统上的主流运行形态与上手门槛如下：

| 操作系统 | 主流使用方式 | 核心运行形态 | 新手推荐程度与注意事项 |
| :--- | :--- | :--- | :--- |
| **Windows 10 / 11** | 官方独立客户端 / 兼容 GUI 前端 / CLI | 系统服务 / 后台进程 | ⭐⭐⭐⭐☆ 推荐使用带图形界面的客户端，避免手动敲命令行 |
| **macOS (Intel / M系列)** | 官方 App / GUI 前端 / 终端 CLI | 系统网络扩展 / 后台进程 | ⭐⭐⭐⭐☆ M 系列芯片原生编译，功耗极低，支持原生 TUN |
| **Android (安卓系统)** | 官方 Android 客户端 / 兼容前端 | VPNService 系统级服务 | ⭐⭐⭐⭐⭐ 支持一键导入订阅，支持按应用分流，省电性能优异 |
| **iOS / iPadOS (苹果)** | 外区 App Store 官方客户端 / 兼容客户端 | Network Extension 扩展 | ⭐⭐⭐⭐☆ 受苹果生态限制，需使用外区 Apple ID 获取 |
| **Linux (各发行版)** | 命令行 CLI / systemd 守护进程 | 原生 Systemd 服务 | ⭐⭐⭐☆☆ 适合软路由、NAS 或开发者服务器部署 |

---

## 🚀 核心协议快速特性对比表 (表 2)

sing-box 广受推崇的核心原因之一是对现代前沿协议的原生极速支持：

| 协议体系 | 传输层基底 | 核心技术亮点 | 最适合的网络场景 | 关键排障方向 |
| :--- | :--- | :--- | :--- | :--- |
| **Hysteria 2** | UDP / QUIC | 自研 Brutal 拥塞控制，**恶劣高丢包网络下速率依然拉满** | 晚高峰丢包严重、国际带宽受限的宽带 | 检查本地运营商是否严重 QoS 限速 UDP 端口 |
| **TUIC v5** | UDP / QUIC | 基于标准 QUIC 协议，0-RTT 极速握手，并发多路复用 | 移动网络频繁切换、追求极致响应速度的场景 | 检查本地系统时间与证书 ALPN 协商 |
| **VLESS + Reality** | TCP / gRPC | 轻量无状态，借用大型正规网站 TLS 证书伪装，**零特征偷跑** | 高度敏感网络环境、对长期稳定性要求极高 | 检查 Reality 公钥、ShortID 与目标 SNI 伪装站 |

---

## 一、Sing-box 是什么？

**sing-box** 是一个通用的网络代理框架与核心平台。

它并不是一个简单的浏览器插件或单一翻墙工具，而是一个集成了多种网络模块的强大引擎：
- **入站模块 (Inbounds)**：支持 HTTP、SOCKS5、Mixed、TUN 虚拟网卡、Redirect、TProxy 等多种流量捕获方式。
- **出站模块 (Outbounds)**：支持 Shadowsocks、VMess、VLESS、Trojan、Hysteria 2、TUIC、WireGuard、Tor、Direct（直连）、Block（拦截）等全协议转发。
- **路由分流引擎 (Route)**：基于域名、IP、GeoIP、GeoSite、规则集（Rule-Set）执行微秒级精确流量判定。
- **内置 DNS 模块**：具备分流 DNS 解析、Fake-IP 映射与防污染解析能力。

---

## 二、Sing-box 和 Clash / Mihomo 有什么区别？ (表 3)

| 对比维度 | sing-box 生态体系 | Clash / Mihomo (Clash.Meta) 生态体系 |
| :--- | :--- | :--- |
| **核心定位** | 下一代通用代理底层平台 / 模块化 Core | 面向规则分流的代理生态与兼容内核 |
| **主配置文件格式** | **严格 JSON 格式**（结构严密，字段标准化） | **YAML 格式**（缩进排版，直观易读） |
| **底层设计哲学** | 追求纯粹、高性能、模块化解耦与协议前沿性 | 追求易用性、丰富 GUI 生态与开箱即用规则库 |
| **协议支持速度** | **第一时间原生实现** Hysteria 2、TUIC v5 | 社区快速跟进适配（Mihomo 支持度同样极高） |
| **路由匹配机制** | 基于 \`rule_set\`、Headless 规则集设计 | 基于传统的 \`rules\`、\`rule-providers\` 列表 |
| **新手上手门槛** | 相对较高（需理解 JSON 结构与字段） | 较低（市面拥有大量成熟的中文 GUI 客户端） |

> 📌 **技术结论**：两者均为当前顶级的开源代理项目，并不存在谁淘汰谁的关系。追求新协议极速体验与轻量资源消耗可选 sing-box；追求成熟图形界面与丰富分流规则组可选 **[Clash Verge Rev](/clash-verge-rev/)**。

---

## 三、Sing-box Core 与 GUI 客户端是什么关系？

```text
┌───────────────────────────────────────────────────────────┐
│                 图形化前端 (GUI Front-end)                 │
│  (提供可视化开关、订阅一键拉取、节点延迟测速、分流策略点击切换)    │
└─────────────────────────────┬─────────────────────────────┘
                              │ 生成 / 加载
┌─────────────────────────────▼─────────────────────────────┐
│                 sing-box 配置文件 (config.json)           │
│  (包含 log, dns, inbounds, outbounds, route 等核心数据结构)│
└─────────────────────────────┬─────────────────────────────┘
                              │ 解析并执行
┌─────────────────────────────▼─────────────────────────────┐
│                    sing-box Core 核心引擎                  │
│  (执行底层网络监听、虚拟网卡拦截、TLS 加解密、协议出站转发)   │
└───────────────────────────────────────────────────────────┘
```

- **sing-box Core** 相当于汽车的“发动机”；
- **GUI 客户端** 相当于汽车的“中控屏幕与方向盘”；
- **config.json** 相当于注入发动机的“行车电脑控制程序”。

普通用户日常操作的是 GUI 界面，GUI 负责将用户的点击转化为标准的 JSON 配置并指令 Core 执行。

---

## 四、下载或安装前需要确认什么？

在配置 sing-box 前，请确认以下四项关键信息：

1. **客户端形态选择**：决定是使用带界面的 GUI 客户端，还是使用终端纯命令行运行。
2. **CPU 架构**：Windows（x64 / ARM64）、Mac（Apple Silicon M 系列 / Intel x64）、Android（arm64-v8a）。
3. **节点协议类型**：确认你的服务提供商节点是 Hysteria 2、TUIC、VLESS 还是传统 Shadowsocks。
4. **订阅格式支持**：确认机场后台是否提供直接复制的 **sing-box 专用订阅格式**，或是否需要借助客户端内置的订阅转换。

---

## 五、Sing-box 官方下载渠道

请始终认准官方开源仓库与文档发布渠道：

- 🌐 **GitHub 官方开源仓库**：[SagerNet/sing-box Releases](https://github.com/SagerNet/sing-box/releases)
- 📖 **官方配置手册与开发文档**：[sing-box.sagernet.org](https://sing-box.sagernet.org/)

> 🔒 **【安全防坑提醒】**：绝不要从第三方未经验证的博客网盘或网上传播的“魔改汉化包”下载 Core 二进制程序，防止被注入后门盗取账号密码与加密流量。

---

## 六、Windows 平台安装与使用指引

1. **下载官方程序包**：在 GitHub Release 页面下载对应的 `sing-box-x.x.x-windows-amd64.zip`。
2. **解压至纯英文目录**：解压至如 `D:\Program Files\sing-box\` 目录，解压后得到 `sing-box.exe`。
3. **放置配置文件**：将你的 `config.json` 放在同级目录下。
4. **命令行运行测试**：
   ```powershell
   # 检查配置语法是否正确
   .\sing-box.exe check -c .\config.json
   # 启动核心
   .\sing-box.exe run -c .\config.json
   ```
5. **图形界面推荐**：小白用户更建议使用集成了 sing-box 内核的第三方 GUI 客户端，免去手动维护 JSON 的繁琐。

---

## 七、macOS 平台安装与使用指引

1. **芯片架构选择**：M1/M2/M3/M4 芯片选择 `darwin-arm64`；Intel 芯片选择 `darwin-amd64`。
2. **官方 App 安装**：可直接安装官方发布的 macOS 图形客户端，拖入 Applications 文件夹。
3. **授予系统权限**：首次开启 TUN 模式或系统扩展时，Mac 会弹出“添加 VPN 配置”或“系统扩展已阻止”提示，需进入 **「系统设置」 $\rightarrow$ 「隐私与安全性」** 点击允许。

---

## 八、Android 平台安装与使用指引

1. **获取 APK 安装包**：在官方 Release 页面下载 `sing-box-x.x.x-android-arm64-v8a.apk`。
2. **导入配置/订阅**：
   - 打开 App，点击底部 **「Profiles (配置)」**。
   - 点击右上角 **「+」**，选择 **「New Profile」** $\rightarrow$ 类型选择 **「Remote」**（输入订阅 URL）或 **「Local」**（导入本地 json 文件）。
3. **开启 VPN 服务**：
   - 回到主界面，点击中央启动大按钮。
   - 弹出系统网络连接请求时点击“确定”，状态栏出现钥匙图标即代表 VPN 启动成功。
4. **后台保活设置**：在系统电池设置中将 sing-box 设置为“无限制/允许后台高耗电”，防止被系统杀后台断网。

---

## 九、iOS / iPadOS 平台使用指引

- **官方客户端获取**：使用非中国大陆地区的 Apple ID，登录 App Store 搜索下载 **sing-box** 官方 App。
- **兼容客户端生态**：除官方 App 外，iOS 上著名的网络工具（如 Shadowrocket、Loon、Surge 等）在新版本中亦深度集成了对 Hysteria 2 与 VLESS Reality 协议的支持。
- **配置导入**：打开 App 后点击 Profiles，粘贴订阅链接拉取配置，开启主开关并允许添加 VPN 配置即可。

---

## 十、Linux 平台安装与 Systemd 守护进程部署

在 Linux 服务器、NAS 或软路由上部署：

```bash
# 1. 赋予执行权限并移动到系统路径
sudo cp sing-box /usr/local/bin/
sudo chmod +x /usr/local/bin/sing-box

# 2. 创建配置目录与配置文件
sudo mkdir -p /etc/sing-box
sudo nano /etc/sing-box/config.json

# 3. 创建 Systemd 服务文件
sudo nano /etc/systemd/system/sing-box.service
```

写入以下标准服务定义：
```ini
[Unit]
Description=sing-box service
Documentation=https://sing-box.sagernet.org
After=network.target nss-lookup.target

[Service]
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_NET_RAW
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_NET_RAW
ExecStart=/usr/local/bin/sing-box run -c /etc/sing-box/config.json
Restart=on-failure
RestartSec=5s
LimitNOFILE=infinity

[Install]
WantedBy=multi-user.target
```

```bash
# 4. 启动并设置开机自启
sudo systemctl daemon-reload
sudo systemctl enable --now sing-box
sudo systemctl status sing-box
```

---

## 十一、JSON 配置文件基础概念

sing-box 放弃了 YAML 而全面采用 **JSON (JavaScript Object Notation)** 格式：
- **优势**：语法严谨、机器解析性能极高、无缩进歧义。
- **编写注意事项**：所有的键名与字符串值必须使用双引号 `""`，数组元素之间用英文逗号 `,` 分隔，**最后一个元素末尾严禁多留逗号**。

---

## 十二、最小可用 JSON 配置结构拆解

以下是一份标准且安全的 sing-box 客户端基础配置框架（所有凭据与域名均采用占位符，仅供结构理解）：

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "dns": {
    "servers": [
      {
        "tag": "dns-remote",
        "address": "tls://8.8.8.8",
        "detour": "proxy-out"
      },
      {
        "tag": "dns-local",
        "address": "223.5.5.5",
        "detour": "direct-out"
      }
    ],
    "rules": [
      {
        "outbound": "any",
        "server": "dns-local"
      },
      {
        "rule_set": "geosite-cn",
        "server": "dns-local"
      }
    ]
  },
  "inbounds": [
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "127.0.0.1",
      "listen_port": 2080
    }
  ],
  "outbounds": [
    {
      "type": "hysteria2",
      "tag": "proxy-out",
      "server": "example.com",
      "server_port": 443,
      "password": "example-password",
      "tls": {
        "enabled": true,
        "server_name": "example.com"
      }
    },
    {
      "type": "direct",
      "tag": "direct-out"
    },
    {
      "type": "block",
      "tag": "block-out"
    }
  ],
  "route": {
    "rules": [
      {
        "protocol": "dns",
        "outbound": "dns-out"
      },
      {
        "rule_set": "geosite-cn",
        "outbound": "direct-out"
      },
      {
        "rule_set": "geoip-cn",
        "outbound": "direct-out"
      }
    ],
    "auto_detect_interface": true
  }
}
```

---

## 十三、Inbound 与 Outbound 核心概念

- **Inbound（入站）**：定义 sing-box 如何在本地接收流量。例如开启本地 `127.0.0.1:2080` 端口监听浏览器 HTTP/SOCKS 代理，或者创建 `tun` 虚拟网卡接管整机流量。
- **Outbound（出站）**：定义流量如何离开 sing-box 发往目的地。例如发往自建的 Hysteria 2 节点、发往专线 VLESS 节点、发往 `direct`（本地直连）、或者发往 `block`（广告拦截屏蔽）。

---

## 十四、Route（路由分流系统）

**Route** 是 sing-box 的智能大脑，负责决定每一个连接应该命中哪一个 Outbound：
- **域名规则匹配**：如 `domain_suffix: ["google.com", "github.com"]` $\rightarrow$ 走 `proxy-out`。
- **地理位置匹配**：如 `rule_set: "geoip-cn"` $\rightarrow$ 走 `direct-out` 直连，避免国内流量绕道海外。
- **规则优先级**：路由规则自上而下逐条匹配，一旦命中立即执行对应出站，后续规则不再扫描。

---

## 十五、DNS 模块在 sing-box 中的联动作用

sing-box 内置了独立的 DNS 解析系统，直接与路由模块绑定：
- **国内域名**：分配由国内阿里 DNS (`223.5.5.5`) 通过 `direct-out` 解析，获得最近的国内服务器 IP。
- **国外域名**：分配由安全加密 DNS (`tls://8.8.8.8`) 通过 `proxy-out` 代理通道解析，从根源上杜绝本地运营商的 DNS 污染与劫持。

---

## 十六、订阅链接 vs JSON 配置文件 (表 4)

| 对比维度 | 远程订阅链接 (Subscription URL) | 本地 JSON 配置文件 (config.json) |
| :--- | :--- | :--- |
| **本质形式** | 存放在云端服务器的远程拉取入口 | 保存在本地存储设备中的完整静态配置数据 |
| **多节点管理** | 服务端维护节点池，客户端一键刷新同步 | 需手动将节点数组写入 `outbounds` 节点列表 |
| **规则更新** | 随订阅更新自动拉取最新的分流策略 | 需手动维护并下载最新的 `.srs` 规则集 |
| **安全敏感度** | 包含代表账户身份的唯一 Token | 包含节点的明文连接密码、UUID 与私钥凭据 |
| **新手适用度** | **强烈推荐新手使用（维护极省心）** | 适合自建节点玩家或高级开发者定制 |

---

## 🔒 安全提醒：订阅与配置凭据严禁泄露

> [!WARNING]
> **切勿将包含真实节点信息的 JSON 文件、UUID、Hysteria 2 连接密码、Reality 共有密钥（Public Key）或订阅链接发布在公开网络平台！**  
> 任何获取到上述凭据的第三方均可直接盗用您的服务器流量配额，甚至通过恶意连接引发您的服务器 IP 被机房风控封停。

---

## 十七、Hysteria 2 协议深度解析

**Hysteria 2** 是当前对抗网络丢包最强悍的下一代协议：
- **QUIC/UDP 底层**：彻底摆脱传统 TCP 的三次握手延迟与队头阻塞（Head-of-Line Blocking）问题。
- **Brutal 动态拥塞控制**：即便在跨洋公网丢包率高达 15%~30% 的极端晚高峰恶劣网络下，依然能跑满用户的物理带宽。
- **标准 TLS 1.3 混淆**：流量特征与标准 HTTPS/HTTP3 完全一致，具备极强的抗封锁伪装能力。

---

## 十八、TUIC v5 协议深度解析

**TUIC** 同样是基于 QUIC 的前沿代理协议：
- **0-RTT 极速建连**：利用 QUIC 的会话恢复机制，实现零延迟快速握手，开启网页即时响应。
- **原生多路复用**：单个 UDP 链路上承载成百上千个并发数据流，大幅降低移动端电量与 CPU 开销。
- **高并发稳定性**：特别适合配合智能手机在 Wi-Fi 与 5G 信号之间频繁切换时的网络无感漫游。

---

## 十九、VLESS (Reality) 协议深度解析

**VLESS** 是轻量、高效的无状态传输协议，配合 **Reality** 实现了划时代的抗封锁能力：
- **无状态设计**：去除多余的校验开销，传输吞吐性能接近物理极限。
- **Reality 证书借用伪装**：不需要自建域名和申请 SSL 证书，直接“借用”海外大型正规公司（如 Yahoo、Apple、Microsoft）的真实 TLS 证书作为伪装外壳。
- **主动探测免疫**：审查防火墙在发起主动探测时，服务端会原封不动转发目标伪装站的真实证书，使探测器完全无法识别代理特征。

---

## 二十、Hysteria 2 vs TUIC vs VLESS 怎么选？ (表 5)

| 比较维度 | Hysteria 2 | TUIC v5 | VLESS + Reality |
| :--- | :--- | :--- | :--- |
| **传输层机制** | UDP (定制 Brutal 拥塞算法) | UDP (标准 QUIC 机制) | TCP / gRPC / WebSocket |
| **弱网抗丢包能力** | **⭐⭐⭐⭐⭐ 极强（恶劣丢包克星）** | ⭐⭐⭐⭐☆ 优异 | ⭐⭐⭐☆☆ 依赖底层 TCP 拥塞控制 |
| **延迟表现 (TTFB)** | 极低（QUIC 快速握手） | **⭐⭐⭐⭐⭐ 极致（0-RTT 毫秒级）** | 良好（取决于 TLS 握手层数） |
| **被 QoS 限速风险** | 部分对 UDP 限制严格的宽带可能限速 | 部分对 UDP 限制严格的宽带可能限速 | **⭐⭐⭐⭐⭐ 极低（走标准 TCP 443 端口）** |
| **配置复杂度** | 适中（需配置密码与端口跳跃） | 适中（需配置 UUID 与 ALPN） | 略高（需配置 Public Key 与 Short ID） |
| **推荐选型场景** | **家庭晚高峰网络卡顿、看 4K/8K 视频** | **移动设备日常网页秒开、即时通讯** | **企业办公、敏感期高稳定性长期主力** |

---

## 二十一、高频协议连接故障排查指南

### 1. Hysteria 2 连不上怎么办？
- **排查 UDP 阻断**：部分公司内网或校园网封锁了出站 UDP 流量，导致基于 QUIC 的 Hysteria 2 无法握手。
- **排查端口与密码**：核对 `server_port` 与 `password` 是否与服务端完全匹配。
- **排查 TLS SNI**：确认配置中的 `server_name` 与服务器证书域名一致。

### 2. TUIC 连不上怎么办？
- **排查 ALPN 协商**：TUIC 对 `alpn` 字段要求严格，确认客户端填写的 ALPN（通常为 `h3`）与服务端一致。
- **排查 UUID/Token**：检查身份验证字符串是否粘贴完整。

### 3. VLESS Reality 连不上怎么办？
- **核对 Public Key**：Reality 严格依赖公钥校验，私钥与公钥不匹配将直接导致握手静默中断。
- **核对系统时间**：Reality 握手包含时间戳容差校验，本机时间偏差超过 60 秒将握手失败。立即同步北京时间！

---

## 二十二、TUN 模式与 System Proxy 深度解析

### 1. 什么时候需要使用 TUN 模式？
- 当你运行网络游戏（如 Steam/Epic 联机、需要 UDP 转发）、CMD/PowerShell 命令行开发工具（如 Git clone、Docker 拉取镜像）、或使用不支持系统代理的专用桌面软件时，开启 **TUN 虚拟网卡** 即可实现 100% 整机全流量接管。

### 2. System Proxy vs TUN 模式深度对比 (表 6)

| 比较项目 | System Proxy (系统代理) | TUN 虚拟网卡模式 |
| :--- | :--- | :--- |
| **实现技术层级** | 操作系统网络设置（HTTP/SOCKS5） | 网络驱动内核层（虚拟网卡 L3 数据包拦截） |
| **流量接管范围** | 仅限浏览器及遵守系统代理的软件 | **整机所有进程与所有协议（TCP/UDP/ICMP）** |
| **管理员权限要求** | 普通用户权限即可运行 | **必须具备系统最高管理员 (Admin/Root) 权限** |
| **游戏与终端加速** | 无法支持游戏 UDP 流量 | **完美支持游戏联机与命令行终端加速** |
| **新手选型建议** | **普通上网浏览首选** | **有游戏加速或开发终端需求时再开启** |

---

## 二十三、TUN 模式开启后无法上网怎么办？

1. **检查管理员权限**：确保是以“管理员身份运行”客户端或赋予了 `CAP_NET_ADMIN` Linux 内核能力。
2. **排查路由表死循环**：确认在配置中开启了 `auto_detect_interface: true`，防止发往代理服务器的数据包被错误路由回虚拟网卡自身形成死循环。
3. **排查 DNS 污染**：参考 **[Clash 节点全红与网络排障教程](/issues/clash-nodes-timeout/)** 刷新本地网络。

---

## 二十四、Logs（运行日志）排错速查表 (表 7)

观察终端或客户端的日志输出，可秒级定位问题根因：

| 关键日志报错 | 故障本质原因分析 | 推荐解决动作 |
| :--- | :--- | :--- |
| `dial: i/o timeout` | 节点服务器不可达或网络中断 | 检查本地基础网络，切换可用节点 |
| `authentication failed` | 密码、UUID 或 Token 凭证错误 | 重新核对并更新服务商订阅凭据 |
| `tls handshake: bad certificate` | TLS 证书不匹配或系统时间偏差 | 校准操作系统时间，核对 SNI 配置 |
| `bind: address already in use` | 本地入站端口（如 2080）被其他程序占用 | 修改 `listen_port` 为其他未占用端口 |
| `permission denied (tun)` | 缺少虚拟网卡底层驱动控制权限 | 退出程序，右键选择以管理员身份运行 |
| `dns resolve failed` | DNS 服务器无法连接或域名拼写错误 | 更换可靠的公共 DNS 地址 |

---

## 二十五、常见故障快速入口导航 (表 8)

| 常见故障现象 | 快速排查思路 | 深度实操指引 |
| :--- | :--- | :--- |
| **sing-box 启动即闪退或报错** | 运行 `sing-box check -c config.json` 检查 JSON 语法 | 检查逗号与双引号闭合 |
| **节点测速全部显示 Timeout** | 同步系统时间 $\rightarrow$ 检查防火墙放行 $\rightarrow$ 更新订阅 | 📖 **[节点全红排障指南](/issues/clash-nodes-timeout/)** |
| **访问 ChatGPT 提示 1020 拒绝** | 切换至具备原生住宅 IP 解锁的专线节点 | 📖 **[ChatGPT 1020 终极排障](/issues/chatgpt-access-denied/)** |
| **需要寻找支持 Hysteria2 的高可用专线** | 选择部署了全协议 IEPL 专线的高速机场 | 📖 **[2026 高速稳定机场推荐](/recommend/airport/)** |

---

## 二十六、新手常见 10 大错误避坑

1. ❌ **直接将 Clash YAML 配置文件重命名为 `.json`**：两者结构完全不同，会导致内核解析崩溃。
2. ❌ **混用不同协议参数**：在 VLESS 出站配置中填写 Hysteria 2 独有的 Brutal 速率参数。
3. ❌ **未赋权强开 TUN**：在非管理员权限下开启 TUN 导致虚拟网卡创建失败并断网。
4. ❌ **JSON 格式留有多余逗号**：数组或对象最后一个字段末尾留有逗号 `,` 导致语法校验失败。
5. ❌ **DNS 正常时盲目套用复杂脚本**：引入不可信的远程规则集导致域名解析异常缓慢。

---

## ❓ 常见问题解答 (FAQ)

### Q1: Sing-box 是什么？
> **答**：sing-box 是一款用 Go 语言编写的新一代高性能、跨平台通用网络代理核心，支持全面的现代加密协议与灵活的路由分流机制。

### Q2: Sing-box 是客户端还是内核？
> **答**：sing-box 本质是一个底层核心（Core），但官方和开源社区基于此核心打包了支持 Windows、macOS、Android 和 iOS 的完整图形客户端。

### Q3: Sing-box 和 Clash 有什么区别？
> **答**：sing-box 采用严谨的 JSON 配置与模块化架构，对 Hysteria 2、TUIC 等新协议支持更快；Clash 采用 YAML 语法且拥有更庞大的第三方 GUI 生态。

### Q4: Windows 上如何使用 sing-box？
> **答**：既可以通过命令行直接运行 `sing-box.exe run -c config.json`，也可以下载带中文界面的图形客户端导入订阅使用。

### Q5: Mac M1/M2/M3 应该下载哪个版本？
> **答**：Apple Silicon 芯片的 Mac 电脑请务必选择 `darwin-arm64` 架构版本，以享受原生编译带来的毫秒级响应与超低能耗。

### Q6: Android 上 sing-box 怎么导入订阅？
> **答**：打开 App 进入 Profiles 面板，点击新建远程配置（Remote Profile），粘贴服务商提供的 sing-box 订阅链接并保存激活即可。

### Q7: iOS 上有 sing-box 官方客户端吗？
> **答**：有的。使用外区 Apple ID 登录 App Store 即可免费下载官方 sing-box App，同时 Shadowrocket 等工具也原生支持其协议。

### Q8: Hysteria 2 为什么在晚高峰更流畅？
> **答**：Hysteria 2 基于 UDP/QUIC 并采用自研 Brutal 拥塞控制算法，即便在公网高丢包环境下也能主动填满可用带宽，避免 TCP 降速。

### Q9: TUIC 协议的核心优势是什么？
> **答**：TUIC 具备 0-RTT 极速握手和优异的多路复用能力，特别适合智能手机在不同网络间切换时的快速重连与低功耗运行。

### Q10: VLESS Reality 为什么被认为极难被封？
> **答**：Reality 直接借用正规大型网站的真实 TLS 证书进行流量伪装，中间防火墙发起主动探测时只会收到真实网站的应答，特征完全隐匿。

### Q11: Hysteria 2 和 TUIC 怎么选？
> **答**：晚高峰网络丢包严重首选 Hysteria 2；追求移动端低延迟、轻量化与快速建连首选 TUIC；两者均表现优异，可根据机场节点支持情况选择。

### Q12: 为什么开启 TUN 模式后电脑无法上网？
> **答**：通常是因为缺少管理员权限导致虚拟网卡驱动加载失败，或者路由表配置错误引发死循环。请右键以管理员身份运行并检查路由配置。

### Q13: 如何检查 JSON 配置文件是否有语法错误？
> **答**：在终端中运行 `sing-box check -c config.json` 命令，若配置正确会直接返回成功，若有语法错误会精确定位到具体的行数与字段。

### Q14: 升级 sing-box 版本后旧配置报错怎么办？
> **答**：sing-box 迭代较快，部分旧字段可能被废弃或重命名。请查阅官方 Release Notes 中的 Migration 迁移指引更新对应字段名称。

### Q15: Sing-box 支持像 Clash 那样自动更新订阅吗？
> **答**：现代 GUI 图形客户端均支持设置定时自动更新订阅周期；若使用命令行 Core，可通过定时脚本或外部订阅管理工具同步拉取。

---

## 📚 官方参考资料与来源说明

本文技术规范与配置标准依据以下官方项目文档整理：
1. **sing-box 官方 GitHub 仓库**：[SagerNet/sing-box](https://github.com/SagerNet/sing-box)
2. **sing-box 官方文档中心**：[sing-box.sagernet.org](https://sing-box.sagernet.org/)
3. **Hysteria 2 官方文档**：[v2.hysteria.network](https://v2.hysteria.network/)

---

## 🏁 总结与进阶实践指南

**sing-box** 以其极致的性能、模块化解耦架构以及对 **Hysteria 2、TUIC、VLESS** 等新一代协议的顶级支持，已成为高阶代理技术生态的核心基石。

对于广大新手用户：
1. **先用 GUI，后折腾 CLI**：优先借助图形化客户端熟悉订阅导入与节点切换流程。
2. **循序渐进定制分流**：在掌握基础连接后，再深入研究 `rule_set` 规则集与 DNS 调优。
3. **定期备份与校验**：在修改 JSON 配置前养成使用 `sing-box check` 校验的好习惯，轻松构建安全稳定的跨境网络通道！

---

### 📖 相关推荐阅读
- 🚀 **[Clash Verge Rev 跨平台客户端新手配置图文教程](/clash-verge-rev/)** —— 现代图形化分流客户端实操
- 🛠️ **[Clash 节点超时 / 全红故障排查与修复步骤](/issues/clash-nodes-timeout/)** —— 5 步排查 TLS 证书校验与系统时间偏差
- 🤖 **[ChatGPT Access Denied 1020 报错排查与解决指南](/issues/chatgpt-access-denied/)** —— 浏览器安全与 AI 访问保障
- ⚡ **[2026 高速稳定翻墙机场推荐与评测排行榜](/recommend/airport/)** —— 企业级 IEPL 专线晚高峰实测数据汇总

