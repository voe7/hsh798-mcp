import {setAuthToken,get} from "../http/http-request.js";
import {tokenRead} from "../login/JWToken.js";

interface responBody {
    code:number
}

async function endDevice( did:string) {
    let retToken= tokenRead();
    if(retToken){
        let token = retToken.data.al.token;
        setAuthToken(token)
    }
    return await get<responBody>("/api/v1/dev/end",{did});
}

export {
    endDevice
};