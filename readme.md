# Tracker API

## What is Tracker?

It's like a CRM, but for your friends. Basically it's a way to make sure you don't accidentally forget to see your friends for an entire year because you got too busy with the day-to-day parts of life.

## Features

-   Create friends and keep notes on things like who hates bowling and who likes to go camping, or who was the last person to pay for dinner
-   Group friends together based on shared activities, or just who gets along with who
-   Set reminders to reach out to friends with push notifications

## How to Use

Currently there is no public access as the project is still in development. This readme will be updated when there is a public demo available.

## Features Roadmap

This section is a general todo list not organized by priority
General:

-   Create proper authentication middleware
-   Create request validation
-   Create central error handler
-   Clean up routes file.
    Feature:
-   Flesh out friend/person management

## Development

For development, project is run in Docker with containers for the app, db and migrations. The project is built with:
`docker compose -f compose.dev.yml --env-file .env build`
Note that if there is a change to migrations, the db-migration container must rebuilt to get the most recent migrations.js file.

To start the project, run:
`docker compose -f compose.dev.yml --env-file .env up`
This automatically runs migrations and starts file watching for the typescript files on the local machine.
