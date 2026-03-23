import { adGift } from "./adGift.js";
import { videoGift } from "./videoGift.js";
import { checkScore } from "./checkScore.js";
import { checkIn } from "./checkIn.js";

interface TaskAttempt {
    attempt: number;
    success: boolean;
    code?: number;
    error?: string;
}

interface TaskResult {
    totalAttempts: number;
    successCount: number;
    failedCount: number;
    pointsGained: number;
    details: TaskAttempt[];
}

interface CompleteDailyTasksResult {
    checkInTask: TaskResult;
    adTask: TaskResult;
    videoTask: TaskResult;
    totalPointsGained: number;
    currentPoints: string;
}

/**
 * 等待指定毫秒数
 * @param ms - 等待时间（毫秒）
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 批量完成某类任务
 * @param taskFunction - 任务执行函数
 * @param count - 执行次数
 * @returns 任务执行结果
 */
async function executeTaskBatch(
    taskFunction: () => Promise<{ code: number }>,
    count: number
): Promise<TaskResult> {
    const details: TaskAttempt[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 1; i <= count; i++) {
        const attempt: TaskAttempt = {
            attempt: i,
            success: false,
        };

        try {
            const result = await taskFunction();
            
            if (result.code === 0) {
                attempt.success = true;
                attempt.code = result.code;
                successCount++;
            } else {
                attempt.success = false;
                attempt.code = result.code;
                failedCount++;
            }
        } catch (error) {
            attempt.success = false;
            attempt.error = error instanceof Error ? error.message : String(error);
            failedCount++;
        }

        details.push(attempt);

        // 如果不是最后一次，等待5秒
        if (i < count) {
            await sleep(5000);
        }
    }

    return {
        totalAttempts: count,
        successCount,
        failedCount,
        pointsGained: 0, // 稍后计算
        details,
    };
}

/**
 * 完成所有每日任务（签到 + 广告任务 + 视频任务）
 * @param weekday - 本周第几天（1-7，默认按当前日期计算）
 * @param adCount - 广告任务执行次数（默认5次）
 * @param videoCount - 视频任务执行次数（默认5次）
 * @returns 所有任务执行结果统计
 */
async function completeDailyTasks(
    weekday?: number,
    adCount: number = 5,
    videoCount: number = 5
): Promise<CompleteDailyTasksResult> {
    // 参数验证
    const currentWeekday = new Date().getDay();
    const calculatedWeekday = currentWeekday === 0 ? 7 : currentWeekday;
    const actualWeekday = weekday !== undefined
        ? Math.min(Math.max(1, Math.floor(weekday)), 7)
        : calculatedWeekday;
    const actualAdCount = Math.min(Math.max(0, adCount), 5);
    const actualVideoCount = Math.min(Math.max(0, videoCount), 5);

    // 查询初始积分
    let initialPoints = "0";
    try {
        const scoreInfo = await checkScore();
        initialPoints = scoreInfo.score;
    } catch (error) {
        console.error("获取初始积分失败:", error);
    }

    // 执行签到任务
    const checkInTask = await executeTaskBatch(() => checkIn(actualWeekday), 1);

    // 签到后等待5秒，避免请求过于频繁
    if (actualAdCount > 0 || actualVideoCount > 0) {
        await sleep(5000);
    }

    // 执行广告任务
    let adTask: TaskResult = {
        totalAttempts: 0,
        successCount: 0,
        failedCount: 0,
        pointsGained: 0,
        details: [],
    };
    
    if (actualAdCount > 0) {
        adTask = await executeTaskBatch(adGift, actualAdCount);
    }

    // 广告任务完成后，查询积分
    let pointsAfterAd = initialPoints;
    try {
        const scoreInfo = await checkScore();
        pointsAfterAd = scoreInfo.score;
    } catch (error) {
        console.error("获取广告任务后积分失败:", error);
    }
    adTask.pointsGained = parseInt(pointsAfterAd) - parseInt(initialPoints);

    // 在视频任务前等待5秒，避免请求过于频繁
    if (actualAdCount > 0 && actualVideoCount > 0) {
        await sleep(5000);
    }

    // 执行视频任务
    let videoTask: TaskResult = {
        totalAttempts: 0,
        successCount: 0,
        failedCount: 0,
        pointsGained: 0,
        details: [],
    };
    
    if (actualVideoCount > 0) {
        videoTask = await executeTaskBatch(videoGift, actualVideoCount);
    }

    // 查询最终积分
    let finalPoints = pointsAfterAd;
    try {
        const scoreInfo = await checkScore();
        finalPoints = scoreInfo.score;
    } catch (error) {
        console.error("获取最终积分失败:", error);
    }
    videoTask.pointsGained = parseInt(finalPoints) - parseInt(pointsAfterAd);

    // 计算总积分增量
    const totalPointsGained = parseInt(finalPoints) - parseInt(initialPoints);

    return {
        checkInTask,
        adTask,
        videoTask,
        totalPointsGained,
        currentPoints: finalPoints,
    };
}

export { completeDailyTasks, CompleteDailyTasksResult };
