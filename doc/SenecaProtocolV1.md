# Seneca Protocol (version 1) <br/> Files Microservice

Files microservice implements a Seneca compatible API. 
Seneca port and protocol can be specified in the microservice [configuration](Configuration.md/#api_seneca). 

```javascript
var seneca = require('seneca')();

seneca.client({
    type: 'tcp', // Microservice seneca protocol
    localhost: 'localhost', // Microservice localhost
    port: 8810, // Microservice seneca port
});
```

The microservice responds on the following requests:

```javascript
seneca.act(
    {
        role: 'files',
        version: 1,
        cmd: ...cmd name....
        ... Arguments ...
    },
    function (err, result) {
        ...
    }
);
```

* [File class](#class1)
* [FilePage class](#class2)
* [cmd: 'get_files'](#operation1)
* [cmd: 'get_file_by_id'](#operation2)
* [cmd: 'create_file_from_stream'](#operation3)
* [cmd: 'create_file_from_binary'](#operation4)
* [cmd: 'create_file_from_url'](#operation5)
* [cmd: 'update_file'](#operation6)
* [cmd: 'delete_file'](#operation7)
* [cmd: 'delete_files'](#operation8)
* [cmd: 'get_file_as_stream'](#operation9)
* [cmd: 'get_file_as_binary'](#operation10)
* [cmd: 'is_file_url_supported'](#operation11)
* [cmd: 'get_file_as_url'](#operation12)
* [cmd: 'add_file_refs'](#operation13)
* [cmd: 'update_file_refs'](#operation14)
* [cmd: 'remove_file_refs'](#operation15)

## Data types

### <a name="class1"></a> File class

Represents a record about stored binary file in the files.

**Properties:**
- id: string - unique file id
- category: string - file category (default: 'general') 
- name: string - file name
- length: int - file length
- content_type: string - MIME type of file content
- created: Date - (readonly) date and time when file was created
- creator_id: string - (optional) unique id of user or party who created the file
- party_id: string - (optional) unique id of the party who owns the file
- refs: [Reference] - array of references from other entities to the file
  - ref_id: string - unique reference id
  - ref_type: string - reference type
  - ref_name: string - (optional) descriptive reference name 
- custom_hdr: Object - custom data summary that is always returned (in list and details)
- custom_dat: Object - custom data details that is returned only when a single object is returned (details)

### <a name="class2"></a> FilePage class

Represents a paged result with subset of requested File objects

**Properties:**
- data: [File] - array of retrieved File page
- count: int - total number of objects in retrieved resultset

## Operations

### <a name="operation1"></a> Cmd: 'get_files'

Retrieves a list of stored binary files by specified criteria

**Arguments:** 
- filter: object - filter parameters
  - category: string - (optional) file category
  - ids: string[] - (optional) unique file ids
  - party_id: string (optional) unique party id who owns files
  - refs_empty: boolean (optional) **true** for files with no references
  - ref_id: string - (optional) unique reference id
- paging: object - paging parameters
  - skip: int - (optional) start of page (default: 0). Operation returns paged result
  - take: int - (optional) page length (max: 100). Operation returns paged result

**Returns:**
- err: Error - occured error or null for success
- result: FilePage - retrieved File objects in page format

### <a name="operation2"></a> Cmd: 'get_file_by_id'

Retrieves information about stored file by its unique id.

**Arguments:** 
- file_id: string - unique file id

**Returns:**
- err: Error - occured error or null for success
- result: File - retrieved File object

### <a name="operation3"></a> Cmd: 'create_file_from_stream'

Creates binary file and uploads its content from provided stream.
Since Stream object in Node.js is not serializable, this operation
can only be called when microservice and its Seneca consumer run in the same process.

**Arguments:** 
- file: File - information about the Binary file
- stream: Stream - Stream with file content

**Returns:**
- err: Error - occured error or null for success
- result: File - created File object

### <a name="operation4"></a> Cmd: 'create_file_from_binary'

Creates binary file and uploads its content from provided binary buffer.

**Arguments:** 
- file: File - information about the Binary file
- data: String, Array or Buffer - serialized binary data

**Returns:**
- err: Error - occured error or null for success
- result: File - created File object

### <a name="operation5"></a> Cmd: 'create_file_from_url'

Creates binary file and uploads its content from provided url.
Currently only **http** and **https** protocols are supported.

**Arguments:** 
- file: File - information about the Binary file
- url: string - URL of the file location

**Returns:**
- err: Error - occured error or null for success
- result: File - created File object

### <a name="operation6"></a> Cmd: 'update_file'

Changes file name, owner or category.

**Arguments:** 
- file: File - updated information about the Binary file (partial updates are supported)

**Returns:**
- err: Error - occured error or null for success
- result: File - updated File object

### <a name="operation7"></a> Cmd: 'delete_file'

Deletes file specified by its unique id.

**Arguments:** 
- file_id: string - unique file id

**Returns:**
- err: Error - occured error or null for success

### <a name="operation8"></a> Cmd: 'delete_files'

Deletes multiple file specified by their unique ids.

**Arguments:** 
- file_ids: [string] - unique file ids

**Returns:**
- err: Error - occured error or null for success

### <a name="operation9"></a> Cmd: 'get_file_as_stream'

Retrieves file content as stream.
Since Stream object in Node.js is not serializable, this operation
can only be called when microservice and its Seneca consumer run in the same process.

**Arguments:** 
- file_id: string - unique file id
- stream: Stream - (optional) stream when file content shall be written. If stream parameter is not provided, it creates a new Stream object. 

**Returns:**
- err: Error - occured error or null for success
- result: Stream - Stream object with the file content

### <a name="operation10"></a> Cmd: 'get_file_as_binary'

Retrieves file content as binary buffer.

**Arguments:** 
- file_id: string - unique file id

**Returns:**
- err: Error - occured error or null for success
- result: Buffer - Buffer object with the file content

### <a name="operation11"></a> Cmd: 'is_file_url_supported'

Checks if microservice implementation supports retrieval of file content as url for direct access.
Direct content url is only supported for AWS S3 data access.

**Arguments:** 
- none

**Returns:**
- err: Error - occured error or null for success
- result: Object - result object since Senecal doesn't allow to pass primitive types as result
  - supported: boolean - **true** if microservice implementation supported **get_file_as_url** calls.
  
### <a name="operation12"></a> Cmd: 'get_file_as_url'

Retrieves url for direct access to the file content.
Direct content url is only supported for AWS S3 data access.
Other implementations will return an error.
Use **is_file_url_supported** to check if this operation is supported before making a call. 

**Arguments:** 
- file_id: string - unique file id

**Returns:**
- err: Error - occured error or null for success
- result: string - URL for direct access to the file content

### <a name="operation13"></a> Cmd: 'add_file_refs'

Adds references from entity to specified binary files.

**Arguments:** 
- file_ids: string[] - unique ids of files where references shall be added
- ref: Object - item reference
  - id: string - unique reference id
  - type: string - reference type
  - name: string - (optional) readable reference name

**Returns:**
- err: Error - occured error or null for success

### <a name="operation14"></a> Cmd: 'update_file_refs'

Updates references from entity to specified binary files.
It calculates which files were added or removed and performs correspondent operations to make the changes.

**Arguments:** 
- old_file_ids: string[] - unique ids of files that previously were referenced to entity
- new_file_ids: string[] - unique ids of file that currently are referenced to entity
- ref: Object - item reference
  - id: string - unique reference id
  - type: string - reference type
  - name: string - (optional) readable reference name

**Returns:**
- err: Error - occured error or null for success

### <a name="operation15"></a> Cmd: 'remove_file_refs'

Removes references from entity to specified binary files.

**Arguments:** 
- file_ids: string[] - unique ids of files where references shall be removed
- ref: Object - item reference
  - id: string - unique reference id
  - type: string - reference type

**Returns:**
- err: Error - occured error or null for success

