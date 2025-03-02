# Backend-team-
# Node.js User Authentication and Authorization Project

This project is a Node.js application that provides user authentication and authorization features using Express, Mongoose, and other related technologies. The application includes user signup, login, email verification, password reset, and Google authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Models](#models)
- [Error Handling](#error-handling)
- [License](#license)

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo

2. Install the dependencies:
    npm install


 ##  Configuration

1. Create a .env file in the root of the project and add the following environment variables:
MONGODB_URI=your_mongo_uri
JWT_KEY=your_jwt_secret
EMAIL=your_email
EMAIL_PASSWORD=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=1921

2. Replace the placeholder values with your actual configuration details.


 ##  Running the Application
To start the application, run:
   npm start



 ## Project Structure




 ##  API Endpoints
User Routes
POST /user/signup

Signup a new user.

Request Body:
{
  "email": "user@example.com",
  "number": "1234567890",
  "password": "YourPassword123!",
  "confirmPassword": "YourPassword123!",
  "code": "+1"
}

Response:
{
  "message": "User created. Please check your email to verify your account."
}


POST /user/login

Login a user.

Request Body:
{
  "emailOrNumber": "user@example.com",
  "password": "YourPassword123!"
}

Response:
{
  "message": "Auth Successful",
  "token": "jwt-token-here"
}


POST /user/logout

Logout a user.

Response:
{
  "message": "Logout successful"
}


POST /user/verify-email

Verify a user's email.

Request Body:
{
  "token": "verification-token-here"
}

Response:
{
  "message": "Email verified successfully."
}


POST /user/resend-verification-email

Resend verification email.

Request Body:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Verification email resent. Please check your email."
}



POST /user/request-reset-password

Request a password reset.

Request Body:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Password reset OTP sent to your email."
}




POST /user/reset-password

Reset the user's password.

Request Body:
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!",
  "confirmNewPassword": "NewPassword123!"
}

Response:
{
  "message": "Password reset successful."
}


##  Page Routes
GET /my-account

Render the user's account page (requires authentication).

GET /auth/google

Redirect to Google for authentication.

GET /auth/google/callback

Google authentication callback endpoint.


##  Location Routes
POST /locations: Add a new location by sending a JSON body with name and address.

GET /locations: Retrieve all locations.

Example POST Request

URL: http://localhost:1911/locations

Body:
{
    "name": "Eiffel Tower",
    "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France"
}

Example GET Request

URL: http://localhost:1911/locations

This will return all saved locations with their geographical coordinates.


##   UserInfo Routes

POST /user/info

URL: http://localhost:1911/user/info

This will Register user Full Details

Request Body:
{
  "name": "John Doe",
  "dob": "1990-01-01",
  "gender": "male",
  "nationality": "American",
  "maritalStatus": "single",
  "highestEducationalBackground": "Bachelor's Degree",
  "houseAddress": "123 Main St, Anytown, USA",
  "email": "johndoe@example.com",
  "phone": "+1234567890",
  "emergencyContactPhoneNumber": "+0987654321",
  "idCardType": "Passport",
  "idCardNumber": "A12345678"
}
Response:
{
    "message": "User Details Saved Successfully",
    "user": {
        "_id": "64e1d34edfcf440017bdfbbc",
        "userId": "64e1d34edfcf440017bdfbbc",
        "name": "John Doe",
        "profilePics": "/uploads/profile-pic.jpg", // Assuming a profile picture was uploaded
        "dob": "1990-01-01T00:00:00.000Z",
        "gender": "male",
        "nationality": "American",
        "maritalStatus": "single",
        "highestEducationalBackground": "Bachelor's Degree",
        "houseAddress": "123 Main St, Anytown, USA",
        "email": "johndoe@example.com",
        "phone": "+1234567890",
        "emergencyContactPhoneNumber": "+0987654321",
        "idCardType": "Passport",
        "idCardNumber": "A12345678",
        "createdAt": "2024-08-18T12:34:56.789Z", // Assuming timestamps are enabled in your schema
        "updatedAt": "2024-08-18T12:34:56.789Z"  // Assuming timestamps are enabled in your schema
    }
}


##  Ride Request Routes
POST user/ride-request

URL: http://localhost:1911/user/ride-request

Create a new ride request.

Request Body:
{
  "_id": "user-id-here",
  "pickupAddress": "123 Main St",
  "dropoffAddress": "456 Elm St",
  "vehicleType": "Car",
  "optionalPaymentAmount": 10000
}

Response:
{
  "message": "Ride request created successfully.",
  "rideRequest": {
    "_id": "ride-request-id-here",
    "pickupAddress": "123 Main St",
    "dropoffAddress": "456 Elm St",
    "vehicleType": "Car",
    "optionalPaymentAmount": 20,
    "pickupCoordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    },
    "dropoffCoordinates": {
      "lat": 34.0522,
      "lng": -118.2437
    },
    "status": "pending",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}


PATCH user/ride-request/

URL: http://localhost:1911/user/ride-request/:id

Update a ride request.

Request Body:
{
  "status": "accepted"
}

Response:
{
  "message": "Ride request updated successfully.",
  "rideRequest": {
    "_id": "ride-request-id-here",
    "status": "accepted",
    "updatedAt": "timestamp"
  }
}

GET user/ride-request/

URL: http://localhost:1911/user/ride-request/:id

Query ride request by ID.

Response:
{
  "_id": "ride-request-id-here",
  "pickupAddress": "123 Main St",
  "dropoffAddress": "456 Elm St",
  "vehicleType": "Car",
  "optionalPaymentAmount": 20,
  "pickupCoordinates": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "dropoffCoordinates": {
    "lat": 34.0522,
    "lng": -118.2437
  },
  "status": "pending",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}

DELETE user/ride-request/

URL: http://localhost:1911/user/ride-request/:id

Cancel a ride request.

Response:






##  Middleware
checkAuth.js
This middleware checks for a valid JWT token to protect routes that require authentication.


##  Models
user.model.js
Defines the user schema and model using Mongoose.


##  Error Handling
The application includes centralized error handling in app.js to catch and respond to errors appropriately.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


This `README.md` now includes a complete and detailed list of routes and their descriptions, which should help users understand how to interact with your API.
