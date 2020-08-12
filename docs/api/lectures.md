# Lectures

## POST /lectures/create

Create a new lecture in a class.

###### Example request body:

```javascript
{
  "class_uid": "GsF2nERLrwvLe0T",
  "name": "Electric Fields",
  "scheduled_start": 1928302192302 // optional field, so can be null/undefined
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
      "start_time": 1283909212321,
      "end_time": null,
      "scheduled_start": null
    },
    {
      "uid": "wvLwERe0ERLrLrvLe0",
      "name": "Electric Fields",
      "start_time": null,
      "end_time": null,
      "scheduled_start": 93019238212
    },
    {
      "uid": "e0ERLrwvERLrwvLLe0",
      "name": "Flux",
      "start_time": null,
      "end_time": null,
      "scheduled_start": 1829302921287
    }
  ]
}
```

## GET /lectures/recent

Gets up to four recent lectures from the past week; could return 0 lectures.

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

## GET /lectures/scheduled

Gets the lectures scheduled for that day.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "uid": "MX4o4gapG0",
      "name": "asfd",
      "scheduled_start": 1597256640000,
      "class_uid": "eMZ5mdgLHwYdrxK"
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
