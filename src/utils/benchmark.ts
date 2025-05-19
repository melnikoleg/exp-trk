// src/utils/benchmark.ts
import {
  getPerformanceMetrics,
  clearPerformanceMetrics,
  PerformanceMetric,
} from "./performance";

/**
 * Interface for benchmark results
 */
export interface BenchmarkResult {
  componentName: string;
  averageRenderTime: number;
  renderCount: number;
  minTime: number;
  maxTime: number;
}

/**
 * Interface for benchmark snapshot comparison
 */
export interface BenchmarkComparison {
  componentName: string;
  beforeAvgTime: number;
  afterAvgTime: number;
  difference: number;
  percentImprovement: number;
}

/**
 * Class to run and compare performance benchmarks
 */
export class PerformanceBenchmark {
  private beforeSnapshot: PerformanceMetric[] = [];
  private afterSnapshot: PerformanceMetric[] = [];

  /**
   * Start a new benchmark session
   */
  startBenchmark(): void {
    clearPerformanceMetrics();
    this.beforeSnapshot = [];
    this.afterSnapshot = [];
    console.log("[Benchmark] Started new benchmark session");
  }

  /**
   * Take a snapshot of the current metrics as the "before" state
   */
  takeBeforeSnapshot(): void {
    this.beforeSnapshot = getPerformanceMetrics();
    console.log(
      `[Benchmark] Took "before" snapshot with ${this.beforeSnapshot.length} metrics`,
    );
  }

  /**
   * Take a snapshot of the current metrics as the "after" state
   */
  takeAfterSnapshot(): void {
    this.afterSnapshot = getPerformanceMetrics();
    console.log(
      `[Benchmark] Took "after" snapshot with ${this.afterSnapshot.length} metrics`,
    );
  }

  /**
   * Compare before and after snapshots to see improvements
   */
  compareSnapshots(): BenchmarkComparison[] {
    // Group metrics by component
    const beforeMetrics = this.groupMetricsByComponent(this.beforeSnapshot);
    const afterMetrics = this.groupMetricsByComponent(this.afterSnapshot);

    const comparisons: BenchmarkComparison[] = [];

    // Compare all components that appear in both snapshots
    for (const componentName of Object.keys(beforeMetrics)) {
      if (afterMetrics[componentName]) {
        const beforeAvg =
          beforeMetrics[componentName].totalTime /
          beforeMetrics[componentName].count;
        const afterAvg =
          afterMetrics[componentName].totalTime /
          afterMetrics[componentName].count;
        const difference = beforeAvg - afterAvg;
        const percentImprovement = (difference / beforeAvg) * 100;

        comparisons.push({
          componentName,
          beforeAvgTime: beforeAvg,
          afterAvgTime: afterAvg,
          difference,
          percentImprovement,
        });
      }
    }

    // Sort by improvement percentage (highest first)
    return comparisons.sort(
      (a, b) => b.percentImprovement - a.percentImprovement,
    );
  }

  /**
   * Get the current benchmark results
   */
  getResults(): BenchmarkResult[] {
    const metrics = getPerformanceMetrics();
    const groupedMetrics = this.groupMetricsByComponent(metrics);

    const results: BenchmarkResult[] = [];

    for (const [componentName, data] of Object.entries(groupedMetrics)) {
      const times = metrics
        .filter((m) => m.componentName === componentName)
        .map((m) => m.renderTime);

      results.push({
        componentName,
        averageRenderTime: data.totalTime / data.count,
        renderCount: data.count,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
      });
    }

    // Sort by average render time (slowest first)
    return results.sort((a, b) => b.averageRenderTime - a.averageRenderTime);
  }

  /**
   * Export benchmark results as JSON
   */
  exportResults(): string {
    const results = {
      timestamp: new Date().toISOString(),
      beforeSnapshot: this.processSnapshot(this.beforeSnapshot),
      afterSnapshot: this.processSnapshot(this.afterSnapshot),
      comparison: this.compareSnapshots(),
    };

    return JSON.stringify(results, null, 2);
  }

  /**
   * Helper to group metrics by component name
   */
  private groupMetricsByComponent(
    metrics: PerformanceMetric[],
  ): Record<string, { count: number; totalTime: number }> {
    const grouped: Record<string, { count: number; totalTime: number }> = {};

    metrics.forEach((metric) => {
      if (!grouped[metric.componentName]) {
        grouped[metric.componentName] = { count: 0, totalTime: 0 };
      }

      grouped[metric.componentName].count += 1;
      grouped[metric.componentName].totalTime += metric.renderTime;
    });

    return grouped;
  }

  /**
   * Process a snapshot for export
   */
  private processSnapshot(metrics: PerformanceMetric[]): BenchmarkResult[] {
    const groupedMetrics = this.groupMetricsByComponent(metrics);
    const results: BenchmarkResult[] = [];

    for (const [componentName, data] of Object.entries(groupedMetrics)) {
      const times = metrics
        .filter((m) => m.componentName === componentName)
        .map((m) => m.renderTime);

      results.push({
        componentName,
        averageRenderTime: data.totalTime / data.count,
        renderCount: data.count,
        minTime: Math.min(...times) || 0,
        maxTime: Math.max(...times) || 0,
      });
    }

    return results;
  }
}

// Create a singleton instance for easy access
export const benchmarkTool = new PerformanceBenchmark();
