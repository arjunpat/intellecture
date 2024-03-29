# Classes

## POST /classes/create

Create a new class.

###### Request body:

```javascript
{
  "name": "AP Physics C",
  "section": "Period 2"
}
```

###### Example response:

```javascript
{
  "success": true,
  "data": {
    "class_uid": "GsF2nERLrwvLe0T" // this API generates a class and returns UID
  }
}
```

## GET /classes/mine

View all of the users classes.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "uid": "GsF2nERLrwvLe0T",
      "created_at": 1587439054817,
      "name": "AP Physics C",
      "section": "Period 3"
    },
    {
      "uid": "j3fmOXvJyq5Dlww",
      "created_at": 1587439080846,
      "name": "History",
      "section": "Period 4"
    },
    {
      "uid": "YaneS98ttCj7ErF",
      "created_at": 1587439072263,
      "name": "English",
      "section": "Period 6"
    }
  ]
}
```

## DELETE /classes/:class_uid

Delete a class.

## POST /classes/rename

Rename a class.

###### Request body:
```javascript
{
  "class_uid": "asdfasdfasdf",
  "name": "New Name",
  "section": "Period 1"
}
```
