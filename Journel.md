# This is full fleged Backend project includes every aspect of backend development (mostly)

    - I'm using Mern Stack to build this project
    - I'm also keeping the record of every step I take in this project in readme file (it's like journal)

> Project Detials -> (StreamVerse) bassically building a kind of youtube backend that will mostly include every feature of youtube i mean not every but almost the main one's , also will try to add some of my touch, with a new features of hot takes where user bassically will share their extreme opinions or hot takes about literally anything and other users will just rate them . Goal is to build a MERN stack project on my own and understand backend and how it is handled like uplaoding videos , authentications , tokens , cookies , encryptions , multer, cludinary, handling errors and responses , interacting with database (mongoDb in this case), wirting database models, handling request and responses with Express, also can't forget javascript(node js) , writing controllers , handling routes , bug fixing ( that would be a lot ) , well let's goo

--- setting up the project ---

First we have Model link
[Model](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

# handle the file structure

- gitkeep, gitignore, readme, package.json, package-lock.json , public , .evv , src

-> inside src -

- constants.js
- app.js
- index.js
- controllers
- middlewares
- models
- routes
- utils
- db

# git init - repo is initialized [repo](https://github.com/Stack-Sage/MERN-Project-/tree/main)

## npm i -D nodemon - to install nodemon as a dev dependency

    - dev command : nodemon src/index.js

## npm i prettier - to install prettier

    - prettier is a code formatter that helps keep your code clean and consistent
    - create a .prettierrc file in the root of your project
    - create a .prettierignore file in the root of your project

--- setting up the dataBase ---

# MongoDB Atlas

    - create a cluster
    - create a user
    - get the connection string
    - created a network access rule
    - created a database access rule
    - connection string generated

# Setting up .env file

# two approaches to connect to the database

    1. We can put write the database connection function in the index.js file
    2. We can create a separate file for the database connection and import it in the index.js file

## npm i dotenv - to install dotenv

    - dotenv is a zero-dependency module that loads environment variables from a .env file into process.env

## npm i mongoose - to install mongoose

    - mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
    - it provides a schema-based solution to model your application data

## npm i express - to install express

    - express is a web application framework for Node.js, designed for building web applications and APIs

> Note: Every time we talk to data base there could be some problem we should handle that

    - we can use try catch block to handle errors
    - we can use async await to handle asynchronous code
    - we can use mongoose connection events to handle connection errors

# mongoose.connect() - to connect to the database

    - it takes the connection string as an argument
    - it returns a promise that resolves when the connection is successful

# Setting up the db_index.js file

    - create a db/index.js file in the src folder
    - create a connectDB function that connects to the database
    - export the connectDB function

> note: configuring the .env file with the first file that is executed in the project is a good practice

# Setting up the index.js file

    - import the connectDB function from the db_index.js file
    - call the connectDB function to connect to the database
    - create an express app and listen on a port

### DATA BASE CONNECTION --- Sucessfull

# updating github

    - git add .
    - git commit -m "setting up the database"
    - git push origin main

--- Custom Api Responses and error handling ---

# setting up express app in app.js file

    - create an express app in the app.js file
    - export the app from the app.js file
    - import the app in the index.js file
    - use the app to listen on a port

# in index.js file

    - import the express app from the app.js file

> as connectDB function will return a promise we can use .then() to handle the promise

    - call the connectDB function to connect to the database
    - use the app to listen on a port
    - handle errors using .catch() method

## npm i cors - to install cors

    - cors is a middleware that allows cross-origin requests
    - it is used to enable cross-origin resource sharing (CORS) in the application

## npm i cookie-parser - to install cookie-parser

    - cookie-parser is a middleware that parses cookies attached to the client request object
    - it is used to parse cookies in the application
    - let express read and manage cookies which is needed for login/session handling

# setting up cors and cookie-parser in app.js file

    - import cors and cookie-parser in the app.js file
    - use cors middleware to enable CORS in the application
    - use cookie-parser middleware to parse cookies in the application
    - set the origin and credentials options for CORS

# Moving on to middle wares

    - middleware bassically is a bridge between the request and response
    - it is a function that has access to the request object, response object, and next
    - (err, req, res, next) => {} is the signature of a middleware function
    - next is a function that is called to pass control to the next middleware function

# Creating a custom error handler middleware

    - asyncHandler is a function that takes a function as an argument and returns a new function that handles errors
    - it is used to handle errors in asynchronous code
    - we will wrap this function around our controller functions to handle errors

# created a custom ApiError class

    - it extends the built-in Error class
    - it takes a status code and a message as arguments
    - it sets the status code and message properties of the error object
    - it sets the name property to "ApiError"

# created a custom ApiResponse class

    - it takes a status code, data, and message as arguments

> Note: the ApiResponse class is used to send a consistent response format for all API responses

    1. Informational responses (100–199)
    2. Successful responses (200–299)
    3. Redirection messages (300–399)
    4. Client error responses (400–499)
    5. Server error responses (500–599)

pushing the changes to github - git add . - git commit -m "Custom Api Responses and error handling" - git push origin main

--- Setting up the User and video Model with Hooks and JWT ---

# creating user and video model

    - create a models folder in the src folder
    - create a user.js file in the models folder
    - create a video.js file in the models folder

# Writing the user and video model - this i know how do make the model so i will just write the code for both models

## npm i mongoose-aggregate-paginate-v2

    - mongoose-aggregate-paginate-v2 is a plugin for mongoose that adds pagination to aggregate queries
    - it is used to paginate the video model
    - what mongoose-aggregate-paginate-v2 will do is
    imagine you have a video model with 1000 videos and you want to get the first 10 videos
    - you can use the paginate method to get the first 10 videos
    if we are not using it then we have to load 1000 video at the same time which will eventually crash the server
    * videoSchema.plugin(mongooseAggregatePaginate) - this will add the paginate method to the video model *

## npm i bcrypt

    - bcrypt is a library to hash passwords
    - it is used to hash the password before saving it to the database
    - it is used to compare the password when the user logs in
    - bcrypt is one way hashing algorithm meaning password can be hashed but cannot be decrypted

## npm i jsonwebtoken

    - jwt is a library to create and verify JSON Web Tokens
    - it is used to create a token when the user logs in
    - it is used to verify the token when the user makes a request to a protected route
    - jwt is used to authenticate the user and authorize access to protected routes

** How jwt works is
jwt is a bearer token that is sent in the Authorization header of the request 1. User logs in with email and password 2. Server checks if the user exists and if the password is correct 3. If the user exists and the password is correct, server creates a token with user id and email 4. Server sends the token to the client 5. Client stores the token in local storage or cookies 6. Client sends the token in the Authorization header with every request to protected routes
JWT token is consists of three parts 1. Header - contains the type of token and the signing algorithm 2. Payload - contains the user id and email 3. Signature - used to verify the token **

# Using pre method of mongoose to hash the password before saving it to the database

    - pre method is a middleware that is called before the document is saved to the database
    - it is used to hash the password before saving it to the database

# using compare method of bcrypt to compare the password when the user logs in

    - compare method is used to compare the password entered by the user with the hashed password in the database
    - it returns true if the passwords match and false if they don't match

# adding access and refresh token secret and expiry to the .env file

    - access token is used to authenticate the user and authorize access to protected routes
    - refresh token is used to refresh the access token when it expires
    - access token has a short expiry time (1 day) and refresh token has a longer expiry time (10 days)
    - we will use these tokens in the authentication middleware to protect the routes
    - in database we weil only store the refresh token and not the access token
    - access token will be sent to the client and stored in local storage or cookies

# setting up functions for generating refresh and acces tokens

    - create a generateAccessToken function that takes user id , username and email as arguments and returns a signed token
    - create a generateRefreshToken function that takes user id  as arguments and returns a signed token
    - these functions will be used in the authentication middleware to protect the routes

# Pushing the changes to github

    - git add .
    - git commit -m "Setting up the User and video Model with Hooks and JWT"
    - git push origin main

--- How to uplaod files with the help of multer and cloudinary ---

# Setting up Cloudinary account

    - create a cloudinary account
    - create a cloudinary upload preset
    - get the cloudinary cloud name, api key and api secret
    - add these to the .env file

## npm i multer

    - multer is a middleware for handling multipart/form-data, which is used for uploading files
    - it is used to handle file uploads in the application
    - it is used to parse the incoming request and save the file to the server

## npm i cloudinary

    - cloudinary is a cloud-based image and video management service
    - it is used to upload images and videos to the cloud
    - it provides a URL for the uploaded file that can be used in the application

> note: we will upload users files from multer , to cloudinary -> but in between we will save the file temporarily in our local storage

    - we will use multer to handle the file upload and save the file to the local storage
    - we will use cloudinary to upload the file to the cloud and get the URL of the uploaded file
    - we will delete the file from the local storage after uploading it to the cloud

## making cloudinary.js in utils

    - importing v2 and fs
    - v2 is the cloudinary module that provides methods to upload files to the cloud
    - fs is the file system module that provides methods to read and write files to the local file system

## writing uploadOnCloudinary function

    - it takes the file path as an argument and uploads the file to the cloud
    - it returns the URL of the uploaded file
    - it uses the cloudinary.v2.uploader.upload method to upload the file to the cloud
    - it uses fs.unlinkSync to delete the file from the local storage after uploading it to the cloud

## we will make a middleware to handle file uploads

    - create a middleware function that uses multer to handle file uploads
    - it will save the file to the local storage and call the next middleware function
    - we will use this middleware in the routes where we want to upload files

## Created a multer.middlerware.js file

    - it will handle file uploads and call the next middleware function
    - it will use multer to handle file uploads and save the file to the local storage
    - it will call the next middleware function after saving the file to the local storage
    - upload.single('file') is used to handle single file uploads

> note : Till now all we have done in this project is setting up the project like a industry level standard

    - we have set up the project structure, database connection, error handling, custom API responses, user and video models, JWT authentication, and file uploads
    - now we will move on to creating the routes and controllers for the application

# Pushing the changes to github

    - git add .
    - git commit -m "Created a multer middleware for handling file uploads"
    - git push origin main

-HTTP Headers, CORS, Security, and HTTP Methods

# created an http.md file

    - this file will contain information about HTTP headers, CORS, security, and HTTP methods

## pushing the changes to github

    - git add .
    - git commit -m "Created an http.md file for HTTP headers, CORS, security, and HTTP methods"
    - git push origin main

--- Setting up router and controllers ---

## created an user.controller.js file

    - this file will contain the controller functions for the user routes
    - we will create a registerUser function that will handle the user registration
    - we will use the asyncHandler middleware to handle errors in the controller functions

## created a user.routes.js file

    - this file will contain the user routes
    - we will use the express.Router() method to create a new router instance
    - we will use the router.post() method to create a POST route for user registration
    - we will use the registerUser controller function to handle the user registration

## added routes in app.js file

    - we will import the user routes in the app.js file
    - we will use the app.use() method to use the user routes in the application
    - we will use the /api/v1/users prefix for the user routes

## tested with postman

    - we will use postman to test the user registration route
    - we will send a POST request to the /api/v1/users/register route with the user details in the request body
    - we will check if the response is successful and if the user is registered successfully

# Pushing the changes to github

    - git add .
    - git commit -m "Setting up user routes and controllers"
    - git push origin main

--- Logic building of register Controller ---

## Writing RegisterUser function

1.  get user details from frontend (via - Postman)
    - successfully handled the data - Handling image files : via adding multer as a middleWare in user.routes.js

2.  validation (if something is not empty - wrong format)
3.  check if user already exists: username, email
4.  checking if image files
5.  if image is availble than we uplaod to cloudinary
6.  create user object - create entry in db
7.  remove password and refresh token field from response
8.  check for user creation
9.  return response

## also added multer {uplaod} as a middlware in user.routes

         = upload.fields([])

# npm i validator

        - to check if the email is of correct format

# Pushing the changes to github

    - git add .
    - git commit -m "Writing RegisterUser Controller function"
    - git push origin main

--- Testing the user model with Postman ---

## Tested with Postman

        - encountered several errors
        - wrong cloud name
        - some silly syntax mistakes
        - env variable were not loading in cloudinary.js
        - so for temparary solution configured .env file in it seperatly
        - several awaits missing

## after 5 hours of debugging - i know even with chat gpt took me 5 hours

        - we finally got the response

            {
                "statusCode": 200,
            "data": {
                "_id": "6894c30823a8115669e22e07",
                "username": "sh",
                "email": "sasdfas@gmail.com",
                "fullName": "thomas shelby",
                "watchHistory": [],
                "avatar": "http://res.cloudinary.com/dtxr7lmdn/image/upload/v1754579717/tg3ftgvhfbpyiks4efpw.png",
                "coverImage": "http://res.cloudinary.com/dtxr7lmdn/image/upload/v1754579719/wwuuexyccwr5iaormpli.jpg",
                "createdAt": "2025-08-07T15:15:20.453Z",
                "updatedAt": "2025-08-07T15:15:20.453Z",
                "__v": 0
            },
            "message": "User Registered Successfully!",
            "success": true
            }

# Pushing the changes to github

    - git add .
    - git commit -m "Debugging and testing with Postman "
    - git push origin main

--- Access and Refresh Token , Middleware and cookies ---

## Access Token

    Short-lived (e.g., 15 min – 1 hour).
    Used to access protected resources/features.
    Sent with each request for authentication.

## Refresh Token

    Long-lived (days, weeks, months).
    Stored securely (often HTTP-only cookie).
    Used to get a new access token when the old one expires.
    Sent to the server only during token refresh.

    Why This Setup Exists
    Short access token lifespan → limits damage if stolen.
    Refresh token → avoids making the user log in repeatedly.

    Flow: Login → get both tokens → use access token normally → when expired, send refresh token → server verifies → issues new access token.

## creating the userLogin function in user.controller.js

        - req body -> get data
        - email based
        - find the user if he is in data base or not
        - if user exist ? check the password
        - if password correct ? generate access and refresh token ( in seperate function )
        - and send them to user via cookie (secure cookie)

## created a logutUser route in user.route.js

## also creating auth.middleware.js

    - which will have to verify if the user is login or not
    - adding user to req.user

## injecting this verifyJWT as a middleware in logout Route

## Also created a logout function in user.controller.js

    - how do i logout ?
    - well remove cookies
    - also remove access and refresh tokens
    - the thing is how do i find the user during logout
    - simple solution middleware , req and res are just object
    so we can design our own middleware

# Pushing the changes to github

    - git add .
    - git commit -m "Access,Refresh Token , logout and login "
    - git push origin main

--- Testing the login and logout using postman & debugging---

## created a function refreshAccessToken in user.controller

    - which will bassically update refresh token if it is expired

## added a userRoute => refresh-token in user.routes.js

## pushing the changes to github

    -git add .
    -git commit -m " endpoint for refreshing access token "
    -git push origin main

--- Creating subscription Model and writing update controller ---

## creating Subscription Model

# Writing some Update functions in user.controller.js

## writing update password function in user.controller

## writing getCurrentUser

## writing updateAccountDetails

## writing updateUserAvatar function

## writing updateUserCoverImage function

## pushing the changes to github

    -git add .
    -git commit -m " writing subscription model and update controllers "
    -git push origin main

--- writing the subscription model ---

## Subscription Schema

    - Two major things
    1. Subscribers
    2. Channels

    User -> a, b, c, d, e
    channel -> ACA, BAB CAC

    everytime we subscribe to a new channel a new document will be formed

    [
        channel -> ACA
        Subscriber-> A
    ]
    [
        channel -> ACA
        Subscriber-> B
    ]
        [
            channel -> ACA
            Subscriber-> C
        ]
            [
                channel -> BAB
                Subscriber-> C
            ]
                [
                    chanel -> CAC
                    Subcriber-> C
                ]

    - major question or challenge is to how will we find the subscribers of a particular channel
         we will select all those documents whoes channel = particular channel
         like in this for ACA channel we got 3 Subscribers

    - another challenge to find how many channels a user has subscribed
        we will select subscriber = particular user
        in this subscriber = C so 3 channels

## pushing the changes to github

    -git add .
    -git commit -m " understanding Subscription model "
    -git push origin main

--- mongoDb Aggregation piplelines ---

> note : An aggregation pipleline consists of one or more stages that process documents

    - each stage performs an operation on the input docuements , like group documents
    - the docuements that are output from a stage are passed to the next stage
    - an aggregation pipeline can return results for groups of docuements , like retrieving average, maximum and minimum values

## writing a function getUserChannelProfile for counting the subscriber count and no of channel user subscribed to , using aggregation piplelines -> a bit advanced for me ngl

## pushing changes to github

    -git add .
    -git commit -m "mongoDB Aggregation piplelines"
    -git push origin main

---Writing sub pipelines and routes---

## writing new piplelines for watchHistory

    - writing getWatchHistory function in user.controller
    - also using nested pipelines cause in video model we dont' have the _id which we will get from the owner and owner refers to users so using a nested pipeline to get _id from users

## Pushing changes to github

    - git add .
    - git commit -m "getWatchHistory"
    - git push origin main

$$
Doing the Final testing --- of all User routes using postman (collection)

    1. register => success
    2. login => success
    3. logout => success
    4. refreshtoken => success
    5. change-password => success
    6. currentUser => success
    7. updateAvatar => success
    8. updateCoverImage => success
    9. c/:uername => yet to test
    10. watch-history => yet to test


--- creating remaining model ---

# created new models such as
        - comment.model.js
        - like.model.js
        - playlist.model.js
        - tweet.model.js

## now rest is to make controllers and routers for these models




note > Wrap-up
Up to this point, I have:
- laid down a clean project structure,
- connected MongoDB Atlas with robust error handling,
- built JWT auth with access/refresh tokens and secure cookies,
- implemented file uploads via Multer + Cloudinary,
- built a whole user.controller file to handle almost every function,
- added a subscription model and used aggregation pipelines,
- tested the major user routes with Postman.



note> i have writen the template of all routers and controllers ,
all now i have to do is write those controller functions and test it parallely too


# pushing changes to github


--- writing video controller ---

## created publish video function to upload to video , title , desc, thumbnail
    - just tested it and encoutered some cloudinary error possibly due to my internet
    - but eventually success

## creating a seperate helper function just to get the video data from id so i can use it in different functions and avoid rewriting it again and again


## created delete video function , update video details
    - delete video function will delete the video from cloudinary and also from the database
    - update video details function will update the video details in the database and also in cloudinary

## toggle video pushlish

## writing get all video function
         - all query params should be optional
         - want to search video by title and description too
         - small problem user query won't match the cases of title
         - either to lowercase everything

         - or i can use regex to match pattern and find the videos by title or description
         - options : i for case insensitive


## testing this function - Success

--- writing comment controller ---

## writing comment.controller.js
    - created getAllComments function to get all comments for a video
    - created addComment function to add a new comment to a video
    - created deleteComment function to delete a comment
    - created updateComment function to update a comment

    - tested them all after minor bugs like typos and all they all worked


# pushing changes to github
    - git add .
    - git commit -m "comment.controller.js"
    - git push origin main


> note forgot to add the logic for handling views , but can't update view count everytime if a same user visits a video , it should be counted only once per user ,
so adding a new viewedBy field in video model to keep track of users who have viewed the video

# updating view logic in getVideoById in video.controller.js

## success fully added view logic and tested it too

# pushing changes to github
    - git add .
    - git commit -m " view logic "
    - git push origin main


--- writing tweet controller now ---
        - writing tweet.controller.js
        - created createTweet function to create a new tweet
        - created getAllTweets function to get all tweets
        - created updateTweet function to update a tweet
        - created deleteTweet function to delete a tweet
        - tested them all after minor bugs like typos and all they all worked

# pushing changes to github
        - git add .
        - git commit -m "tweet.controller.js"
        - git push origin main


--- writing playlist.controller.js
        - created createPlaylist function to create a new playlist
        - created getAllPlaylists function to get all playlists
        - created getPlaylistById function to get a single playlist by id
        - created updatePlaylist function to update a playlist
        - created deletePlaylist function to delete a playlist

        - testing all the routes for playlist and ofcourse so many bugs but after half an hour of debugging finally worked

# pushing changes to github
        - git add .
        - git commit -m "writing playlist.controller.js"
        - git push origin main

# making like controller
        - created like.controller.js
        - created toggleLike function to like or unlike a video
        - created getLikesByVideo function to get all likes for a video
        - created getLikesByUser function to get all likes by a user
        - tested them all after minor bugs like typos and all they all worked

# big change of plan changing tweet to hotTakes
        - adding ratings like mid , fact , cap to determine how a user feels about the hotTake

# writing hotTake.controller.js
        - writing cap-take function to rate a hot take
        - writing mid-take function to rate a hot take
        - writing fact-take function to rate a hot take

# after testing all of them they worked with some minor bugs to fix

# pushing changes to github
        - git add .
        - git commit -m "writing like.controller.js and hotTake.controller.js"
        - git push origin main


--- writing subscription controller ---
    - created three functions to handle subscriptions
    - created subscribeToChannel function to subscribe a user to a channel
    - created unsubscribeFromChannel function to unsubscribe a user from a channel
    - created getSubscribers function to get all subscribers of a channel

    it's was a bit confusing to understand the subscription flow but after two hours of pain finally got it working

    testing all the subscription routes was successful after fixing some minor bugs


# pushing changes to github
    - git add .
    - git commit -m "writing subscription.controller.js"
    - git push origin main


--- writing dashboard.controller.js

# Dashboard Controller
    - created getChannelVideos function to get all videos for a channel
    - created getChannelTakes function to fetch all the takes by the channel
    - create getChannelStats function to get all the stats for a channel

# after some minor changes and adding few extra features in stats function and testing went successfull

## this was the last controller to write
        - Started this project on 3rd of august today is 23 of august
        - 20 days of writing backend code for my project average around 5 hours per day
        - Total time spent: 100 hours ( roughly ) although mostly spent on testing and fixing bugs lol
        - but it was fun wrote every controller on my own with some documentation refrences for mongo db calls

## now i'll be moving on the front end part , i have choosed next js over react cause this would have so many routes and i don't want to mess with react -router when i have next js file based routing and also better seo due to ssr

"SIGNING OFF"

Oh Wait - i didn't hosted it yet   {https://streamversebackend.onrender.com/}
Lemme do that and then we can move on to the front end part ...

"SIGNING OFF AGAIN"
$$
