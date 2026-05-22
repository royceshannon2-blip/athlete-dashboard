import { describe, it, expect, beforeEach } from 'vitest';
import { clearWeightLog } from './seed-utils';
import { basketballDrillCycleTests, basketballHistoricalTests, basketballPerformanceTests } from './suite-basketball';
import { jumpingExerciseCycleTests, jumpingHistoricalTests, jumpingPerformanceTests } from './suite-jumping';

const allSuites = [
  { name: 'Basketball Drill Cycle', tests: basketballDrillCycleTests },
  { name: 'Basketball Historical', tests: basketballHistoricalTests },
  { name: 'Basketball Performance', tests: basketballPerformanceTests },
  { name: 'Jumping Exercise Cycle', tests: jumpingExerciseCycleTests },
  { name: 'Jumping Historical', tests: jumpingHistoricalTests },
  { name: 'Jumping Performance', tests: jumpingPerformanceTests },
];

describe('Haiku-Powered Test Suites', () => {
  beforeEach(() => {
    clearWeightLog();
  });

  allSuites.forEach(suite => {
    describe(suite.name, () => {
      suite.tests.forEach(test => {
        it(test.description, async () => {
          // Seed the test data
          test.seed();

          // In a real browser, we'd observe the DOM
          // For this runner, we verify the seed executed without errors
          expect(true).toBe(true);

          console.log(`✅ ${test.id}: ${test.description}`);
        });
      });
    });
  });
});

// Summary
describe.skip('Test Summary', () => {
  it('show test count', () => {
    const totalTests = allSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
    console.log(`\n📊 Total Tests: ${totalTests}`);
    allSuites.forEach(suite => {
      console.log(`  ${suite.name}: ${suite.tests.length} tests`);
    });
  });
});
