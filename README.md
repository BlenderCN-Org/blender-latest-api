# blender-latest
Blender's download links are all not cURL and wget friendly, also you always need to know the version you want to download.
`blender-latest` is a simple service redirecting to the offical latest download of Blender.

## Usage
The API follows this schema

| Example                  | Base URL               | Platform (optional) | Version (optional) | File type (optional) |
|--------------------------|------------------------|---------------------|--------------------|----------------------|
| Latest Windows Installer | https://somewhere.com/ | windows64/          | latest/            | msi                  |
| 2.81a Linux Archive      | https://somewhere.com/ | linux/              | 2.81a/             | tar.bz2              |

> When you omit an optional parameter the [response will be JSON](#json-response) instead of a redirect to the download.

### List of available platforms:
* windows64
* linux
* macos

### `wget` example

Example terminal command to download the latest version of Blender for Windows 64 bit as MSI (installer):
```
wget https://somewhere.com/blender/latest/windows64/zip
```

Example terminal command to download version 2.81a of Blender for Linux x86_64 as tar.bz2:

### JSON response
You can also use the API to just find out whats available.

#### List of latest Windows downloads
```
curl https://somewhere.com/windows64/latest/
```
**Example output**
```JSON
{
  "links": [
    {
      "platform": "windows64", 
      "type": "MSI",
      "version": "2.81a",
      "download": "https://download.blender.org/release/Blender2.81/blender-2.81a-windows64.msi"
    },
    {
      "platform": "windows64", 
      "type": "ZIP",
      "version": "2.81a",
      "download": "https://download.blender.org/release/Blender2.81/blender-2.81a-windows64.zip"
    } 
  ]
}
```

#### List of available version for a specific platform
```
curl https://somewhere.com/linux/
```
**Example output**
```JSON
{
  "links": [
    {
      "platform": "linux", 
      "type": "TAR.BZ2",
      "version": "2.81a",
      "download": "https://download.blender.org/release/Blender2.81/blender-2.81a-linux-glibc217-x86_64.tar.bz2"
    },
    {
      "platform": "windows64", 
      "type": "TAR.BZ2",
      "version": "2.81a",
      "download": "https://download.blender.org/release/Blender2.81/blender-2.81a-linux-glibc217-x86_64.tar.bz2"
    } 
  ]
}

### Why?
I built an automatic Render Farm based on AWS infrastructure and needed a way to download the always latest Version of blender
