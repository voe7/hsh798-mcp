import {get} from "../http/http-request.js";

type DeviceBm = {
    dtype: number;
};

type DeviceGene = {
    err: number;     // 错误码
    mode: number;    // 模式
    out: number;     // 当前出水量/累计量
    status: number;  // 设备状态
    vel: number;     // 流速
};

type DeviceSub = {
    out: number;
    status: number;
};

type Device = {
    id: string;
    status: number;

    bm: DeviceBm;
    gene: DeviceGene;

    subs: DeviceSub[];
};

type DeviceResponse = {
    code: number;
    data: {
        device: Device;
        prepay: boolean;
    };
};

async function getDeviceStatus(did: string): Promise<Device> {
    let response = await get<DeviceResponse>(`/api/v1/ui/app/dev/status`,{did});
    return response.data.device;
}

export {
    getDeviceStatus
}