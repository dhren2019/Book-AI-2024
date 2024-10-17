Project Setup and Documentation

Welcome to Book-AI! This README will guide you through the steps to synchronize APIs, run the Drizzle database, and start the project in development mode. Please follow the instructions below to set up everything smoothly.

Table of Contents

Prerequisites

Installation

Synchronizing APIs

Running the Drizzle Database

Development Mode

Common Issues

Prerequisites

Before starting, ensure you have the following installed:

Node.js (version 14 or higher)

npm or yarn (package manager)

Drizzle ORM setup

MySQL or any SQL-compatible database supported by Drizzle

Next.js framework (used in this project)

Installation

Clone the repository

git clone https://github.com/username/book-ai.git
cd book-ai

Install dependencies

npm install
# or
yarn install

Environment Variables
Create a .env.local file in the root directory. You can use .env.example as a template:

DATABASE_URL=your_database_connection_string_here
NEXT_PUBLIC_API_KEY=your_api_key_here

Synchronizing APIs

The project requires certain APIs to be synchronized for generating content and for user interactions. Follow these steps:

API Configuration

All API configurations are managed via the .env.local file.

Make sure to update the following environment variables:

NEXT_PUBLIC_API_URL for the main API endpoint.

API_SECRET_KEY if needed for authentication.

Testing the Connection
You can test the APIs by running the provided API routes locally:

npm run api-test

If everything is set up correctly, you should get a success message for the API connectivity.

Verify Endpoints

Verify that all endpoints, such as /api/generate-image and /api/save-image, are functioning by using a tool like Postman or cURL.

Example test request:

curl -X GET http://localhost:3000/api/generate-image

Running the Drizzle Database

The project uses Drizzle ORM to manage the database.

Database Migration

Run the following command to migrate the database:

npx drizzle-kit up

This command will apply all migrations and set up the required tables in the database.

Database Configuration

Ensure that your DATABASE_URL environment variable is correctly set up in .env.local. For example:

DATABASE_URL=mysql://username:password@localhost:3306/bookai

Database Seed

To seed initial data for testing:

npm run db:seed

Development Mode

To run the application in development mode, follow these steps:

Start the Development Server

npm run dev
# or
yarn dev

Access the App

Open your browser and go to http://localhost:3000 to access the application.

Hot Reloading

The development server supports hot-reloading, which means any changes you make will automatically be reflected in the app without restarting the server.

Common Issues

API Connection Error: Double-check your API keys and endpoint URLs in .env.local.

Database Migration Issue: Ensure your DATABASE_URL is correct and the database server is running.

Dependency Errors: Run npm install again to make sure all dependencies are correctly installed.

Helpful Scripts

Build the project: npm run build

Run production: npm run start

Lint code: npm run lint

If you have further questions or run into issues, feel free to check the project's documentation or open an issue in the repository. Happy coding!

