module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      [
        'module:metro-react-native-babel-preset',
        {
          useTransformReactJSXExperimental: true,
        },
      ],
      'babel-preset-expo',
    ],
    plugins: [
      // Remove the 'expo-router/babel' plugin and add any other required plugins here
    ],
  };
};
