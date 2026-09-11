import {get} from "../http/http-request.js";

interface responBody {
    code:number
}

async function startDevice( did:string) {
    return await get<responBody>("/api/v1/dev/start",{did});
}

export {
    startDevice
};