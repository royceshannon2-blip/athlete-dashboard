import { useState } from "react";
import { runSuite } from "@/testing/test-runner";
import { basketballDrillCycleTests, basketballHistoricalTests, basketballPerformanceTests } from "@/testing/suite-basketball";
import { jumpingExerciseCycleTests, jumpingHistoricalTests, jumpingPerformanceTests } from "@/testing/suite-jumping";
import type { TestResult } from "@/testing/test-runner";
import { clearWeightLog } from "@/testing/seed-utils";

const SUITES = [
  { name: "Basketball Drill Cycle", tests: basketballDrillCycleTests },
  { name: "Basketball Historical", tests: basketballHistoricalTests },
  { name: "Basketball Performance", tests: basketballPerformanceTests },
  { name: "Jumping Exercise Cycle", tests: jumpingExerciseCycleTests },
  { name: "Jumping Historical", tests: jumpingHistoricalTests },
  { name: "Jumping Performance", tests: jumpingPerformanceTests },
];

export function TestRunner() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const handleRunSuite = async (suiteIndex: number) => {
    setIsRunning(true);
    setCurrentTest(null);
    const suite = SUITES[suiteIndex];
    const suiteResults = await runSuite(suite.tests);
    setResults((prev) => [...prev, ...suiteResults]);
    setIsRunning(false);
  };

  const handleRunAll = async () => {
    setIsRunning(true);
    setResults([]);
    const allResults: TestResult[] = [];

    for (const suite of SUITES) {
      const suiteResults = await runSuite(suite.tests);
      allResults.push(...suiteResults);
    }

    setResults(allResults);
    setIsRunning(false);
  };

  const handleClear = () => {
    clearWeightLog();
    setResults([]);
    setCurrentTest(null);
  };

  const passed = results.filter((r) => r.verdict === "PASS").length;
  const failed = results.filter((r) => r.verdict === "FAIL").length;
  const warned = results.filter((r) => r.verdict === "WARN").length;

  const summaryColor =
    failed > 0 ? "bg-red-100 text-red-800" : warned > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Haiku-Powered Test Runner</h1>

      {/* Control Panel */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <h2 className="font-semibold">Basketball Suites</h2>
          {SUITES.slice(0, 3).map((suite, idx) => (
            <button
              key={idx}
              onClick={() => handleRunSuite(idx)}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 text-sm"
            >
              {suite.name}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">Jumping Suites</h2>
          {SUITES.slice(3, 6).map((suite, idx) => (
            <button
              key={idx + 3}
              onClick={() => handleRunSuite(idx + 3)}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 text-sm"
            >
              {suite.name}
            </button>
          ))}
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleRunAll}
          disabled={isRunning}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded disabled:opacity-50"
        >
          Run All Tests
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded"
        >
          Clear localStorage & Reset
        </button>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <div className={`p-4 rounded mb-6 font-semibold ${summaryColor}`}>
          {passed} passed · {failed} failed · {warned} warnings
        </div>
      )}

      {/* Current Running Test */}
      {isRunning && currentTest && (
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 bg-blue-500 rounded-full"></div>
            <span>{currentTest}</span>
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-3">Test ID</th>
              <th className="text-left py-2 px-3">Description</th>
              <th className="text-left py-2 px-3">Verdict</th>
              <th className="text-left py-2 px-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              const verdictColor =
                result.verdict === "PASS"
                  ? "bg-green-100 text-green-800"
                  : result.verdict === "FAIL"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800";

              return (
                <tr key={result.id} className="border-b border-gray-200">
                  <td className="py-3 px-3 font-mono text-xs">{result.id}</td>
                  <td className="py-3 px-3">{/* description from test case */}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${verdictColor}`}>
                      {result.verdict}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs">{result.reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {results.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-12">
          Click a suite button above to run tests
        </div>
      )}
    </div>
  );
}
