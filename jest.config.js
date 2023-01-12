// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  moduleNameMapper: {
    '@vending-machine/(.*)$': '<rootDir>/src/$1',
    '@tests/(.*)$': '<rootDir>/tests/$1',
    '^uuid$': 'uuid',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  modulePathIgnorePatterns: ['<rootDir>/tests/utils'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
