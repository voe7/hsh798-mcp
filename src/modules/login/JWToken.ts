import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export interface LoginResponse {
    code: number;
    data: {
        al: {
            atype: number;
            dtype: number;
            eid: string;
            stype: number;
            token: string;
            uid: string;
        };
        ar: {
            rids: string[];
            types: number[];
        };
        showAd: number;
    };
    time: number;
}

const ___filename = fileURLToPath(import.meta.url);
const ___dirname = path.dirname(___filename);
const filePath = path.join(___dirname, "token.json");

let cachedToken: LoginResponse | null = null;

function tokenSet(data: LoginResponse): void {
    cachedToken = data;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function tokenRead(): LoginResponse | null {
    if (cachedToken) return cachedToken;
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    cachedToken = JSON.parse(content) as LoginResponse;
    return cachedToken;
}

export { tokenSet, tokenRead };