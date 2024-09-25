# EmailTestApp
# My .NET and Angular Application

This project contains a .NET backend with an Angular frontend. Below are the instructions to set up the application, including database configuration, API testing, and Angular setup.

## Prerequisites

- .NET SDK
- Node.js
- Angular CLI (v16 or later)
- SQL Server

## Setup Instructions

### 1. Adjust `appsettings.json`

Modify the `appsettings.json` file in the .NET project to include your server and database information.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=YOUR_DATABASE_NAME;Trusted_Connection=True;"
  }
}

###2. Run Database Migration

In the Package Manager Console, run the following command to create the database and seed it with user data:

Update-Database

###3. Angular Setup (ClientApp)
Navigate to the ClientApp folder and install the required dependencies.

Open PowerShell in the ClientApp folder and run the following commands:

# Install Angular CLI globally (version 16)
npm install -g @angular/cli@16

# Install required packages for the Angular project
npm install @angular/material @angular/forms @auth0/angular-jwt
npm install bootstrap@5

###4. Running the Angular Application
Once the dependencies are installed, open the ClientApp folder in Visual Studio Code. Open the terminal and start the Angular development server:

ng serve

###5.Running Unit Tests for Angular
If you want to run Angular's unit tests, open a new terminal in Visual Studio Code and run the following command:

ng test

This will run the unit tests and display the results in the terminal.

###6.Testing the API with Swagger
To test the API using Swagger, you need to authorize the API requests with a valid JWT token.

Obtain a valid JWT token from an active session.
Open Swagger (/swagger endpoint in your API).
Click the "Authorize" button in Swagger and paste the token in the provided field.
Now you can test the API endpoints.

###7. Troubleshooting
If you encounter issues, ensure that the paths in the launchSettings.json file match the paths in the Angular application.

Possible code modifications:
auth.service.spec.ts: Needs modification in 2 places.
auth.service.ts: Needs modification in 1 place.
email.service.spec.ts: Needs modification in 1 place.
email.service.ts: Needs modification in 1 place.
