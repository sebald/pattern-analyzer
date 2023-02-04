const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: '.',
});

/** @type {import('jest').Config} */
const config = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    'app/$': '<rootDir>/app/$1',
    'components/$': '<rootDir>/components/$1',
    'lib/$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(config);
