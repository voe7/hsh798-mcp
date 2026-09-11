import {get} from "../http/http-request.js";

//声明返回值结构
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
    dtype: number;
    img: string;
};
type DeviceEp = {
    id: string;
    name: string;
};
type DeviceGene = {
    status: number;
};
type DeviceOwner = {
    id: string;
};
type OftenUseDevice = {
    id: string;
    name: string;
    status: number;
    ltime: number;
    ntype: number;
    btype: number;
    addr: DeviceAddress;
    bm: DeviceBm;
    ep: DeviceEp;
    gene: DeviceGene;
    owner: DeviceOwner;
};
type OftenUseDevicesData = {
    favos: OftenUseDevice[];
};
type GetOftenUseDevicesResponse = {
    code: number;
    data: OftenUseDevicesData;
};

//获取常用设备
async function getOftenUseDevices() {
    let rsp =  await get<GetOftenUseDevicesResponse>("/api/v1/ui/app/master");
    return rsp.data.favos;
}

export {
    getOftenUseDevices
}