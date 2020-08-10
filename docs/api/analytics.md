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

## GET /analytics/lecture/:lecture_uid/stats

###### Example response:

```javascript
{
  "success": true,
  "data": {
    "present": { // total ms that a particular user was present for
      "Bn4S5wNVufYd1jKSCbi6D7JRsKTW": 402627,
      "GpWCy7G74szGjPEKqY9j24DtzC06": 390198
    },
    "avg_us": {
      "Bn4S5wNVufYd1jKSCbi6D7JRsKTW": 6.99,
      "GpWCy7G74szGjPEKqY9j24DtzC06": 5
    },
    "question_counts": { // number of questions by user
      "Bn4S5wNVufYd1jKSCbi6D7JRsKTW": 9,
      "GpWCy7G74szGjPEKqY9j24DtzC06": 6
    },
    "upvote_counts": { // number of upvotes by user
      "Bn4S5wNVufYd1jKSCbi6D7JRsKTW": 6
    }
  }
}
```

## GET /analytics/lecture/:lecture_uid/scores

Gets the total understanding score from the lecture at different time points.

###### Example response:

```javascript
{
  "elapsed": [ // basically x-axis
    21198, 22301, 28861, 48079, 50812, 76339, 79185
  ],
  "score": [ // bsically y-axis
    50, 70, 90, 70, 85, 80, null
  ]
}
```

## GET /analytics/lecture/:lecture_uid/question/:question_uid/upvotes

Get all students who upvoted a question and when they upvoted.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "account_uid": "4qZpEpLkqFgUMdiyjuwWt8lY6Hy2",
      "elapsed": 819283
    },
    {
      "account_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "elapsed": 929812
    }
  ]
}
```

## GET /analytics/lecture/:lecture_uid/questions

Get all questions (and corresponding upvotes) from a lecture.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "question_uid": "tPsMjR4WRtzdIKd",
      "creator_uid": "tfPssMjfR4sgWRtgzdIKd",
      "elapsed": 91572,
      "question": "yessir",
      "upvotes": 1
    },
    {
      "question_uid": "hMakyiEMhrCD0z1",
      "creator_uid": "hfMaskyfiEsgMhrgCD0z1",
      "elapsed": 76788,
      "question": "anotheer",
      "upvotes": 1
    },
    {
      "question_uid": "WWEYUQVueSYZLjS",
      "creator_uid": "WfWEsYUfQVsgueSgYZLjS",
      "elapsed": 64543,
      "question": "hello",
      "upvotes": 1
    },
    {
      "question_uid": "OvIyHaOcsS5rYHy",
      "creator_uid": "OfvIsyHfaOsgcsSg5rYHy",
      "elapsed": 53930,
      "question": "why is it having issues",
      "upvotes": 1
    },
    {
      "question_uid": "XgXbSyfMDvW5pAF",
      "creator_uid": "XfgXsbSfyfsgMDvgW5pAF",
      "elapsed": 23682,
      "question": "asdfjasdflk",
      "upvotes": 1
    }
  ]
}
```

## GET /analytics/lecture/:lecture_uid/student/:account_uid/intervals

Complete computed log of student behavior during lecture.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "from": 912801,
      "to": 913836,
      "score": 5
    },
    {
      "from": 913836,
      "to": 914255,
      "score": 5
    },
    {
      "from": 1014255,
      "to": 1161124,
      "score": 7
    }
  ]
}
```

## GET /analytics/lecture/:lecture_uid/student/:account_uid/upvotes

All the upvotes from a particular student and the time they upvoted.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "question_uid": "hMakyiEMhrCD0z1",
      "elapsed": 88716
    },
    {
      "question_uid": "OvIyHaOcsS5rYHy",
      "elapsed": 57529
    },
    {
      "question_uid": "tPsMjR4WRtzdIKd",
      "elapsed": 93644
    },
    {
      "question_uid": "WWEYUQVueSYZLjS",
      "elapsed": 87935
    }
  ]
}
```