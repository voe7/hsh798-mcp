# 🤖 HSH798-MCP (惠生活798 MCP 服务)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Supported-brightgreen)](https://github.com/modelcontextprotocol)

**HSH798-MCP** 是一个专门为 **大模型 (LLM) / AI 助手** 量身打造的 Model Context Protocol (MCP) 服务。

## 🌟 为什么做这个项目？

在过去，如果你想通过手机控制“惠生活798”平台上的设备（如学校的饮水机、洗衣机等），你必须手动打开 App、输入密码、找到设备、点击开启。

**为了让 AI 助手能够像人类一样直接管理这些设备，本项目应运而生。**

我们将原本复杂的鉴权逻辑和繁琐的 HTTP 请求，全部封装成了大模型可以无缝理解并调用的标准 **MCP Tools**。现在，你只需要对支持 MCP 的 AI 助手（如 Claude、Cursor 等）说一句：**“帮我打开常用水表出水”**，AI 就能自动为你完成所有操作！

---

## 🛠️ MCP 工具列表 (Tools)

AI 助手连接到本项目后，将自动获得以下强大的能力（工具）：

### 🔐 账号与鉴权
- **`SEND_SMS`**：向指定手机号发送短信验证码（底层自动接入 OCR 识别突破图形验证码校验）。
- **`LOGIN`**：输入手机号和收到的短信验证码，执行账号登录，并在内存中静默维护鉴权 Token。

### 💰 资产查询
- **`GET_WALLET`**：查询并返回当前登录账户的钱包可用余额（如“山东济南大学泉城学院-18.66元”）。

### 🚰 智能设备操控
- **`GET_OFTEN_USE_DEVICES`**：获取账号下所有“收藏/常用”的设备列表，返回详细的设备名称与 15位 DID。
- **`SET_OR_RESET_OFTEN_USE_DEVICE`**：将指定设备加入常用列表，或从常用列表中移除。
- **`START_DEVICE`**：根据设备 DID，远程**开启**指定设备（例如开启开水机）。
- **`END_DEVICE`**：根据设备 DID，远程**关闭**指定设备。

---

## 🚀 下载与部署指南

### 1. 环境准备
确保您的设备上已经安装了 [Node.js](https://nodejs.org/) (推荐 v18 及以上版本) 和 npm。

### 2. 下载项目
克隆本项目到本地并进入目录：
```bash
git clone https://github.com/voe7/hsh798-mcp.git
cd hsh798-mcp
```

### 3. 安装依赖与构建
安装项目所需的所有依赖，并使用 TypeScript 编译器将源码编译为可执行的 JavaScript：
```bash
npm install
npm run build
```
*(编译成功后，根目录下会自动生成包含产物的 `dist` 文件夹)*

### 4. 挂载到 AI 客户端
以 **Claude Desktop** 或 **Cursor** 为例，您需要在对应的 MCP 配置文件（如 `claude_desktop_config.json`）中添加该服务的启动路径。

> **注意**：请将下方示例中的 `/绝对路径/指向/您的项目/hsh798-mcp` 替换为您本地克隆该项目的真实绝对路径。

```json
{
  "mcpServers": {
    "hsh798": {
      "command": "node",
      "args": [
        "/绝对路径/指向/您的项目/hsh798-mcp/dist/index.js"
      ]
    }
  }
}
```

配置保存并重启客户端后，大模型即可直接发现并使用本服务提供的所有工具！

---

## 💡 使用演示 (自然语言交互)
在 AI 聊天窗口中，您可以像这样跟 AI 交流：
1. **登录**："我的惠生活手机号是 123xxxx0000，帮我发个验证码。" -> *"收到验证码 123456，帮我登录。"*
2. **查余额**："我账户里还有多少钱？"
3. **控制**："列出我常用的设备"，或者 "帮我打开 'xx-开水'"。

---

## 📄 协议 (License)
本项目基于 [MIT License](LICENSE) 开源。