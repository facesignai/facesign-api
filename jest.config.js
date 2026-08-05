/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  // build/ holds a copy of package.json; without this jest reports a haste collision.
  modulePathIgnorePatterns: ["<rootDir>/build/"],
}
