/**
 * 将路径中重复的正斜杆替换成单个斜杆隔开的字符串
 *
 * @param path 要处理的路径
 * @returns {string} 将/去重后的结果
 */
export const uniqueSlash = (path: string) => path.replace(/(https?:\/)|(\/)+/g, '$1$2');
