module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.js"],
  setupFilesAfterEnv: [
    "<rootDir>/test/jest.setup.js",
    "<rootDir>/test/__mocks__/ui5.js"
  ]
};