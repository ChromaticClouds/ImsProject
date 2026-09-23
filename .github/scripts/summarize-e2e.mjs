import fs from 'node:fs';

const [, , resultPath, summaryPath] = process.argv;

if (!summaryPath) process.exit(0);

if (!fs.existsSync(resultPath)) {
  fs.appendFileSync(summaryPath, '## E2E Mutation Environment\n\nMutation result JSON was not generated.\n');
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
const stats = report.stats ?? {};
const duration =
  typeof stats.duration === "number"
    ? (stats.duration / 1000).toFixed(1) + "s"
    : "n/a";

const lines = [
  "## E2E Mutation Environment",
  "",
  "| Item | Result |",
  "| --- | ---: |",
  '| Expected / passed | ' + (stats.expected ?? 0) + ' |',
  '| Unexpected / failed | ' + (stats.unexpected ?? 0) + ' |',
  '| Skipped | ' + (stats.skipped ?? 0) + ' |',
  "| Duration | " + duration + " |",
  "",
  "### Scope",
  "- Environment: disposable MySQL + Redis + Spring API",
  "- Seeded identities: FIRST_ADMIN, SECOND_ADMIN, EMPLOYEE",
  "- Business mutation scenario: not implemented yet",
  "- Database invariant verification: not implemented yet",
  "- Real email delivery: disabled",
];

fs.appendFileSync(summaryPath, lines.join('\n') + '\n');
