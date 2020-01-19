const service = require("./blender-service");

function handleError(err, res) {
    res.send(
        {
            "error": err
        }
    );
}

module.exports = {
    getAllVersions: (req, res) => {
        service.getAllVersions().then((versions) => res.send({
            "versions": versions
        })).catch((err) => handleError(err, res))
    },
    getPlatforms: (req, res) => {
        service.getPlatforms(req.params.version).then(platforms => res.send({
            "links": platforms
        })).catch((err) => handleError(err, res))
    },
    getLinksByPlatform: (req, res) => {
        service.getLinksByPlatform(req.params.version, req.params.platform).then(platforms => res.send({
            "links": platforms
        })).catch((err) => handleError(err, res))
    },
    redirectToDownload: (req, res) => {
        service.getDownloadLink(req.params.version, req.params.platform, req.params.type).then(link => {
            res.redirect(link)
        }).catch((err) => handleError(err, res))
    }
};
