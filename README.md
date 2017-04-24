# Files Microservice

This is file management microservice from Pip.Services library. 
It keeps lists of files that can be stored in blob storage or linked to external source using uri.

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca
* Persistence: Memory, Flat Files, MongoDB, AWS S3

This microservice has no dependencies on other microservices.

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-content/pip-clients-files-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
  - [Seneca Version 1](doc/SenecaProtocolV1.md)

##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class FileV1 {
    /* Identification */
    public id: string;
    public group: string;
    public name: string;

    /* Content */
    public description: string;
    public content_id: string;
    public content_uri: string;
    public thumbnail_id: string;
    public thumbnail_uri: string;
    public create_time: Date;
    public expire_time: Date;
    public attributes: StringValueMap;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;
}

interface IFileV1 {
    getFilesByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<FileV1>) => void): void;
    getFilesByIds(correlationId: string, fileIds: string[],
        callback: (err: any, files: FileV1[]) => void): void;
    getFileById(correlationId: string, fileId: string,
        callback: (err: any, file: FileV1) => void): void;
    createFile(correlationId: string, file: FileV1,
        callback: (err: any, file: FileV1) => void): void;
    updateFile(correlationId: string, file: FileV1,
        callback: (err: any, file: FileV1) => void): void;
    deleteFileById(correlationId: string, fileId: string,
        callback?: (err: any, file: FileV1) => void): void;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-content/pip-services-files-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yaml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yaml** file. 

Example of microservice configuration
```yaml
{    
---
- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "pip-services-files:persistence:file:default:1.0"
  path: "./data/files.json"

- descriptor: "pip-services-files:controller:default:default:1.0"

- descriptor: "pip-services-files:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
}
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "pip-clients-files-node": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('pip-clients-files-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.FilesHttpClientV1(config);

// Connect to the microservice
client.open(null, function(err) {
    if (err) {
        console.error('Connection to the microservice failed');
        console.error(err);
        return;
    }
    
    // Work with the microservice
    ...
});
```

Now the client is ready to perform operations
```javascript
// Create a new picture
var file = {
    group: "pictures",
    name: "google_search.jpg",
    content_uri: "http://somewhere.com/google_search.jpg"
};

client.createFile(
    null,
    file,
    function (err, file) {
        ...
    }
);
```

```javascript
// Read files
client.beginFileRead(
    null,
    { group: 'pictures' },
    null,
    function(err, page) {
    ...    
    }
);
```    

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.

