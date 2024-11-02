# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Getting Started

Install the frontend dependencies

```shell
npm install
```

and then start the development server.

```shell
npm run dev
```

The React app should begin running on `http://localhost:5173`.

To make changes to the page, modify [`src/App.jsx`](src/App.jsx).

## Connecting to API endpoints

The provided [Vite configuration](vite.config.js) sets up a proxy for API requests in development.
This means that from the React code, network requests can be made directly to `/api/path`
without needing to specify a different host for local development and when deployed.
Additionally, because of the proxy, the local API server does not need to enable CORS.
