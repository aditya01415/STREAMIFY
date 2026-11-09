# YouTube + Twitter

The application is split into two independently runnable projects:

| Directory | Description | Start command |
| --- | --- | --- |
| [`backend/`](./backend) | Node.js, Express, MongoDB, and Cloudinary API | `cd backend && npm run dev` |
| [`frontend/`](./frontend) | React and Vite web application | `cd frontend && npm run dev` |

## Quick start

Install dependencies in each project:

```bash
cd backend
npm install
cp .env.sample .env
# Fill in backend/.env, then run:
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:3000` during local
development. Make sure the backend is running before using the frontend. To
use a deployed API, set `VITE_BACKEND_URL` in
[`frontend/.env.sample`](./frontend/.env.sample) as appropriate for your
environment.

See the project-specific READMEs for the [backend](./backend/README.md) and
[frontend](./frontend/README.md).
