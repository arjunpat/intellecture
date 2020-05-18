# All responses
If the response is successful, this will be the response body:

```javascript
{
    success: true,
    data: {.......}
}
```

If the request fails, this will be the response body:

```javascript
{
    success: false,
    error: "some_message" // or it might be an object
}
```

# Authentication Routes

Can be called from anywhere at anytime regardless of login status

## POST /auth/signin

Use to signin to account after Firebase Auth.

###### Request body:

```javascript
{
    firebase_token: "asSDFfasdfasdf...." // this is provided by Firebase when you log in
}
```

[More info on Firebase Token and how to get it](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
If the firebase token is good, it will set a cookie in the browser that lasts for 3 days. Firebase wont be needed at all after you get this cookie set.

###### Response format:

```javascript
{
    success: true
}
```

## GET /auth/profile

Use to check whether you are logged in, and, if you are, give you profile data and renew your cookie for another 3 days.

###### Response if you are logged in and your cookie is renewed:

```javascript
{
    "success": true,
    "data": {
        "uid": "AfjklD7sFfsdfjkl88sSs",
        "email": "ajpat1234@gmail.com",
        "first_name": "Arjun",
        "last_name": "Patrawala",
        "photo": "https://lh3.googleusercontent.com/a-/AOhM1jwL40TIT2tuQk5JLPyWG2xg"
    }
}
```

###### Response if you are not logged in and your cookie is thus not renewed:

```javascript
{
    success: false,
    error: "cookie"
}
```

## GET /auth/signout

Will log the user out of the application (make their cookie expire).

###### Response:

```javascript
{
    "success": false
}
```

# General Routes

Use the **/auth/*** routes to get the cookie set that is needed to access these routes.

## POST /classes/create

Create a new class.

###### Request body:

```javascript
{
    "name": "AP Physics C"
}
```

###### Example response:

```javascript
{
    "success": true,
    "data": {
        "class_uid": "GsF2nERLrwvLe0T" // this API generates a class and returns UID
    }
}
```

## GET /classes/mine

View all of the users classes.

###### Example response:

```javascript
{
    "success": true,
    "data": [{
            "uid": "GsF2nERLrwvLe0T",
            "created_at": 1587439054817,
            "name": "AP Physics C"
        },
        {
            "uid": "j3fmOXvJyq5Dlww",
            "created_at": 1587439080846,
            "name": "History"
        },
        {
            "uid": "YaneS98ttCj7ErF",
            "created_at": 1587439072263,
            "name": "English"
        }
    ]
}
```

## POST /lectures/create

Create a new lecture in a class.

###### Example request body:

```javascript
{
    "class_uid": "GsF2nERLrwvLe0T",
    "name": "Electric Fields"
}
```

###### Example response:

```javascript
{
    "success": true,
    "data": {
        "lecture_uid": "qnmuf"
    }
}
```

## GET /lectures/get/:class_uid

Get all the lectures from a particular class

###### Example response (from /lectures/get/GsF2nERLrwvLe0T):

```javascript
{
    "success": true,
    "data": [{
            "uid": "fdrxl",
            "name": "Circuits",
            "start_time": null,
            "end_time": null
        },
        {
            "uid": "qnmuf",
            "name": "Electric Fields",
            "start_time": null,
            "end_time": null
        },
        {
            "uid": "xinya",
            "name": "Flux",
            "start_time": null,
            "end_time": null
        }
    ]
}
```

## GET /lectures/exists/:lecture_uid

Check if lecture exists.

###### Example response:

```javascript
{
    "success": true,
    "data": {
        "exists": true // or false
    }
}
```

# Feedback

Feedback basically has two APIs, one for creating a new "feedback" and one for updating that“feedback." This way, you send feedback to the server as soon as a user selects 1-5 stars at the beginning (usually the case) and update that information if the user (more unlikely) decides to fill out the rest of the feedback form.

## POST /feedback/create

Create a new feedback and returns an id to that specific feedback.

###### Example request body:

```javascript
{
    stars: 4
}
```

###### Example response:

```javascript
{
    success: true,
    data: {
        id: 4567898768982
    }
}
```

## POST /feedback/update

Update that same feedback object from by using the id you recieved.

###### Example request body (the only required field is "id"):

```javascript
{
    id: 4567898768982,
    stars: 5 // same field as before; can be updated if the user changed their answer
    comments: "this app is so amazing",
    tech_comments: "bad", // technical difficulties
    diff_stars: 3 // experience using the app (higher is better)
    helpful_stars: 5 // how helpful the app is to learning
}
```

Response will just be success: true or success: false

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

# Live Lecture

## WSS /lectures/live/teacher/:lecture_uid

Join a lecture as a teacher.

##### lecture_info

As soon as client joins, they get this message from server.
Gives basic info about the lecture.
Wait for this message before loading the UI, sending anything, etc.</td>

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

##### student_join

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

##### student_leave

As lecture progresses, teacher will get this message when student leaves lecture.

```javascript
{
    "type": "student_leave",
    "ts": "1587439072263",
    "uid": "JfdslFKjd82jSDF"
}
```

##### new_question

As lecture progresses, teacher will get this message when question is asked.</td>

```javascript
{
    "type": "new_question",
    "question_uid": "X8udiUQ8fN6F27C",
    "creator_uid": "rUJyP317iuZErNlhrn2",
    "question": "What is the relationship between voltage and a Gaussian surface?"
}
```

##### ques_categor

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

##### question_update

As the lecture progresses, teacher will receive this message when student upvotes.

```javascript
{
    "type": "question_update",
    "question_uid": "X8udiUQ8fN6F27C",
    "upvotes": 3,
}
```

##### us_update

As lecture progresses, teacher will get this message when new understanding score as students move their sliders.

```javascript
{
    "type": "us_update",
    "value": 60.23
}
```

##### end_lecture

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

## WSS /lectures/live/student/:lecture_uid

Join a lecture as a student.

##### lecture_info

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

##### new_question

When another student asks a question, it gets sent here.

```javascript
{
    "type": "new_question",
    "question_uid": "X8udiUQ8fN6F27C",
    "creator_uid": "rUJyP317iuZErNlhrn2",
    "question": "What is the relationship between voltage and a Gaussian surface?"
}
```

##### end_lecture

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
