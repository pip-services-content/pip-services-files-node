# HTTP REST Protocol (version 1) <br/> Files Microservice

Files microservice implements a REST compatible API, that can be accessed on configured port.
All input and output data is serialized in JSON format. Errors are returned in [standard format]().

* [File class](#class1)
* [FilePage class](#class2)
* [GET /files](#operation1)
* [GET /files/:file_id](#operation2)
* [POST /files](#operation3)
* [PUT /files/:file_id](#operation4)
* [DELETE /files/:file_id](#operation5)
* [DELETE /files](#operation6)
* [GET /files/:file_id/content](#operation7)
* [GET /files/supports_url](#operation8)
* [GET /files/:file_id/url](#operation9)
* [POST /files/add_refs](#operation10)
* [POST /files/update_refs](#operation11)
* [POST /files/remove_refs](#operation12)

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
- refs: Reference[] - array of references from other entities to the file
  - id: string - unique reference id
  - type: string - reference type
  - name: string - (optional) descriptive reference name 
- custom_hdr: Object - custom data summary that is always returned (in list and details)
- custom_dat: Object - custom data details that is returned only when a single object is returned (details)

### <a name="class2"></a> FilePage class

Represents a paged result with subset of requested File objects

**Properties:**
- data: File[] - array of retrieved File page
- count: int - total number of objects in retrieved resultset

## Operations

### <a name="operation1"></a> Method: 'GET', route '/files'

Retrieves a list of stored binary files by specified criteria

**Parameters:** 
- ids: string - (optional) a comma-separated list with unique file ids
- party_id: string (optional) unique party id who owns files
- refs_empty: boolean (optional) **true** for files with no references
- ref_id: string - (optional) unique reference id
- skip: int - (optional) start of page (default: 0). Operation returns paged result
- take: int - (optional) page length (max: 100). Operation returns paged result

**Response body:**
FilePage object or error

### <a name="operation2"></a> Method: 'GET', route '/files/:file_id'

Retrieves information about stored file by its unique id.

**Parameters:** 
- file_id: string - unique file id

**Response body:**
Retrieved File object or error

### <a name="operation3"></a> Method: 'POST', route '/files'

Creates binary file and uploads its content directly or from provided url.
The operation uses 'content_length' and 'content_type' headers to fill correspondent file properties.

**Parameters:** 
- category: string - (optional) file category (default: 'general')
- name: string - file name
- party_id: string - (optional) unique party id who is the owner of the file
- creator_id: string - (optional) unique user or party id of the file creator
- url: string - (optional) url to upload the file content from. If this parameter is not set the content is expected in the request body.

**Response body:**
Serialized file binary content if **url** parameter is not set. Ignored otherwise.

**Response body:**
Created File object or error

### <a name="operation4"></a> Method: 'PUT', route '/files/:file_id'

Changes file name, owner or category.

**Parameters:** 
- file_id: string - unique file id

**Response body:**
Retrieved File object or error

### <a name="operation5"></a> Method: 'DELETE', route '/files/:file_id'

Deletes file specified by its unique id.

**Parameters:** 
- file_id: string - unique file id

**Response body:**
Occured error or null for success

### <a name="operation6"></a> Method: 'DELETE', route '/files'

Deletes multiple file specified by their unique ids.

**Parameters:** 
- file_ids: string - a comma-separated list with unique file ids

**Response body:**
Occured error or null for success

### <a name="operation7"></a> Method: 'GET', route '/files/:file_id/content'

Downloads file binary content

**Parameters:** 
- file_id: string - unique file id

**Response body:**
Serialized file binary content or error

### <a name="operation8"></a> Method: 'GET', route '/files/supports_url'

Checks if microservice implementation supports retrieval of file content as url for direct access.
Direct content url is only supported for AWS S3 data access.

**Response body:**
**true** if microservice implementation supported **get_file_as_url** calls

### <a name="operation9"></a> Method: 'GET', route '/files/:file_id/url'

Retrieves url for direct access to the file content.
Direct content url is only supported for AWS S3 data access.
Other implementations will return an error.
Use **supports_url** to check if this operation is supported before making a call. 

**Parameters:** 
- file_id: string - unique file id

**Response body:**
URL for direct access to the file content or error

### <a name="operation10"></a> Method: 'POST', route '/files/add_refs'

Adds references from entity to specified binary files.

**Request body:** 
- file_ids: string[] - a comma-separated list with unique ids of files where references shall be added
- ref: Object - item reference
  - id: string - unique reference id
  - type: string - reference type
  - name: string - (optional) readable reference name

**Response body:**
Occured error or null for success

### <a name="operation11"></a> Method: 'POST', route '/files/update_refs'

Updates references from entity to specified binary files.
It calculates which files were added or removed and performs correspondent operations to make the changes.

**Request body:** 
- old_file_ids: string[] - a comma-separated list with unique ids of files that previously were referenced to entity
- new_file_ids: string[] - a comma-separated list with unique ids of file that currently are referenced to entity
- ref: Object - item reference
  - id: string - unique reference id
  - type: string - reference type
  - name: string - (optional) readable reference name

**Response body:**
Occured error or null for success

### <a name="operation12"></a> Method: 'POST', route '/files/remove_refs'

Removes references from entity to specified binary files.

**Request body:** 
- file_ids: string[] - a comma-separated list with unique ids of files where references shall be added
- ref: Object - item reference
  - id: string - unique reference id
  - type: string - reference type

**Response body:**
Occured error or null for success

