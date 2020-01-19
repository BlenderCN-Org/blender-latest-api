# blender-latest-api
Blender's download links are all not cURL and wget friendly, because you always need to know the version you want to download.
`blender-latest-api` is a simple service redirecting to the official latest download of Blender.

## Usage
The API follows this schema

| Example                  | Base URL                                                       | Version (optional) | Platform (optional) | File type (optional) |
|--------------------------|----------------------------------------------------------------|--------------------|---------------------|----------------------|
| Latest Windows Installer | https://070wwfoovd.execute-api.eu-central-1.amazonaws.com/dev/ | latest/            | windows64/          | msi                  |
| 2.81a Linux Archive      | https://070wwfoovd.execute-api.eu-central-1.amazonaws.com/dev/ | 2.81/              | linux/              | bz2                  |

> When you omit an optional parameter the [response will be JSON](#json-response) instead of a redirect to the download.

### List of available platforms:
* windows
* linux
* macos

> The list of available downloads varies from version to version. When in doubt check the [JSON API](#json-response) for available platforms.

### Download example

Example terminal command to download the latest version of Blender for Windows 64 bit as MSI (installer):
```
wget https://070wwfoovd.execute-api.eu-central-1.amazonaws.com/dev/latest/windows/msi
```
> You can also omit the `64` or `32` for most recent versions, because `32` bit is no longer available.

Example terminal command to download version 2.79b of Blender for Linux as tar.bz2:
```
wget https://070wwfoovd.execute-api.eu-central-1.amazonaws.com/dev/2.79/linux/bz2
```

> Notice! You can't provide the a, b, c version, because of the mirror structure. The API will pick the most recent sub-version of your desired version.

### JSON response
You can also use the API to just find out whats available.

#### List all available versions
```
curl https://070wwfoovd.execute-api.eu-central-1.amazonaws.com/dev/
```

**Example output**
```JSON
{"versions":["1.0","1.60","1.73","1.80","latest", ...]}
```

#### List all downloads available for version
```
curl https://070wwfoovd.execute-api.eu-central-1.amazonaws.com/dev/latest
```

**Example output**
```JSON
{
  "links": [
    {
      "platform": "linux",
      "type": "bz2",
      "version": "2.81",
      "link": "https://download.blender.org/release/Blender2.81/blender-2.81-linux-glibc217-x86_64.tar.bz2"
    },
    {
      "platform": "macOS",
      "type": "dmg",
      "version": "2.81",
      "link": "https://download.blender.org/release/Blender2.81/blender-2.81-macOS.dmg"
    },
    ...
  ]
}
```

#### List of latest Windows downloads
```
curl https://070wwfoovd.execute-api.eu-central-1.amazonaws.com/dev/latest/windows
```
**Example output**
```JSON
{
  "links": [
    {
      "platform": "windows64",
      "type": "msi",
      "version": "2.81",
      "link": "https://download.blender.org/release/Blender2.81/blender-2.81-windows64.msi"
    },
    {
      "platform": "windows64",
      "type": "zip",
      "version": "2.81",
      "link": "https://download.blender.org/release/Blender2.81/blender-2.81-windows64.zip"
    },
    ... 
  ]
}
```
