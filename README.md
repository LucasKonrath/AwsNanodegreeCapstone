# NanoDegree Overflow

# Functionality of the application

This application is a very simple copy of StackOverflow. It allows you to create Posts asking questions about coding issues,
 and allows users to comment on these posts. You can then accept an answer as an definitve answer, and change the status of the post from Open to Closed.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# Screenshots

Screenshots of the application: 

1. No posts setup

![Alt text](images/1_UploadPost.png?raw=true "Image 1")


2. First post created

![Alt text](images/2_PostCreatedOpen.png?raw=true "Image 2")


3. First post details

![Alt text](images/3_PostDetailsNoComments.png?raw=true "Image 3")

4. First comment added

Right click on the imported collection to set variables for the collection:

![Alt text](images/4_CommentToAcceptAsAnswer.png?raw=true "Image 4")

5. First answer accepted, post is now closed
![Alt text](images/5_AcceptedAnswer.png?raw=true "Image 5")

6. Post has been removed after clicking on delete icon

![Alt text](images/6_DeletedPost.png?raw=true "Image 5")
