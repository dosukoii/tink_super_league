/**
 * 生成一个指定范围内的真随机整数 [min, max]
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 真随机整数
 * 使用示例：import { trueRandomInt } from './utils/random'; 
            const random = trueRandomInt(10, 20);
            console.log(`随机数是：${random}`);
 */
export function trueRandomInt(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new Error('参数错误：请确保 min 和 max 是整数，且 min ≤ max');
  }

  const range = max - min + 1;
  const maxUint32 = 2 ** 32;
  const maxAcceptable = maxUint32 - (maxUint32 % range);  // 拒绝偏差区域

  const uint32 = new Uint32Array(1);
  let randomValue: number;

  do {
    crypto.getRandomValues(uint32);
    randomValue = uint32[0];
  } while (randomValue >= maxAcceptable);  // 避免偏差，保持均匀分布

  return min + (randomValue % range);
}
