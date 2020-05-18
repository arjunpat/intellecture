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

## POST /lectures/live/student/:lecture_uid/question

Ask a question.
Example request body:

```javascript
{
  "question": "What is your favorite color?"
}
```

## POST /lectures/live/student/:lecture_uid/upvote

Upvote a question.
Example request body:

```javascript
{
  "question_uid": "asdfjasdflasdfkasdf"
}
```

## POST /lectures/live/student/:lecture_uid/score

Update score.
Example request body:
```javascript
{
  "score": 7
}
