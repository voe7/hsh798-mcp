import {setAuthToken,get} from "../http/http-request.js";
import {tokenRead} from "../login/JWToken.js";

interface RootResponse {
    code: number;
    data: ResponseData;
    time: number;
}

interface ResponseData {
    accScoreRsp: AccScoreRsp;
    dailyRSP: DailyRSP;
    lotteryEnable: boolean;
    missions: Mission[];
}

interface AccScoreRsp {
    address: Address;
    daily: DailyInfo;
    gift: string;
    limits: LimitItem[];
    score: string;
    totalScore: string;
    validScore: string;
}

interface Address {
    city: string;
    prov: string;
}

interface DailyInfo {
    ltime: number;
    reword: number;
    week: number;
}

interface LimitItem {
    limit: number;
    refId: string;
}

interface DailyRSP {
    adId: string;
    config: DailyConfigItem[];
    score: number;
}

interface DailyConfigItem {
    msg: string;
    score: number;
    rule: number;
    type: number;
    title: string;
    day: number;
}

interface Mission {
    apply: number[];
    atype: number;
    begin: number;
    cnt: number;
    desc: string;
    end: number;
    id: string;
    imgs: string[];
    limit: number;
    mtype: number;
    name: string;
    range: number[];
    refId: string;
    score: number;
    stype: number[];
    type: number;
    url: string;
    validTime?: number;
}

async function checkScore() {
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token)
    }
    let ret =   await get<RootResponse>("/api/v1/acc/score/mission-lst");
    return ret.data.accScoreRsp as AccScoreRsp;
}

// !(async () => {
//     console.log(await checkScore());
// })()

export {
    checkScore
};