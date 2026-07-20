module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  modulePathIgnorePatterns: ["<rootDir>/build/"],
}
