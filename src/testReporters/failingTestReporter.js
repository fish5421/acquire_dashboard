class FailingTestReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  async onRunComplete(contexts, results) {
    const fs = await import('fs');
    const path = await import('path');

    const failingTests = results.testResults.reduce((acc, testFile) => {
      const failingTestsInFile = testFile.testResults.filter(test => test.status === 'failed');
      if (failingTestsInFile.length > 0) {
        acc.push({
          file: path.relative(process.cwd(), testFile.testFilePath),
          tests: failingTestsInFile.map(test => ({
            name: test.fullName,
            error: test.failureMessages.join('\n')
          }))
        });
      }
      return acc;
    }, []);

    const reportContent = failingTests.map(file => {
      return `## ${file.file}\n\n${file.tests.map(test => 
        `### ${test.name}\n\`\`\`\n${test.error}\n\`\`\``
      ).join('\n\n')}`;
    }).join('\n\n');

    const reportPath = path.join(process.cwd(), 'claudeDev_docs', 'FailingTestCases.md');
    fs.writeFileSync(reportPath, `# Failing Test Cases\n\n${reportContent}`);
  }
}

export default FailingTestReporter;