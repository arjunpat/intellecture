# General Routes

Use the **/auth/*** routes to get the cookie set that is needed to access these routes.

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

## POST /lectures/create

Create a new lecture in a class.

###### Example request body:

```javascript
{
  "class_uid": "GsF2nERLrwvLe0T",
  "name": "Electric Fields"
}
```

###### Example response:

```javascript
{
  "success": true,
  "data": {
    "lecture_uid": "ERLrwvLe0ERLrwvLe0"
  }
}
```

## GET /lectures/get/:class_uid

Get all the lectures from a particular class

###### Example response (from /lectures/get/GsF2nERLrwvLe0T):

```javascript
{
  "success": true,
  "data": [
    {
      "uid": "rwvLerwvLERL0ERLe0",
      "name": "Circuits",
      "start_time": null,
      "end_time": null
    },
    {
      "uid": "wvLwERe0ERLrLrvLe0",
      "name": "Electric Fields",
      "start_time": null,
      "end_time": null
    },
    {
      "uid": "e0ERLrwvERLrwvLLe0",
      "name": "Flux",
      "start_time": null,
      "end_time": null
    }
  ]
}
```

## GET /lectures/exists/:join_code

Check if lecture exists.

###### Example response:

```javascript
{
  "success": true,
  "data": {
    "exists": true // or false
    "lecture_uid": "wvLwERe0ERLrLrvLe0" // or undefined
  }
}
```