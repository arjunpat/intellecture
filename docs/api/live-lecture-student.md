# Live Lecture (Student)

## WSS /lectures/live/student/:lecture_uid

Join a lecture as a student.

#### lecture_info

As soon as client joins, they get this message from the server.
Gives basic info about the lecture.
Wait for this message before loading the UI, sending anything, or allowing the student to move the slider around.

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

#### new_question

When another student asks a question, it gets sent here.

```javascript
{
  "type": "new_question",
  "question_uid": "X8udiUQ8fN6F27C",
  "creator_uid": "rUJyP317iuZErNlhrn2",
  "question": "What is the relationship between voltage and a Gaussian surface?"
}
```

#### end_lecture

When teacher ends lecture, server will send client this message.

```javascript
{
  "type": "end_lecture"
}
```

### Potential Errors

If there is an error, the app will send one message and close the connection.

#### Possible messages include:

```javascript
{
  type: 'error',
  error: 'does_not_exist'
}
```

```javascript
{
  type: 'error',
  error: 'lecture_not_initialized'
}
```

```javascript
{
  type: 'error',
  error: 'already_ended'
}
```

```javascript
{
  type: 'error',
  error: 'already_joined'
}
```

## POST /lectures/live/student/:lecture_uid/question

Ask a question.

###### Example request body:
```javascript
{
  "question": "What is your favorite color?"
}
```

## POST /lectures/live/student/:lecture_uid/upvote

Upvote a question.

###### Example request body:
```javascript
{
  "question_uid": "asdfjasdflasdfkasdf"
}
```

## POST /lectures/live/student/:lecture_uid/score

Update score.

###### Example request body:
```javascript
{
  "score": 7
}
```

## GET /lectures/live/student/:lecture_uid/questions?after={elapsed_ms}

Can be used to get all the past questions during a lecture.
`elapsed_ms` is basically `Date.now() - lecture_info.start_time`

###### Example response:
```javascript
{
  "success": true,
  "data": [
    {
      "creator_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "question_uid": "I5ckf6MSYFV3p1N",
      "question": "What is your favorite color?"
    },
    {
      "creator_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "question_uid": "VwLwyg8ngizW94a",
      "question": "Where do you live?"
    },
    {
      "creator_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "question_uid": "wc7McnXuzHWKHK4",
      "question": "How old are you?"
    },
    {
      "creator_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "question_uid": "yaPz6kebHUJ8gL3",
      "question": "Is this working as expected?"
    }
  ]
}
```
