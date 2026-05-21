const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Evita crash do Metro ao vigiar pastas antigas do ngrok (@expo/.ngrok-*)
config.resolver.blockList = [
  /node_modules[\\/]@expo[\\/]\.ngrok-[^\\/]+[\\/].*/,
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : config.resolver.blockList
      ? [config.resolver.blockList]
      : []),
];

config.watcher = {
  ...config.watcher,
  additionalExcludes: [
    /node_modules[\\/]@expo[\\/]\.ngrok-.*/,
    /node_modules[\\/]@expo[\\/]ngrok[\\/].*/,
    ...(config.watcher?.additionalExcludes || []),
  ],
};

module.exports = config;
