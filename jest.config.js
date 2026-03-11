module.exports = {
  transform: {
    '^.+\\.jsx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/?!@faker-js/faker'],
  testEnvironment: 'node',
};
