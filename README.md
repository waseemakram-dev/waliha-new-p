# Waliha Idrees Portfolio

Next.js conversion of the original Waliha Idrees HTML portfolio. The visual design, content, media, navigation, video speed, and scroll-linked spider animation are preserved.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run lint
npm run build
```

The project uses Next.js static export, so the deployable site is generated in `out/`.

## Netlify

The Next.js project lives at the repository root. Netlify reads `netlify.toml`, installs the dependencies, runs `npm run build`, and publishes `out/`.

- Base directory: repository root (`.`)
- Build command: `npm run build`
- Publish directory: `out`
- Node.js version: 24

The contact form opens an email draft in the visitor's email application. Email and WhatsApp links use the portfolio's contact details.
