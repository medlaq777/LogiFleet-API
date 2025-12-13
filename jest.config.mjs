export default {
  testEnvironment: "node",
  transform: {},
  transformIgnorePatterns: ["/node_modules/(?!(uuid)/)"],
  testMatch: ["**/test/**/*.test.js"],
};
