# Live Lecture (Teacher)

## WSS /lectures/live/teacher/:lecture_uid

Join a lecture as a teacher.

To see all the messages the websocket connection could send, [click here](https://github.com/arjunpat/intellecture/blob/master/server/routes/live/types.ts).

## POST /lectures/live/teacher/:lecture_uid/end

End lecture.

###### Request body:

```javascript
{} // empty body
```

## POST /lectures/live/teacher/:lecture_uid/kick

Kick a student from the lecture.

###### Request body:

```javascript
{
  "student_uid": "as3dfjLDKsdfn8237",
  "banned": true // prevents rejoin to same lecture
}
```

## POST /lectures/live/teacher/:lecture_uid/dismiss

Dismiss a question and tell everybody about it.

###### Request body:

```javascript
{
  "question_uid": "8jslDFIijsdfl49",
}
```

## POST /lectures/live/teacher/:lecture_uid/poll

Create a new poll. The order of these options is important to store because the poll results will be sent in an array of the same length and the same order.

You'll receive results for this poll constantly via websockets in the following form: `[4, 9, 2, 0]`, meaning that there are 4 votes for Green, 9 votes for Blue, 2 votes for Red, and 0 votes for Yellow.

###### Request body:

```javascript
{
  "prompt": "What is your favorite color?",
  "options": [
    "Green",
    "Blue",
    "Red",
    "Yellow"
  ]
}
```

## POST /lectures/live/teacher/:lecture_uid/end-poll

Ends a poll.

###### Request body:

```javascript
{
  "poll_uid": "2342jaSF23jfwl"
}
```
