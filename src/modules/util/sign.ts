import crypto from 'crypto';

//计算时间戳
function calcT(serverTimeMs: number, syncLocalMs: number, nowMs: number = Date.now()): number {
    return Math.floor((nowMs - syncLocalMs + serverTimeMs) / 10000) * 10;
}
//生成签名
function buildSign(
    adId: string,
    token: string,
    uid: string,
    serverTimeMs: number,
    syncLocalMs: number,
    nowMs: number = Date.now()
):string {
    const tokenTail8 = (token || '').slice(-8);
    const uidTail8 = (uid || '').slice(-8);
    const t = String(calcT(serverTimeMs, syncLocalMs, nowMs));
    const raw = `${adId}${t}${tokenTail8}${uidTail8}`;
    return crypto.createHash('md5').update(raw).digest('hex');
}

export {
    buildSign
}