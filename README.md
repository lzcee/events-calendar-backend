# Events Calendar: "Organiza"

"Organiza" is an online agenda that allows users and events to be registered.
For the development NodeJS was used in addition to the Express framework. The TypeORM was used like object–relational mapping and for the database, SQLite.
The login token is generated using the JSON Web Token. The password was encrypted using the bcrypt library.
The front-end for this project can be found at this [repository](https://github.com/lzcee/events-calendar-frontend).

## Installation
1 - Clone this repository
2 - Run `yarn install` and `yarn start`
3 - Enjoy :)

## Routes

**POST** Register a User
`/users`
*HEADERS*
```
Content-type: application/json
```
*BODY*
```
	{
		"name": "",
		"email": "",
		"password": ""
	}
```

**GET** User Login
`/users`
*HEADERS*
```
Content-type: application/json
Authorization: Basic {email:password}
```

**POST** Create a Event
`/events`
*HEADERS*
```
Content-type: application/json
x-access-token: TOKEN
```
*BODY*
```
	{
		"description": "",
		"startTime": timestamp,
		"endTime": timestamp,
		"ownerUser": user_id
	}
```

**DELETE** Delete a Event
`/events/:id`
*HEADERS*
```
Content-type: application/json
x-access-token: TOKEN
```
*BODY*
```
	{
		"ownerUser": user_id
	}
```

**PUT** Edit a Event
`/events/:id`
*HEADERS*
```
Content-type: application/json
x-access-token: TOKEN
```
*BODY*
```
	{
		"description": "",
		"startTime": timestamp,
		"endTime": timestamp,
		"ownerUser": user_id
	}
```

**GET** Get Events by Day
`/events`
*HEADERS*
```
Content-type: application/json
x-access-token: TOKEN
owner-user: USER_ID
```