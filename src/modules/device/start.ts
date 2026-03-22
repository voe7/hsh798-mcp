import {setAuthToken,get} from "../http/http-request";
import {tokenRead} from "../login/JWToken";

interface responBody {
    code:number
}

async function startDevice( did:string) {
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token)
    }
    return await get<responBody>("/api/v1/dev/start",{did});
}

export {
    startDevice
};