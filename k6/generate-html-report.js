const reporter = require('k6-html-reporter');
const options = {
  jsonFile: process.argv[2] || 'reports/k6-login-results.json',
  output: process.argv[3] || 'reports/k6-login-report.html',
};
reporter.generateSummaryReport(options);
console.log('HTML report generated:', options.output);