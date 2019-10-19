module.exports = {
    testEnvironment    : 'node',
    verbose            : true,
    collectCoverage    : true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory  : 'coverage',
    coverageReporters  : ['json-summary', 'text-summary', 'html'],
    roots              : ['<rootDir>/src/', '<rootDir>/test/'],
//  globalSetup        : 'test/setup.js',
//  globalTeardown     : 'test/teardown.js'
}
