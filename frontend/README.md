# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Connecting to API endpoints

The provided [Vite configuration](vite.config.js) sets up a proxy for API requests in development.
This means that from the React code, network requests can be made directly to `/api/path`
without needing to specify a different host for local development and when deployed.
Additionally, because of the proxy, the local API server does not need to enable CORS.
