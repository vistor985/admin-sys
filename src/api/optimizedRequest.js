// src/api/optimizedRequest.js
import axios from 'axios';

// 1. 请求缓存
class RequestCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    // 5分钟TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  generateKey(url, params) {
    return `${url}:${JSON.stringify(params)}`;
  }

  get(url, params) {
    const key = this.generateKey(url, params);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    return null;
  }

  set(url, params, data) {
    const key = this.generateKey(url, params);

    // 清理过期缓存
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }
}

// 2. 请求去重
class RequestDeduplication {
  constructor() {
    this.pendingRequests = new Map();
  }

  generateKey(config) {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
  }

  async request(config) {
    const key = this.generateKey(config);

    // 如果有相同的请求正在进行，返回同一个Promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const requestPromise = axios(config).finally(() => {
      // 请求完成后移除
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }
}

// 3. 创建优化的请求实例
const cache = new RequestCache();
const deduplication = new RequestDeduplication();

const optimizedRequest = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
optimizedRequest.interceptors.request.use(
  (config) => {
    // 对GET请求启用缓存
    if (config.method === 'get') {
      const cached = cache.get(config.url, config.params);
      if (cached) {
        // 返回缓存的数据
        return Promise.resolve({
          ...config,
          data: cached,
          status: 200,
          fromCache: true,
        });
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
optimizedRequest.interceptors.response.use(
  (response) => {
    // 缓存GET请求的响应
    if (response.config.method === 'get' && !response.fromCache) {
      cache.set(response.config.url, response.config.params, response.data);
    }

    return response;
  },
  (error) => Promise.reject(error)
);

// 4. 批量请求工具
class BatchRequester {
  constructor(delay = 50) {
    this.delay = delay;
    this.queue = [];
    this.timer = null;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.flush();
      }, this.delay);
    });
  }

  async flush() {
    if (this.queue.length === 0) return;

    const currentQueue = [...this.queue];
    this.queue = [];

    try {
      // 并行执行所有请求
      const promises = currentQueue.map(({ request }) => request());
      const results = await Promise.allSettled(promises);

      // 处理结果
      results.forEach((result, index) => {
        const { resolve, reject } = currentQueue[index];

        if (result.status === 'fulfilled') {
          resolve(result.value);
        } else {
          reject(result.reason);
        }
      });
    } catch (error) {
      // 如果批量处理失败，拒绝所有请求
      currentQueue.forEach(({ reject }) => reject(error));
    }
  }
}

const batchRequester = new BatchRequester();

// 5. 优化的API方法
export const optimizedAPI = {
  // 普通请求
  request: (config) => deduplication.request(config),

  // 批量请求
  batchRequest: (requestFn) => batchRequester.add(requestFn),

  // GET请求（带缓存）
  get: (url, params) => optimizedRequest.get(url, { params }),

  // POST请求
  post: (url, data) => optimizedRequest.post(url, data),

  // PUT请求
  put: (url, data) => optimizedRequest.put(url, data),

  // DELETE请求
  delete: (url) => optimizedRequest.delete(url),

  // 清除缓存
  clearCache: () => cache.clear(),

  // 预加载数据
  preload: async (requests) => {
    const promises = requests.map(
      (req) => optimizedRequest(req).catch(() => null) // 忽略预加载失败
    );
    await Promise.all(promises);
  },
};
