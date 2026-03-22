import {setAuthToken,get} from "../http/http-request.js";
import {tokenRead} from "../login/JWToken.js";

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

    name: string; // 学校名称（冗余一份）

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
    let token = tokenRead();
    if(token){
        setAuthToken(token.data.al.token);
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
    }
    return "未登陆，请登陆";
}

export {
    getWallet
}