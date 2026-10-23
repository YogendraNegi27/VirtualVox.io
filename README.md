# VIRTUALVOX website — frontend only

Includes the website pages, React components, CSS, browser audio capture, images, and videos. Backend endpoints, voice services, credentials, deployment infrastructure, dependencies, and build output are excluded.

## Run locally

Use Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000.

## Production build

```sh
npm run build
npm start
```

The frontend starts independently. Live voice calls and contact submissions require a separately connected backend; those services are not included. The browser-side API integration code is retained.
