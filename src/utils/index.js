// src/utils/index.js - 常用工具函数

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @param {string} format - 格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 生成随机ID
 * @param {number} length - ID长度，默认8位
 * @returns {string} 随机ID字符串
 */
export const generateId = (length = 8) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 深拷贝后的对象
 */
// export const deepClone = (obj) => {
//   if (obj === null || typeof obj !== 'object') return obj;
//   if (obj instanceof Date) return new Date(obj.getTime());
//   if (obj instanceof Array) return obj.map((item) => deepClone(item));

//   const cloned = {};
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       cloned[key] = deepClone(obj[key]);
//     }
//   }
//   return cloned;
// };
export const deepClone = (obj, hash = new WeakMap()) => {
  // 基础类型 & 函数：直接返回
  if (obj === null || typeof obj !== 'object') return obj;

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 特殊内置对象
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

  if (obj instanceof Map) {
    const result = new Map();
    hash.set(obj, result);
    obj.forEach((value, key) => {
      result.set(deepClone(key, hash), deepClone(value, hash));
    });
    return result;
  }

  if (obj instanceof Set) {
    const result = new Set();
    hash.set(obj, result);
    obj.forEach((value) => {
      result.add(deepClone(value, hash));
    });
    return result;
  }

  // 保留原型
  const result = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));

  // 记录当前对象，防止循环引用
  hash.set(obj, result);

  // 复制自有属性（包括 Symbol）
  for (const key of Reflect.ownKeys(obj)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key], hash);
    }
  }

  return result;
};

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式（中国大陆）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否为有效手机号
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
