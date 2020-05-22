# Live Lecture (Teacher)

## WSS /lectures/live/teacher/:lecture_uid

Join a lecture as a teacher.

#### lecture_info

As soon as client joins, they get this message from server.
Gives basic info about the lecture.
Wait for this message before loading the UI, sending anything, etc.

```javascript
{
  "type": "lecture_info",
  "uid": "cqywa",
  "start_time": 1588889535833,
  "class_name": "AP Calc BC",
  "lecture_name": "Lecture A83",
  "creator": {
    "email": "ajpat1234@gmail.com",
    "first_name": "Arjun",
    "last_name": "Patrawala",
    "photo": "https://wF...."
  }
}
```

#### student_join

As the lecture progresses, teacher will get this message when student joins.

```javascript
{
  "type": "student_join",
  "ts": "1587439072263",
  "uid": "JfdslFKjd82jSDF",
  "email": "asdfjlsadf@asdf.com",
  "first_name": "Arjun",
  "last_name": "Patrawala",
  "photo": "https://..."
}
```

#### student_leave

As lecture progresses, teacher will get this message when student leaves lecture.

```javascript
{
  "type": "student_leave",
  "ts": "1587439072263",
  "uid": "JfdslFKjd82jSDF"
}
```

#### new_question

As lecture progresses, teacher will get this message when question is asked.</td>

```javascript
{
  "type": "new_question",
  "question_uid": "X8udiUQ8fN6F27C",
  "creator_uid": "rUJyP317iuZErNlhrn2",
  "question": "What is the relationship between voltage and a Gaussian surface?"
}
```

#### ques_categor

As the lecture progresses, teacher will get this message at max every 10 seconds.

```javascript
{
  "type": "ques_categor",
  "categories": [{
      "type": "keyphrase",
      "value": "gaussian surface",
      "questions": [
        "jDuw6QJmDQiRfJo",
        "T9JpRo4NuTSKOJH",
        "74i74G1UUuJJ13H",
        "X8udiUQ8fN6F27C"
      ],
      "score": 1,
      "weight": 8
    },
    {
      "type": "keyword",
      "value": "surface",
      "questions": [
        "jDuw6QJmDQiRfJo",
        "T9JpRo4NuTSKOJH",
        "74i74G1UUuJJ13H",
        "mwZPFrIykOY8ZlZ",
        "X8udiUQ8fN6F27C"
      ],
      "score": 1
    },
    {
      "type": "keyword",
      "value": "gaussian",
      "questions": [
        "jDuw6QJmDQiRfJo",
        "T9JpRo4NuTSKOJH",
        "74i74G1UUuJJ13H",
        "X8udiUQ8fN6F27C"
      ],
      "score": 0.8
    },
    {
      "type": "keyword",
      "value": "voltage",
      "questions": [
        "mopv0qoAZDgScCB",
        "X8udiUQ8fN6F27C"
      ],
      "score": 0.4
    },
    {
      "type": "keyword",
      "value": "flux",
      "questions": [
        "r87LkYcgqyOFmCF",
        "mwZPFrIykOY8ZlZ"
      ],
      "score": 0.4
    }
  ]
}
```

#### question_update

As the lecture progresses, teacher will receive this message when student upvotes.

```javascript
{
  "type": "question_update",
  "question_uid": "X8udiUQ8fN6F27C",
  "upvotes": 3,
}
```

#### us_update

As lecture progresses, teacher will get this message when new understanding score as students move their sliders.

```javascript
{
  "type": "us_update",
  "value": 60.23
}
```

#### end_lecture

When lecture done, the teacher will receive this message.

```javascript
{
  "type": "end_lecture"
}
```

## POST /lectures/live/teacher/:lecture_uid/end

End lecture.

###### Request body:

```javascript
{} // empty body
```