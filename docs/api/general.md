# General Routes

Use the **/auth/** routes to get the cookie set that is needed to access these routes.

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

## GET /lectures/by-class/:class_uid

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

## GET /lectures/recent

Gets up to four recent lectures from the past week; could return 0 lectures. All lectures here are guaranteed to have an end_time.

###### Example response:
```javascript
{
  "success": true,
  "data": [
    {
      "uid": "rwvLerwvLERL0ERLe0",
      "name": "Circuits",
      "start_time": 123809832932,
      "end_time": 1238091232932
    },
    {
      "uid": "wvLwERe0ERLrLrvLe0",
      "name": "Electric Fields",
      "start_time": 123809832932,
      "end_time": 1238098324932
    },
    {
      "uid": "e0ERLrwvERLrwvLLe0",
      "name": "Flux",
      "start_time": 123809832932,
      "end_time": 1238098329432
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
