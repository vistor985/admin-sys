// src/utils/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.isSupported = 'PerformanceObserver' in window;
  }

  // 开始计时
  startTiming(name) {
    performance.mark(`${name}-start`);
  }

  // 结束计时
  endTiming(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    this.metrics.set(name, measure.duration);

    return measure.duration;
  }

  // 监控首屏加载
  monitorPageLoad() {
    if (!this.isSupported) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.metrics.set('pageLoad', {
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            request: entry.responseStart - entry.requestStart,
            response: entry.responseEnd - entry.responseStart,
            domParse: entry.domContentLoadedEventStart - entry.responseEnd,
            domReady:
              entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            total: entry.loadEventEnd - entry.fetchStart,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  // 监控资源加载
  monitorResources() {
    if (!this.isSupported) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          entry.initiatorType === 'img' ||
          entry.initiatorType === 'script' ||
          entry.initiatorType === 'css'
        ) {
          this.metrics.set(`resource-${entry.name}`, {
            type: entry.initiatorType,
            size: entry.transferSize,
            duration: entry.duration,
            cached: entry.transferSize === 0,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  // 监控LCP (Largest Contentful Paint)
  monitorLCP() {
    if (!this.isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(observer);
  }

  // 监控FID (First Input Delay)
  monitorFID() {
    if (!this.isSupported) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.set('FID', entry.processingStart - entry.startTime);
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.push(observer);
  }

  // 监控CLS (Cumulative Layout Shift)
  monitorCLS() {
    if (!this.isSupported) return;

    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.set('CLS', clsValue);
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(observer);
  }

  // 获取内存使用情况
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  }

  // 获取所有指标
  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // 上报性能数据
  reportMetrics() {
    const metrics = this.getAllMetrics();
    const memory = this.getMemoryUsage();

    // 这里可以发送到分析服务
    console.log('Performance Metrics:', {
      ...metrics,
      memory,
    });

    // 发送到后端（示例）
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ metrics, memory, timestamp: Date.now() })
    // })
  }

  // 销毁监控
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

// 在应用启动时初始化
export const initPerformanceMonitoring = () => {
  performanceMonitor.monitorPageLoad();
  performanceMonitor.monitorResources();
  performanceMonitor.monitorLCP();
  performanceMonitor.monitorFID();
  performanceMonitor.monitorCLS();

  // 页面卸载时上报数据
  window.addEventListener('beforeunload', () => {
    performanceMonitor.reportMetrics();
  });

  // 定期上报（可选）
  setInterval(() => {
    performanceMonitor.reportMetrics();
  }, 60000); // 每分钟上报一次
};
