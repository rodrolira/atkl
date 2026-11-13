/** @type {import('jest').Config} */
// Este jest corre SOLO los tests del server. El cliente usa vitest (ver
// client/vite.config.js): sin acotar `roots`, el testMatch de abajo tambien
// levantaba client/src/**/__tests__, que importan de 'vitest' y hacian fallar
// la suite entera.
const config = {
  roots: ['<rootDir>/server'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { configFile: './.babelrc' }],
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
}

export default config
