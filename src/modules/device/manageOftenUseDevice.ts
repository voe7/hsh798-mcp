import {get} from "../http/http-request.js";

type responBody = {
    code: number;
}
async function setOftenUseDevice(did:string,remove:boolean){
    return await get<responBody>("/api/v1/dev/favo",{did,remove});
}
export {
    setOftenUseDevice
} ;