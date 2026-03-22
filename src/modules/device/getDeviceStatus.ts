import {setAuthToken,get} from "../http/http-request.js";

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

!(async () => {
    let token: string = "1358cf76543c4f88ba6cc59b864a82fa";
    setAuthToken(token);
    let rsp = await getDeviceStatus("869810053232809");
    //genne.status , 99 未使用， 1 正在使用
    //status, 1 在线 ， 0 不在线
    console.log(rsp.gene.status);
})();