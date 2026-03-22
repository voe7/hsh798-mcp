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

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "token.json");

function tokenSet(data: LoginResponse): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function tokenRead(): LoginResponse | null {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as LoginResponse;
}

function tokenUpdate(newData: Partial<LoginResponse>): LoginResponse | null {
    const oldData = tokenRead();
    if (!oldData) return null;

    const updatedData: LoginResponse = {
        ...oldData,
        ...newData,
        data: {
            ...oldData.data,
            ...newData.data,
            al: {
                ...oldData.data.al,
                ...newData.data?.al,
            },
            ar: {
                ...oldData.data.ar,
                ...newData.data?.ar,
            },
        },
    };

    tokenSet(updatedData);
    return updatedData;
}

function tokenRemove(): void {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

export { tokenSet, tokenRead, tokenUpdate, tokenRemove };