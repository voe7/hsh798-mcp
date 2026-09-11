import {get} from "../http/http-request.js";

interface responBody {
    code:number
}

async function endDevice( did:string) {
    return await get<responBody>("/api/v1/dev/end",{did});
}

export {
    endDevice
};