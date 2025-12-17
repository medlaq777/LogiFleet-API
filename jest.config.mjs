export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/test/**/*.test.js"],
  collectCoverageFrom: ["src/services/**/*.js", "src/controllers/**/*.js", "src/utils/**/*.js", "src/middlewares/**/*.js", "src/repositories/**/*.js", "src/routes/**/*.js"],
};
