# React + Vite

## Private admin workspace

The `/admin` route is protected by a server-side username and password. For local development, copy `.env.example` to `.env` and set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a long random `ADMIN_SESSION_SECRET`. The Vite development server runs the same Netlify Function used in production; local records are kept in the ignored `.admin-data.json` file.

For Netlify, add `ADMIN_USERNAME` and `ADMIN_PASSWORD` under **Site configuration → Environment variables**. Ensure both variables are available to **Functions** and to the deploy context serving the site (usually **Production**); then trigger a new deploy so the function receives them. `ADMIN_SESSION_SECRET` is optional in production; when omitted, the password is used to sign sessions. Admin records are stored in the Netlify Blobs store named `riyad-admin`, shared across signed-in sessions. Never prefix these credentials with `VITE_`; they must remain server-side.

The admin session is an HttpOnly, SameSite cookie that expires after eight hours. Changing `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` invalidates existing sessions.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
