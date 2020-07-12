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

## GET /analytics/lecture/:lecture_uid/participation

Gives you the total ms that a particular user was in the lecture for.

###### Example response:

```javascript
{
  "success": true,
  "data": {
    "4qZpEpLkqFgUMdiyjuwWt8lY6Hy2": 4502,
    "kADb6ebSfIO5yS5JYI3Cm0T1fG93": 32737,
    "rUJyP317iuZErNlhrnnyn8eT7uY2": 68795
  }
}
```

## GET /analytics/lecture/:lecture_uid/question-count

Gives you number of questions by user.

###### Example response:

```javascript
{
  "success": true,
  "data": {
    "38Sl3JbcF0Yug9dfytpZw8nFOmH3": 3,
    "5pWooeQwUJaxjK4ZurJK5hjEuSC2": 1,
    "BlymmQ7rh3XN9A8AUtJgQfjxMHt2": 1,
    "cQRgFHyD3ISaKuLKQ2gRls9sq8T2": 2,
    "dJbSdXUjrePnmjSoqWUMBhNcRa22": 1,
    "gPFTLJj7b3gkjyMEGfr9VKCc3Uq2": 1,
    "kADb6ebSfIO5yS5JYI3Cm0T1fG93": 5,
    "LaUlHEbfXmODLl3HcJBa922qWR63": 6,
    "MLXP5Qgm8EWMbwk0apeyt3qHpn43": 1,
    "pPoHtpMUOZfp56BfhhsECIt4lYh2": 1,
    "QgCI4XmED4ciHyX9XNn3sJ7zS232": 1,
    "Y5kRaSi7GdOQ5VKYLbkmB2NHTND2": 3
  }
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