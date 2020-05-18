# Analytics

## GET /analytics/lecture/:lecture_uid/students

Get all the students who ever joined a lecture.

###### Example response:

```javascript
{
    "success": true,
    "data": [{
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
    "data": [{
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