import {setAuthToken,post} from "../http/http-request.js";
import {tokenRead} from "../login/JWToken.js";

interface rsp{
    code:number;
}
interface reqBody{
    userScore:number;
}
//开启积分抵扣
async function setPointUseDevices (status:number)  {
    const body: reqBody = {
        userScore:status
    };
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token)
    }
    return await post<rsp>("/api/v1/acc/upt");
}

export {
    setPointUseDevices
}