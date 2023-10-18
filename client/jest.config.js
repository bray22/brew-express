module.exports = {
  // Use the ts-jest preset for TypeScript files
  preset: 'ts-jest',
  
  // Define file extensions for modules
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Use babel-jest for JavaScript files
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Use the "jsdom" test environment for a browser-like environment
  testEnvironment: 'jsdom',
  

  // Optionally, you can configure module name mappers to handle CSS or other file imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Add any other Jest configurations as needed
  // ...
};
