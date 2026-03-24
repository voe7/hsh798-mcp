import {get} from "../http/http-request.js"

type GeoPoint = {
    coordinates: [number, number];
    type: "Point";
};

type DeviceAddress = {
    city: string;
    detail: string;
    dist: string;
    prov: string;
    geo: GeoPoint;
};

type DeviceBm = {
    brand: string;
    dtype: number;
    model: string;
    parts: any[];
    sensors: number[];
    unit: string;
};

type ContactInfo = {
    name: string;
    pn: string;
};

type DeviceSetting = {
    dmode: number;
    emode: number;
    nfcUseOpen: number;
    payPwd: number;
    showAd: number;
};

type DeviceEp = {
    id: string;
    name: string;
    contact: ContactInfo;
    prds: number[];
    setting: DeviceSetting;
};

type DeviceExt = {
    mac: string;
    startT: string;
    endT: string;
};

type DeviceGene = {
    mode: number;
    status: number;
};

type DeviceLockState = {
    valid: boolean;
};

type DeviceSub = {
    out: number;
    status: number;
};

type Device = {
    id: string;
    name: string;

    addr: DeviceAddress;
    bm: DeviceBm;

    btype: number;
    ntype: number;
    gtype: number;

    csig: number;

    ep: DeviceEp;

    ext: DeviceExt;

    fmv: string;

    gene: DeviceGene;

    gs: Record<string, any>;

    ls: DeviceLockState;

    status: number;
    subs: DeviceSub[];
    utime: number;
};
type Data = {
    device:Device
}
type deviceResponse = {
    code: number;
    data: Data;
}

async function getDeviceInfo(did: string):Promise<Device> {
    let rsp = await get<deviceResponse>("/api/v1/ui/app/dev/home",{did});
    return rsp.data.device;
}

export {
    getDeviceInfo
}