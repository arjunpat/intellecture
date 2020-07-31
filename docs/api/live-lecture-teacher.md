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
