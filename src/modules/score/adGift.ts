import {setAuthToken,post} from "../http/http-request.js";
import {buildSign} from "../util/sign.js"
import {tokenRead} from "../login/JWToken.js"

interface AddScoreBody {
    adId: string;
    addScore:number;
    addScoreType:number;
    type: number ;
}
type responBody = {
    code: number;
}
//签到
async function adGift(){
    const body: AddScoreBody = {
        adId: 'popsreen',
        addScore:10,
        addScoreType:4,
        type: 101
    };
    let signA:string = "";
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token)
        let uid = retToken.data.al.uid;
        let serverTimeMs  = retToken.time;
        let syncLocalMs = serverTimeMs+1;
        signA = buildSign(body.adId,token,uid,serverTimeMs,syncLocalMs);
    }
    return await post<responBody>(`/api/v1/acc/score/score-send?sign=${signA}&s=0`,body);
}
// !(async ()=>{
//     console.log(await adGift());
// })()
export {
    adGift
}