const serverless = require('serverless-http');
const express = require('express');
const controller = require('./controller');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', controller.getAllVersions);
app.get('/:version', controller.getPlatforms);
app.get('/:version/:platform', controller.getLinksByPlatform);
app.get('/:version/:platform/:type', controller.redirectToDownload);

if (process.argv.length >= 3 && process.argv[2] === 'local') {
    app.listen(3000, () => console.log(`Listening on: 3000`));
} else {
    module.exports.handler = serverless(app);
}
