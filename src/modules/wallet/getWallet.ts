import {get} from "../http/http-request.js";

type Owner = {
    id: string;
    name: string;
    pn: string;
};

type EpInfo = {
    id: string;
    name: string;
};

type WalletEp = {
    id: string;

    name: string; 

    owner: Owner;

    ep: EpInfo;

    total: number;

    ofCash: number; // 线下现金
    ofGift: number; // 线下赠送

    olCash: number; // 线上现金
    olGift: number; // 线上赠送

    rtime: string; // 创建时间（字符串时间戳）
    utime: string; // 更新时间
};

type EpsResponse = {
    eps: WalletEp[];
};

type DataResponse = {
    code: number;
    data: EpsResponse;
}

async function getWallet(){
    try {
        let ret:DataResponse = await get<DataResponse>("/api/v1/acc/wallet/owner?eid=&all=true");
        if(ret.code === 0 ){
            let eps:WalletEp[] = ret.data.eps;
            let msg:string  = ""
            for (let i = 0; i < eps.length; i++) {
                msg+=(i+1)+"."+eps[i].name+"-"+eps[i].total+"元\n";
            }
            return msg;
        }
        return JSON.stringify(ret);
    } catch (e: any) {
        return e.message || "未登录或请求失败，请检查";
    }
}

export {
    getWallet
}