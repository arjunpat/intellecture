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