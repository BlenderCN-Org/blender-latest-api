const request = require('request');
const cheerio = require('cheerio');

const versionExcludes = ["beta", "alpha", "newpy"];
const versionRegex = /(\d*)\.(\d*)([a-zA-Z]*)?/g;
const mirror = 'https://download.blender.org/release';
module.exports = {
    getAllVersions: () => new Promise((resolve, reject) => {
        getHtmlContent('/').then(($) => {
            const versions = $("a[href^=Blender]")
                .get()
                .map(tag => tag.attribs.href)
                .map(version => version.slice(7, -1))
                .filter(version => !version.includes("Benchmark"));
            versions.push("latest");
            resolve(versions)
        });
    }),
    getPlatforms: (version) => new Promise((resolve, reject) => {
        if (version.toLowerCase() === 'latest') {
            module.exports.getAllVersions().then(versions => {
                version = findLatest(versions);
                module.exports.getPlatforms(version).then(resolve).catch(reject);
            });
            return;
        }
        getHtmlContent(`/Blender${version}/`).then($ => {
            const start = `blender-${version}`;
            const links = $(`a[href^='${start}']`)
                .get()
                .map(tag => {
                    const href = tag.attribs.href;
                    const dashSplit = tag.attribs.href.split("-");
                    const dotSplit = href.split(".");
                    var platform = dashSplit[2];
                    if (platform.includes(".")) {
                        platform = platform.split(".")[0];
                    }
                    return {
                        "platform": platform,
                        "type": dotSplit[dotSplit.length - 1],
                        "version": dashSplit[1],
                        "link": `${mirror}/Blender${version}/${href}`
                    }
                });
            resolve(links)
        });
    }),
    getLinksByPlatform: (version, platform) => new Promise((resolve, reject) => {
        module.exports.getPlatforms(version).then(links => {
            resolve(links.filter(link => link.platform.toLowerCase().startsWith(platform.toLowerCase())));
        });
    }),
    getDownloadLink: (version, platform, type) => new Promise((resolve, reject) => {
        module.exports.getLinksByPlatform(version, platform).then(links => {
            const link = links.filter(link => link.type.toLowerCase() === type.toLowerCase()).sort((a, b) => {
                return sortBlenderVersion(a.version, b.version)
            });
            if (link.length === 0) {
                reject("No link found");
            } else {
                resolve(link.reverse()[0].link);
            }
        });
    }),
};

function getHtmlContent(path) {
    return new Promise((resolve, reject) => {
        const url = mirror + path;
        request(url, (err, response, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(cheerio.load(body));
            }
        });
    });
}

function findLatest(versions) {
    return versions
        .filter(version => version.match(versionRegex) && versionExcludes.filter(exclude => version.includes(exclude)).length === 0)
        .sort(sortBlenderVersion).reverse()[0];
}

function sortBlenderVersion(a, b) {
    console.log(a, b);
    if (a !== null && b === null) {
        return 1;
    }
    if (b !== null && a === null) {
        return -1;
    }
    if (a === null && b === null) {
        return 0;
    }
    const aGroups = versionRegex.exec(a);
    const aMajor = parseInt(aGroups[1], 10);
    const aMinor = parseInt(aGroups[2], 10);
    var aChar = null;
    const bGroups = versionRegex.exec(b);
    if (aGroups !== null && bGroups === null) {
        return 1;
    }
    if (bGroups !== null && aGroups === null) {
        return -1;
    }
    if (aGroups === null && bGroups === null) {
        return 0;
    }
    const bMajor = parseInt(bGroups[1], 10);
    const bMinor = parseInt(bGroups[2], 10);
    var bChar = null;
    if (aGroups.length > 3) {
        aChar = aGroups[3].charCodeAt(0);
    }
    if (bGroups.length > 3) {
        bChar = bGroups[3].charCodeAt(0);
    }

    if (aMajor > bMajor) {
        return 1;
    }
    if (bMajor > aMajor) {
        return -1;
    }
    if (aMinor > bMinor) {
        return 1;
    }
    if (bMinor > bMinor) {
        return -1;
    }
    if (aChar != null && bChar == null) {
        return 1;
    }
    if (bChar != null && aChar == null) {
        return -1;
    }
    if (aChar > bChar) {
        return 1;
    }
    if (bChar > aChar) {
        return -1;
    }
    return 0;
}
