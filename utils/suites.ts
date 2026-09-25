// Suite tags. Add a tag to a test like this:
//   test('my test', { tag: SUITES.smoke }, async ({ page }) => { ... });
//
// Run everything:      npx playwright test
// Run one suite only:  npx playwright test --grep "@smoke"   (or: npm run smoke)
export const SUITES = {
    smoke: '@smoke',
};
