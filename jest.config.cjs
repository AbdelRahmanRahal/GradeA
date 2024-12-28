module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/react/src'],
  setupFilesAfterEnv: ['<rootDir>/react/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/react/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/react/src/**/*.{spec,test}.{js,jsx}'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
}; 