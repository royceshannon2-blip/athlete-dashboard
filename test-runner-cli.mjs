import playwright from 'playwright';

const { chromium } = playwright;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📡 Accessing test runner at http://localhost:5000/test-runner\n');
    await page.goto('http://localhost:5000/test-runner', { waitUntil: 'networkidle' });
    
    console.log('✅ Test runner UI loaded');
    console.log('🚀 Running all 26 basketball + jumping tests...\n');
    
    // Click Run All Tests button
    const runButton = await page.$('button:has-text("Run All Tests")');
    if (runButton) {
      await runButton.click();
      console.log('⏳ Tests executing (Haiku evaluating each test)...\n');
    }
    
    // Wait longer for tests to complete
    await page.waitForTimeout(10000);
    
    // Capture page HTML to check for results
    const pageContent = await page.content();
    
    // Look for the summary text
    if (pageContent.includes('passed')) {
      console.log('✅ Tests completed!\n');
      
      // Try to extract summary
      const match = pageContent.match(/(\d+)\s+passed\s+·\s+(\d+)\s+failed\s+·\s+(\d+)\s+warnings/);
      if (match) {
        const [_, passed, failed, warned] = match;
        console.log('📊 SUMMARY');
        console.log('─'.repeat(50));
        console.log(`  ✅ Passed:  ${passed}`);
        console.log(`  ❌ Failed:  ${failed}`);
        console.log(`  ⚠️  Warned:  ${warned}`);
        console.log(`  Total:   ${parseInt(passed) + parseInt(failed) + parseInt(warned)}/26\n`);
      }
    }
    
    // Extract table data
    const results = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          id: cells[0]?.textContent?.trim() || '?',
          verdict: cells[2]?.textContent?.trim() || '?',
          reason: cells[3]?.textContent?.trim().substring(0, 55) || '?',
        };
      });
    });
    
    if (results.length > 0) {
      console.log('📋 FIRST 10 TEST RESULTS');
      console.log('─'.repeat(80));
      console.log('ID'.padEnd(12) + 'VERDICT'.padEnd(8) + 'REASON');
      console.log('─'.repeat(80));
      
      results.slice(0, 10).forEach(r => {
        const icon = r.verdict === 'PASS' ? '✅' : r.verdict === 'FAIL' ? '❌' : '⚠️ ';
        console.log(`${icon} ${r.id.padEnd(10)} ${r.verdict.padEnd(6)} ${r.reason}`);
      });
      
      if (results.length > 10) {
        console.log(`\n... and ${results.length - 10} more results\n`);
      }
    } else {
      console.log('ℹ️  Tests require VITE_ANTHROPIC_API_KEY to run.');
      console.log('Without it, all tests return WARN verdicts.\n');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
