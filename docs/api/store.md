# Store

Valid keys include: `polls`

## POST /store/set/:key

Set value in store by key. Value can be any JSON object.

###### Request body:

```javascript
{
  "value": [
    {
      "prompt": "What's your favorite color?",
      "options": ["Red", "Green", "Blue", "Purple"]
    },
    {
      "prompt": "What's your favorite food?",
      "options": ["Beans", "Pizza", "Ice Cream"]
    }
  ]
}
```

###### Example response:

```javascript
{
  "success": true,
  "data": {}
}
```

## GET /store/get/:key

Get value in store by key.

###### Example response:

```javascript
{
  "success": true,
  "data": [
    {
      "prompt": "What's your favorite color?",
      "options": ["Red", "Green", "Blue", "Purple"]
    },
    {
      "prompt": "What's your favorite food?",
      "options": ["Beans", "Pizza", "Ice Cream"]
    }
  ]
}
```
