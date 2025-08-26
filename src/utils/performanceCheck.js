// src/utils/performanceCheck.js
export const performanceChecker = {
  // 检查包大小
  checkBundleSize: () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Bundle size check should be run in production build');
      return;
    }

    // 这里可以集成 webpack-bundle-analyzer 的结果
    console.log('Check bundle size with: npm run build && npm run analyze');
  },

  // 检查未使用的依赖
  checkUnusedDependencies: () => {
    console.log('Run: npx depcheck to check unused dependencies');
  },

  // 检查重复依赖
  checkDuplicateDependencies: () => {
    console.log('Run: npm ls --depth=0 to check duplicate dependencies');
  },

  // 检查组件渲染性能
  checkRenderPerformance: (componentName, renderFn) => {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();

    console.log(`${componentName} render time: ${end - start}ms`);

    if (end - start > 16) {
      // 超过一帧的时间
      console.warn(`${componentName} render time is too slow!`);
    }

    return result;
  },

  // 检查内存泄漏
  checkMemoryLeak: () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      console.log(`Memory usage: ${usage.toFixed(2)}%`);

      if (usage > 80) {
        console.warn('Memory usage is high! Possible memory leak.');
      }
    }
  },

  // 完整性能检查
  runFullCheck: () => {
    performanceChecker.checkBundleSize();
    performanceChecker.checkUnusedDependencies();
    performanceChecker.checkDuplicateDependencies();
    performanceChecker.checkMemoryLeak();
  },
};
