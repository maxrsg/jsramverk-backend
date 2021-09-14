# jsramverk-backend
This project was created as a part of the course [jsramverk](https://jsramverk.se/) at BTH

## Installation
This guide is made with the assumption that the user has knowledge and access to the following technologies:
Node.js, git, mongodb

1. Clone the repo and enter the project directory
2. Run ``` npm install ```
3. Create a file called config.json in the /db directory
4. Add your mongodb username and password in the following format:
```json
{
  "username" : "your_username",
  "password" : "your_password"
}
```
5. Update the dsn string found in the database.js file to one matching your own mongodb setup

## Usage
Available scripts: 

```npm start``` - starts the server

```npm run watch ``` - runs the server with nodemon

```npm run production``` - runs the server in production mode

## Routes

### /docs
#### GET:

Returns all saved documents in the following format:
```json
{
  "data": [
    {
      "_id": "613b5d2f0e337bb556de85b0",
      "title": "Document 1",
      "data": "Content of document 1"
    },
    {
      "_id": "613b6e120f3b8fd59f3d5ccd",
      "title": "Document 2",
      "data": "Content of document 2"
    }
  ]
}
```

#### POST:
Adds new document to database, the body of the POST should be json follow the following format:
```json
{
  "title": "your_title",
  "data": "your_content" 
}
```

#### PUT:
Adds new document to database, the body of the PUT should be json follow the following format:
```json
{
  "id": "id_of_document_to_update",
  "title": "updated_title",
  "data": "updated_content" 
}
```

### /docs/:id
#### GET:

Returns one document by id, in the following format:
```json
{
  "data": [
    {
      "_id": "613b5d2f0e337bb556de85b0",
      "title": "Document 1",
      "data": "Content of document 1"
    }
  ]
}
```

#### DELETE:
Deletes a document from the database by id

