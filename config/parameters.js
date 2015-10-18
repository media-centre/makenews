var app_path, config;

clientConfig = {
  client_app_path: './client',
  app_main_file: 'app.js',
  css_main_file: 'app.css',
  templates_file: 'app.tags.js',
  scss_src_path: './client/src/scss',
  src_path: './client/src/js',
  dist_folder: './dist/client'
};

serverConfig = {
  server_app_path: './server',
  src_path: './server/src',
  dist_folder: './dist/server',
  dist_server_js_folder: './dist',
  server_js_file: 'server.js'
};

module.exports = {client: clientConfig, server: serverConfig};
