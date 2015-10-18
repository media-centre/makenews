var app_path, config;

clientConfig = {
  clientAppPath: './client',
  appMainFile: 'app.js',
  cssMainFile: 'app.css',
  templatesFile: 'app.tags.js',
  scssSrcPath: './client/src/scss',
  srcPath: './client/src/js',
  distFolder: './dist/client'
};

serverConfig = {
  serverAppPath: './server',
  srcPath: './server/src',
  distFolder: './dist/server',
  distServerJsFolder: './dist',
  serverJsFile: 'server.js'
};

module.exports = {client: clientConfig, server: serverConfig};
