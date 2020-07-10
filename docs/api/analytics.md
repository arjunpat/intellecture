# Analytics

## GET /analytics/lecture/:lecture_uid/students

Get all the students who ever joined a lecture.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "account_uid": "4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "email": "100021830@mvla.net",
      "first_name": "Arjun",
      "last_name": "Patrawala",
      "photo": "https://lh3.googleusercontent.com/a-/AOh14GipzqLNsIg"
    },
    {
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "email": "ajpat1234@gmail.com",
      "first_name": "Arjun",
      "last_name": "Patrawala",
      "photo": "https://lh3.googleusercontent.com/a-/AOh14Gh1hi7LxPF0wFC8OM1j2xg"
    }
  ]
}
```

## GET/analytics/lecture/:lecture_uid/question/:question_uid/upvotes

Get all students who upvoted a question.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "account_uid": "4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "email": "100021830@mvla.net",
      "first_name": "Arjun",
      "last_name": "Patrawala",
      "photo": "https://lh3.googleusercontent.com/a-/AOh14GipzBIV1Z_CibwcQGhgliehct5g"
    },
    {
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "email": "ajpat1234@gmail.com",
      "first_name": "Arjun",
      "last_name": "Patrawala",
      "photo": "https://lh3.googleusercontent.com/a-/AOh14Gh1hi7LxPFPyWG2xg"
    }
  ]
}
```

## GET /analytics/lecture/:lecture_uid/info

###### Example response:

```javascript
{
  "success": true,
  "data": {
    "uid": "xodya",
    "created_at": 1593381727266,
    "class_uid": "CDHRdENsfwDNVJI",
    "lecture_name": "Testing",
    "start_time": 1593381727386,
    "end_time": 1593382495924,
    "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
    "class_name": "Algos, DS, & ANNs"
  }
}
```

## GET /analytics/lecture/:lecture_uid/attendance

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "account_uid": "4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "elapsed": 91721,
      "status": "j"
    },
    {
      "account_uid": "4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "elapsed": 151940,
      "status": "l"
    },
    {
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "elapsed": 31374,
      "status": "j"
    },
    {
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "elapsed": 38031,
      "status": "l"
    },
    {
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "elapsed": 53598,
      "status": "j"
    },
    {
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "elapsed": 59620,
      "status": "l"
    }
  ]
}
```