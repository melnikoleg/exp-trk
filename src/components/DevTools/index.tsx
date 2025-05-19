// src/components/DevTools/index.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getPerformanceMetrics,
  clearPerformanceMetrics,
  PerformanceMetric,
} from "../../utils/performance";
import { benchmarkTool, BenchmarkComparison } from "../../utils/benchmark";
import styles from "./index.module.css";

interface DevToolsProps {
  show?: boolean;
}

const DevTools: React.FC<DevToolsProps> = ({ show = true }) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [benchmarkMode, setBenchmarkMode] = useState<
    "idle" | "before" | "after"
  >("idle");
  const [benchmarkResults, setBenchmarkResults] = useState<
    BenchmarkComparison[]
  >([]);

  // Group metrics by component name and calculate averages
  const groupedMetrics = React.useMemo(() => {
    const grouped: Record<
      string,
      { count: number; totalTime: number; average: number }
    > = {};

    metrics.forEach((metric) => {
      if (!grouped[metric.componentName]) {
        grouped[metric.componentName] = { count: 0, totalTime: 0, average: 0 };
      }

      grouped[metric.componentName].count += 1;
      grouped[metric.componentName].totalTime += metric.renderTime;
    });

    // Calculate averages
    Object.keys(grouped).forEach((key) => {
      grouped[key].average = grouped[key].totalTime / grouped[key].count;
    });

    // Sort by average render time (slowest first)
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b.average - a.average)
      .map(([name, stats]) => ({ name, ...stats }));
  }, [metrics]);

  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  // Clear metrics
  const handleClear = useCallback(() => {
    clearPerformanceMetrics();
    setMetrics([]);
  }, []);

  // Start/stop auto-refresh
  const toggleRefresh = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    } else {
      const id = window.setInterval(() => {
        setMetrics(getPerformanceMetrics());
      }, 1000);
      setRefreshInterval(id);
    }
  }, [refreshInterval]);

  // Start benchmark process
  const startBenchmark = useCallback(() => {
    benchmarkTool.startBenchmark();
    setBenchmarkMode("before");
    setBenchmarkResults([]);
    console.log('[DevTools] Starting benchmark - collect "before" metrics');
  }, []);

  // Record before snapshot
  const recordBeforeSnapshot = useCallback(() => {
    benchmarkTool.takeBeforeSnapshot();
    setBenchmarkMode("after");
    console.log(
      '[DevTools] Before snapshot recorded - now collect "after" metrics',
    );
  }, []);

  // Record after snapshot and compare
  const recordAfterSnapshot = useCallback(() => {
    benchmarkTool.takeAfterSnapshot();
    const results = benchmarkTool.compareSnapshots();
    setBenchmarkResults(results);
    setBenchmarkMode("idle");
    console.log("[DevTools] Benchmark completed", results);
  }, []);

  // Export benchmark results
  const exportBenchmark = useCallback(() => {
    const resultsJson = benchmarkTool.exportResults();

    // Create a downloadable file
    const blob = new Blob([resultsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `benchmark-results-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Initialize metrics
  useEffect(() => {
    setMetrics(getPerformanceMetrics());

    // Clean up interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Show/hide with keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        toggleVisibility();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleVisibility]);

  if (!show || !isVisible) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          background: "#333",
          color: "white",
          padding: "5px 10px",
          borderRadius: "3px",
          cursor: "pointer",
          zIndex: 10000,
          fontSize: "12px",
        }}
        onClick={toggleVisibility}
      >
        Show DevTools
      </div>
    );
  }

  return (
    <div className={styles.devToolsWrapper}>
      <div className={styles.devToolsHeader}>
        <span className={styles.devToolsTitle}>React Performance DevTools</span>
        <div className={styles.devToolsControls}>
          <button className={styles.devToolsButton} onClick={toggleRefresh}>
            {refreshInterval ? "Stop Refresh" : "Auto Refresh"}
          </button>
          <button className={styles.devToolsButton} onClick={handleClear}>
            Clear
          </button>
          <button className={styles.devToolsButton} onClick={toggleVisibility}>
            Hide
          </button>
        </div>
      </div>

      <div
        className={styles.benchmarkControls}
        style={{ margin: "10px 0", display: "flex", gap: "5px" }}
      >
        {benchmarkMode === "idle" && (
          <button className={styles.devToolsButton} onClick={startBenchmark}>
            Start Benchmark
          </button>
        )}

        {benchmarkMode === "before" && (
          <button
            className={styles.devToolsButton}
            onClick={recordBeforeSnapshot}
          >
            Record "Before" Snapshot
          </button>
        )}

        {benchmarkMode === "after" && (
          <button
            className={styles.devToolsButton}
            onClick={recordAfterSnapshot}
          >
            Record "After" Snapshot
          </button>
        )}

        {benchmarkResults.length > 0 && (
          <button className={styles.devToolsButton} onClick={exportBenchmark}>
            Export Results
          </button>
        )}
      </div>

      {benchmarkResults.length > 0 && (
        <div
          className={styles.benchmarkResults}
          style={{
            margin: "10px 0",
            padding: "10px",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <h4 style={{ margin: "0 0 8px" }}>Benchmark Comparison</h4>
          <table style={{ width: "100%", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Component</th>
                <th>Before (ms)</th>
                <th>After (ms)</th>
                <th>Improvement</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkResults.map((result) => (
                <tr key={result.componentName}>
                  <td>{result.componentName}</td>
                  <td style={{ textAlign: "center" }}>
                    {result.beforeAvgTime.toFixed(2)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {result.afterAvgTime.toFixed(2)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color:
                        result.percentImprovement > 0 ? "#8aff8a" : "#ff8a8a",
                    }}
                  >
                    {result.percentImprovement > 0 ? "+" : ""}
                    {result.percentImprovement.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.devToolsMetrics}>
        <p>Total components tracked: {groupedMetrics.length}</p>

        {groupedMetrics.map((metric) => (
          <div key={metric.name} className={styles.metricItem}>
            <div className={styles.metricItemHeader}>
              <span className={styles.metricName}>{metric.name}</span>
              <span
                className={
                  metric.average > 5
                    ? styles.metricValueSlow
                    : styles.metricValue
                }
              >
                {metric.average.toFixed(2)}ms
              </span>
            </div>
            <div>Renders: {metric.count}</div>
          </div>
        ))}
      </div>

      <div className={styles.benchmarkControls}>
        <h3>Benchmark Controls</h3>
        <button
          className={styles.devToolsButton}
          onClick={startBenchmark}
          disabled={benchmarkMode !== "idle"}
        >
          Start Benchmark
        </button>
        <button
          className={styles.devToolsButton}
          onClick={recordBeforeSnapshot}
          disabled={benchmarkMode !== "before"}
        >
          Record Before Snapshot
        </button>
        <button
          className={styles.devToolsButton}
          onClick={recordAfterSnapshot}
          disabled={benchmarkMode !== "after"}
        >
          Record After Snapshot
        </button>
        <button
          className={styles.devToolsButton}
          onClick={exportBenchmark}
          disabled={benchmarkResults.length === 0}
        >
          Export Results
        </button>

        {benchmarkMode !== "idle" && (
          <div>
            <p>Benchmark Mode: {benchmarkMode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DevTools);
