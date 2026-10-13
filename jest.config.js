module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@reduxjs|react-redux|redux|immer|lucide-react-native)/)',
  ],
};
