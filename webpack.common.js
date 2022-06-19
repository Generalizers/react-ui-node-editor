const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      }),
    ],
  },
};
