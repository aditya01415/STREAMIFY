# YouTube + Twitter Backend

This directory contains the Node.js and Express API for the YouTube + Twitter
application.

## Features

- User registration, authentication, profiles, and watch history
- Video upload, publishing, search, editing, and deletion
- Tweets, comments, likes, subscriptions, and playlists
- Channel dashboard statistics
- Health-check endpoint

## Technologies

- Node.js
- Express.js
- MongoDB
- Cloudinary

## Setup

From this directory:

```bash
npm install
cp .env.sample .env
```

Fill in the values in `.env`, then start the API:

```bash
npm run dev
```

The server listens on port `8000` by default. Set `PORT` in `.env` to use a
different port. The frontend development proxy expects port `3000`, so use
`PORT=3000` for the standard local setup.

## Important links

- [API documentation](https://documenter.getpostman.com/view/28570926/2s9YsNdVwW)
- [Data model](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)
