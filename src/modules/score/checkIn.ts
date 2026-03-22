import {post, setAuthToken} from "../http/http-request";
import {buildSign} from "../util/sign";
import {tokenRead} from "../login/JWToken"

interface AddScoreBody {
    adId: string;
    weekday?: number | null;
}
type responBody = {
    code: number;
}

//签到
async function checkIn(weekday:number){
    const body: AddScoreBody = {
        adId: 'DAILY_CHECK_IN',
        weekday: weekday
    };
    let sign:string = "";
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token)
        let uid = retToken.data.al.uid;
        let serverTimeMs  = retToken.time;
        console.log(token)
        let syncLocalMs = serverTimeMs+1;
        sign = buildSign(body.adId,token,uid,serverTimeMs,syncLocalMs);
    }
    return await post<responBody>(`/api/v1/acc/score/score-send?sign=${sign}&s=0`,body);
}
export {
    checkIn,
}