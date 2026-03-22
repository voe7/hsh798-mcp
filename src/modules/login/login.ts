import axios from 'axios';
import {basicURL, random, UA,getCaptchaResult} from "./captcha";
import {LoginResponse} from "./JWToken"

export interface SendSMSResult {
    code: number;
    msg?: string;
    [key: string]: any;
}
//发送登陆短信
async function sendSMS(phone: string, imgCode: string): Promise<SendSMSResult> {
    const ret = await axios.post(
        `${basicURL}/api/v1/acc/login/code`,
        {
            s: random,
            authCode: imgCode,
            un: phone
        },
        {
            headers: {
                'User-Agent': UA
            }
        }
    );
    return ret.data as SendSMSResult;
}
//登陆
async function login(un:string,smsCode:string): Promise<LoginResponse> {
    let ret =   await axios.post(
        `${basicURL}/api/v1/acc/login`,
        {
            authCode: smsCode,
            un: un
        },
        {
            headers: {
                'User-Agent': UA
            }
        }
    );
    return ret.data as LoginResponse;
}
export {
    sendSMS,
    login,
    getCaptchaResult
}