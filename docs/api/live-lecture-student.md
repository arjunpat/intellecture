# Live Lecture (Student)

## WSS /lectures/live/student/:lecture_uid

Join a lecture as a student.

To see all the messages the websocket connection could send, [click here](https://github.com/arjunpat/intellecture/blob/master/server/routes/live/types.ts).

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

```javascript
{
  type: 'error',
  error: 'banned'
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
      "question": "What is your favorite color?",
      "elapsed": 1829
    },
    {
      "creator_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "question_uid": "VwLwyg8ngizW94a",
      "question": "Where do you live?",
      "elapsed": 2429
    },
    {
      "creator_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "question_uid": "wc7McnXuzHWKHK4",
      "question": "How old are you?",
      "elapsed": 3784
    },
    {
      "creator_uid": "rUJyP317iuZErNlhrnnyn8eT7uY2",
      "question_uid": "yaPz6kebHUJ8gL3",
      "question": "Is this working as expected?",
      "elapsed": 4892
    }
  ]
}
```

## GET /lectures/live/student/:lecture_uid/questions/mine

###### Example response:
```javascript
{
  "success": true,
  "data": [
    {
      "question_uid": "0vT5JNELN4oGH4l",
      "elapsed": 11496,
      "question": "What is your favorite color?",
      "upvotes": 10
    },
    {
      "question_uid": "AwofCYbjfajYxHT",
      "elapsed": 7572,
      "question": "Hello",
      "upvotes": 98
    }
  ]
}
```

## POST /lectures/live/student/:lecture_uid/poll-vote

###### Example request:

```javascript
{
  "poll_uid": "238jslsIDFJsdfl",
  "choice": 2 // the index of the option in the options array
}
```
