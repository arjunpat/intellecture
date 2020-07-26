# Admin

## GET /admin/active-lectures

Get the lectures that are currently in progress. Only restart the server if there are 0 live lectures.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "uid": "jQDhpQDN6VMSfpUFj43y",
      "created_at": 1594945477163
      "class_uid": "98Ra9axvDHQQptc",
      "lecture_name": "Lecture A58",
      "start_time": 1594945479250,
      "end_time": null,
      "join_code": "ceqle",
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "class_name": "Test class",
      "creator": {
        "email": "ajpat1234@gmail.com",
        "first_name": "Arjun",
        "last_name": "Patrawala",
        "photo": "https://lh3.googleusercontent.com/a-/AOh14Gh1hi7LxPF0wFC8OM1jwL40TIT2tuQk5JLPyWG2xg"
      }
    },
    {
      "uid": "mSCFkWbTDTIry5Qqa6v4",
      "created_at": 1594945481443,
      "class_uid": "98Ra9axvDHQQptc",
      "lecture_name": "Lecture A46",
      "start_time": 1594945484264,
      "end_time": null,
      "join_code": "gxkjg",
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "class_name": "Test class",
      "creator": {
        "email": "ajpat1234@gmail.com",
        "first_name": "Arjun",
        "last_name": "Patrawala",
        "photo": "https://lh3.googleusercontent.com/a-/AOh14Gh1hi7LxPF0wFC8OM1jwL40TIT2tuQk5JLPyWG2xg"
      }
    }
  ]
}
```