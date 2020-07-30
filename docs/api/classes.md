# Classes

## POST /classes/create

Create a new class.

###### Request body:

```javascript
{
  "name": "AP Physics C"
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
      "name": "AP Physics C"
    },
    {
      "uid": "j3fmOXvJyq5Dlww",
      "created_at": 1587439080846,
      "name": "History"
    },
    {
      "uid": "YaneS98ttCj7ErF",
      "created_at": 1587439072263,
      "name": "English"
    }
  ]
}
```

## POST /classes/delete

Delete a class.

###### Request body:
```javascript
{
  "class_uid": "j3fmOXvJyq5Dlww"
}
```

## POST /classes/rename

Rename a class.

###### Request body:
```javascript
{
  "class_uid": "asdfasdfasdf",
  "name": "New Name"
}
```
