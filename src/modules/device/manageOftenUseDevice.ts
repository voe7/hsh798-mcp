import {setAuthToken,get} from "../http/http-request";
import {tokenRead} from "../login/JWToken";

type responBody = {
    code: number;
}
async function setOftenUseDevice(did:string,remove:number){
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token)
    }
    return await get<responBody>("/api/v1/dev/favo",{did,remove});
}
export {
    setOftenUseDevice
} ;