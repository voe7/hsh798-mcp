import axios from 'axios';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DdddOcr } from 'ddddocr-node';

const basicURL = 'https://i.ilife798.com';
const random = Math.random();
const timestamp = Date.now();
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/20) uni-app";

async function getCodeImg(): Promise<string> {
    const url = `${basicURL}/api/v1/captcha/?s=${random}&r=${timestamp}`;
    const filename = path.join(os.tmpdir(), `captcha-${Date.now()}.png`);

    try {
        const response = await axios.get<NodeJS.ReadableStream>(url, {
            responseType: 'stream',
            headers: {
                'User-Agent': UA
            }
        });

        await new Promise<void>((resolve, reject) => {
            const writer = fs.createWriteStream(filename);
            response.data.pipe(writer);

            response.data.on('error', reject);
            writer.on('finish', () => resolve());
            writer.on('error', reject);
        });

        return filename;
    } catch (error) {
        console.error('Error fetching captcha image:', error);
        throw error;
    }
}

async function getCaptchaResult(): Promise<string> {
    const ddddOcr = new DdddOcr();
    const filePath = await getCodeImg();

    try {
        return await ddddOcr.classification(filePath);
    } finally {
        try {
            fs.unlinkSync(filePath);
        } catch {}
    }
}

export {
    UA,
    basicURL,
    random,
    getCaptchaResult,
};