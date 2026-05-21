export interface TestCase {
  id: string;
  suite: string;
  description: string;
  seed: () => void; // writes to localStorage
  observe: () => string; // scrapes DOM, returns plain-text snapshot
  expected: string; // plain English description of what should be true
}

export interface TestResult {
  id: string;
  verdict: "PASS" | "FAIL" | "WARN";
  reason: string;
  raw: string; // the observed DOM snapshot
}

export async function runTest(tc: TestCase): Promise<TestResult> {
  // Seed
  tc.seed();

  // Observe
  const observed = tc.observe();

  // Evaluate with Haiku
  const evaluationPrompt = `You are a test evaluator. You will be given:
1. A description of what a UI feature is expected to show
2. A plain-text snapshot of what the UI actually shows

Return a JSON object with exactly these fields:
{
  "verdict": "PASS" | "FAIL" | "WARN",
  "reason": "one sentence explanation"
}

EXPECTED: ${tc.expected}

OBSERVED: ${observed}

Return only the JSON object. No preamble.`;

  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        id: tc.id,
        verdict: "WARN",
        reason: "VITE_ANTHROPIC_API_KEY not configured",
        raw: observed,
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: evaluationPrompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        id: tc.id,
        verdict: "WARN",
        reason: `Haiku API error: ${errorData.error?.message || "unknown"}`,
        raw: observed,
      };
    }

    const data = await response.json();
    const content = data.content[0].text;

    try {
      const parsed = JSON.parse(content);
      return {
        id: tc.id,
        verdict: parsed.verdict,
        reason: parsed.reason,
        raw: observed,
      };
    } catch {
      return {
        id: tc.id,
        verdict: "WARN",
        reason: "Haiku response was not valid JSON",
        raw: observed,
      };
    }
  } catch (err) {
    return {
      id: tc.id,
      verdict: "WARN",
      reason: `Network error: ${err instanceof Error ? err.message : "unknown"}`,
      raw: observed,
    };
  }
}

export async function runSuite(suiteTests: TestCase[]): Promise<TestResult[]> {
  const results: TestResult[] = [];
  for (const tc of suiteTests) {
    const result = await runTest(tc);
    results.push(result);
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return results;
}
