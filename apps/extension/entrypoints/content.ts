// Content scripts only observe/augment host pages and talk to the background worker via validated messages.
export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    // Keep content scripts minimal; delegate product logic to background / shared packages.
  },
});
