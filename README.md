bookmarks-api
=============

A bookmarks api made using Node.js with Express and mongodb.


Data structure
==============
A bookmark is defined by the following structure:
```json
{
	"id": "string-identifier",
	"title" : "The title of the bookmark",
	"url" : "http://the-url-from-bookmark.com/",
	"description" : "A text description of the bookmark, if any.",
	"tags" : ["bookmark","example","my-bookmarks"]
}
```



Resource methods
================
```
GET    /bookmark/    => Get all bookmarks
GET    /bookmark/:id => Get a bookmark by id
POST   /bookmark/    => Insert or save a bookmark
DELETE /bookmark/:id => Delete a bookmark by id
```
