const webpack = require('webpack');
const express = require('express');
const path = require('path');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);
const app = express();
const port = 3000;
const staticMiddleware = express.static("dist");

app.use(staticMiddleware);
app.use(middleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}));
app.use(hotMiddleware(compiler));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (request, response) => {
  response.render('index', { title: 'Hey', message: 'Hello there!' })
});
//app.use(express.static("dist"));
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});





