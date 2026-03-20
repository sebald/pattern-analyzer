const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: '.',
});

/** @type {import('jest').Config} */
const config = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@pattern-analyzer/xws/(.*)$': '<rootDir>/../../packages/xws/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  prettierPath: null,
};

module.exports = createJestConfig(config);
