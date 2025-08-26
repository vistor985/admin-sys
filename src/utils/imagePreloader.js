// src/utils/imagePreloader.js
class ImagePreloader {
  constructor() {
    this.cache = new Set();
    this.loading = new Set();
  }

  // 预加载单个图片
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(src)) {
        resolve(src);
        return;
      }

      if (this.loading.has(src)) {
        return;
      }

      this.loading.add(src);

      const img = new Image();
      img.onload = () => {
        this.cache.add(src);
        this.loading.delete(src);
        resolve(src);
      };
      img.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }

  // 批量预加载
  async preloadImages(srcs, options = {}) {
    const {
      concurrent = 3, // 并发数量
      retries = 2, // 重试次数
      onProgress, // 进度回调
    } = options;

    const results = [];
    let completed = 0;

    // 分批处理
    for (let i = 0; i < srcs.length; i += concurrent) {
      const batch = srcs.slice(i, i + concurrent);

      const batchPromises = batch.map(async (src) => {
        let attempts = 0;
        while (attempts <= retries) {
          try {
            const result = await this.preloadImage(src);
            completed++;
            onProgress?.(completed, srcs.length);
            return result;
          } catch (error) {
            attempts++;
            if (attempts > retries) {
              completed++;
              onProgress?.(completed, srcs.length);
              return null; // 失败的图片返回null
            }
            // 等待一段时间后重试
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results.filter(Boolean); // 过滤掉失败的图片
  }

  // 检查图片是否已缓存
  isImageCached(src) {
    return this.cache.has(src);
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
  }
}

export const imagePreloader = new ImagePreloader();
