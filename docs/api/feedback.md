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