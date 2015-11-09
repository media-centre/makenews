var clientConfig, serverConfig;

clientConfig = {
  clientAppPath: './client',
  appMainFile: 'app.js',
  cssMainFile: 'app.css',
  templatesFile: 'app.tags.js',
  scssSrcPath: './client/src/scss',
  imgSrcPath: './client/src/images',
  fontsPath: './client/src/scss/fonts',
  srcPath: './client/src/js',
  testPath: './client/test',
  distFolder: './dist/client'
};

serverConfig = {
  serverAppPath: './server',
  srcPath: './server/src',
  testPath: './server/test',
  distFolder: './dist/server',
  distServerJsFolder: './dist',
  serverJsFile: 'server.js'
};

module.exports = {client: clientConfig, server: serverConfig};
