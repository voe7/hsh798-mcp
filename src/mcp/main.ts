import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {sendSMS, login, getCaptchaResult, SendSMSResult} from "../modules/login/login.js"
import {tokenSet,LoginResponse} from "../modules/login/JWToken.js"
import {getWallet} from "../modules/wallet/getWallet.js"
import {startDevice} from "../modules/device/start.js";
import {endDevice} from "../modules/device/end.js";
import {getOftenUseDevices} from "../modules/device/getOftenUseDevices.js";
import {setOftenUseDevice} from "../modules/device/manageOftenUseDevice.js";

// 创建 MCP 服务器
const server = new McpServer({
    name: "hsh798-helper",
    version: "1.0.0",
});

// 发送登陆短信
server.registerTool(
    "SEND_SMS",
    {
        title: "SEND_SMS",
        description: "向指定手机号发送惠生活798登录验证码短信。执行登录前必须先调用此工具获取短信验证码。",
        inputSchema: {
            phone: z
                .string()
                .trim()
                .describe("用于接收登录验证码的手机号")
                .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
        },
    },
    async ({ phone }) => {
        let imgCode:string = await getCaptchaResult();
        let ret:SendSMSResult = await sendSMS(phone,imgCode);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(ret),
                },
            ],
        };
    }
);
//登陆
server.registerTool(
    "LOGIN",
    {
        title: "LOGIN",
        description: "使用手机号和短信验证码登录惠生活798账户。",
        inputSchema: {
            phone: z
                .string()
                .trim()
                .describe("登录手机号")
                .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
            code: z
                .string()
                .trim()
                .length(6, "验证码必须是 6 位")
                .describe("短信验证码"),
        },
    },
    async ({ phone,code }) => {
        let ret:LoginResponse = await login(phone,code);
        tokenSet(ret);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(ret),
                },
            ],
        };
    }
);

//获取钱包余额
server.registerTool(
    "GET_WALLET",
    {
        title: "GET_WALLET",
        description: "获取当前登录账户的钱包可用余额信息。",
    },
    async () => {
        let msg:string = await getWallet();
        return {
            content: [
                {
                    type: "text",
                    text: msg
                },
            ],
        };
    }
);

//开启指定DID设备
server.registerTool(
    "START_DEVICE",
    {
        title: "START_DEVICE",
        description: "根据设备 DID 开启指定设备。",
        inputSchema: {
            DID: z
                .string()
                .trim()
                .length(15, "设备编码必须是15位")
                .describe("15 位设备 DID"),
        },
    },
    async ({DID}) => {
        let ret = await startDevice(DID);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(ret)
                },
            ],
        };
    }
);
//关闭指定DID设备
server.registerTool(
    "END_DEVICE",
    {
        title: "END_DEVICE",
        description: "根据设备 DID 关闭指定设备。",
        inputSchema: {
            DID: z
                .string()
                .trim()
                .length(15, "设备编码必须是15位")
                .describe("15 位设备 DID"),
        },
    },
    async ({DID}) => {
        let ret = await endDevice(DID);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(ret)
                },
            ],
        };
    }
);
//获取常用设备列表
server.registerTool(
    "GET_OFTEN_USE_DEVICES",
    {
        title: "GET_OFTEN_USE_DEVICES",
        description: "获取当前账户的常用设备列表。"
    },
    async () => {
        let ret = await getOftenUseDevices();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(ret)
                },
            ],
        };
    }
);
//设置或取消常用设备
server.registerTool(
    "SET_OR_RESET_OFTEN_USE_DEVICE",
    {
        title: "SET_OR_RESET_OFTEN_USE_DEVICE",
        description: "将指定设备设置为常用设备，或取消其常用设备状态。",
        inputSchema: {
            DID: z
                .string()
                .trim()
                .length(15, "设备编码必须是15位")
                .describe("15 位设备 DID"),
            remove:z.boolean().describe("操作类型：false 表示设为常用，true 表示取消常用")
        },
    },
    async ({DID,remove}) => {
        let ret = await setOftenUseDevice(DID,remove);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(ret)
                },
            ],
        };
    }
);


export {
    StdioServerTransport,
    server
}
