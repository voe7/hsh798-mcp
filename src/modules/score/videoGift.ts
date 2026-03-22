import {setAuthToken,post} from "../http/http-request.js";
import {buildSign} from "../util/sign.js"
import {tokenRead} from "../login/JWToken.js"

interface AddScoreBody {
    adId: string;
    type?: number | null;
}
type responBody = {
    code: number;
}

//签到
async function videoGift(){
    const body: AddScoreBody = {
        adId: '1705776998',
        type: 101
    };
    let signV:string = "";
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token);
        let uid = retToken.data.al.uid;
        let serverTimeMs  = retToken.time;
        let syncLocalMs = serverTimeMs+1;
        signV = buildSign(body.adId,token,uid,serverTimeMs,syncLocalMs);
    }
    return await post<responBody>(`/api/v1/acc/score/score-send?sign=${signV}&s=0`,body);
}
export {
    videoGift
};