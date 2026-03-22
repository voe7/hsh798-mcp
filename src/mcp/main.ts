import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {sendSMS, login, getCaptchaResult, SendSMSResult} from "../modules/login/login"
import {LoginResponse} from "../modules/login/JWToken"
import {getWallet} from "../modules/wallet/getWallet"
import {checkIn} from "../modules/score/checkIn"
import {adGift} from "../modules/score/adGift";
import {videoGift} from "../modules/score/videoGift";
import {DeviceManager} from "../modules/device/writer";
import {startDevice} from "../modules/device/start";
import {endDevice} from "../modules/device/end";
import {getOftenUseDevices} from "../modules/device/getOftenUseDevices";
import {setOftenUseDevice} from "../modules/device/manageOftenUseDevice";
import {checkScore} from "../modules/score/checkScore";

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
//完成每日签到
server.registerTool(
    "DAILY_CHECK_IN",
    {
        title: "DAILY_CHECK_IN",
        description: "执行每日签到任务。需传入当前是本周第几天。",
        inputSchema: {
            weekday: z
                .number()
                .describe("当前是本周第几天，通常取值为 1 到 7"),
        },
    },
    async ({weekday}) => {
        let ret = await checkIn(weekday);
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
//每日广告任务x5
server.registerTool(
    "DAILY_AD_TASK_5",
    {
        title: "DAILY_AD_TASK_5",
        description: "执行一次每日广告任务。该任务每日最多可完成 5 次；如需全部完成，请调用 5 次，并确保每次调用间隔不少于 5 秒。",
    },
    async () => {
        let ret = await adGift();
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
//每日视频任务x5
server.registerTool(
    "DAILY_VIDEO_TASK_5",
    {
        title: "DAILY_VIDEO_TASK_5",
        description: "执行一次每日视频任务。该任务每日最多可完成 5 次；如需全部完成，请调用 5 次，并确保每次调用间隔不少于 5 秒。",
    },
    async () => {
        let ret = await videoGift();
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
//新增设备
server.registerTool(
    "ADD_NEW_DEVICES",
    {
        title: "ADD_NEW_DEVICES",
        description: "新增一个设备到本地设备列表。需要提供设备名称和 15 位设备编号，新增成功后返回新设备信息。",
        inputSchema: {
            deviceName: z
                .string()
                .trim()
                .describe("设备名称"),
            deviceID: z
                .string()
                .trim()
                .length(15, "设备编码必须是15位")
                .describe("15 位设备编号"),
        },
    },
    async ({deviceName,deviceID}) => {
        const deviceManager = new DeviceManager();
        const newDevices = deviceManager.add(deviceName,deviceID);
        return {
            content: [
                {
                    type: "text",
                    text: "新增设备信息"+JSON.stringify(newDevices),
                },
            ],
        };
    }
);
//获取所有设备
server.registerTool(
    "GET_ALL_DEVICES",
    {
        title: "GET_ALL_DEVICES",
        description: "获取本地设备列表中的所有设备信息。",
    },
    async () => {
        const deviceManager = new DeviceManager();
        const allDevices = deviceManager.getAll();
        return {
            content: [
                {
                    type: "text",
                    text: "所有设备信息"+JSON.stringify(allDevices),
                },
            ],
        };
    }
);
//按ID删除设备
server.registerTool(
    "DEL_ID_DEVICE",
    {
        title: "DEL_ID_DEVICE",
        description: "根据设备 ID 删除指定设备，返回删除是否成功。",
        inputSchema: {
            ID: z
                .number()
                .describe("要删除的设备 ID")
        },
    },
    async ({ID}) => {
        const deviceManager = new DeviceManager();
        const allDevices = deviceManager.deleteById(ID);
        return {
            content: [
                {
                    type: "text",
                    text: "删除状态"+JSON.stringify(allDevices),
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
            remove:z.number().describe("操作类型：1 表示设为常用，0 表示取消常用")
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

//获取当前帐户积分
server.registerTool(
    "GET_ALL_SCORE",
    {
        title: "GET_ALL_SCORE",
        description: "获取当前登录账号的积分信息，包括可用积分、总积分等数据。",
    },
    async () => {
        let ret = await checkScore();
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