# signout — leave your mark ✦

The Nigerian university signout shirt tradition, digital. Every user gets a
white T-shirt at a unique link (`/username`) that friends can sign with a
marker — permanently.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · React Konva · MongoDB (Mongoose)

## Setup

```bash
npm install
cp .env.example .env.local   # then add your MONGODB_URI
npm run dev
```

## How it works

- **Landing (`/`)** — create a shirt with a display name + unique username.
- **Owner dashboard (`/username/dashboard`)** — stats, shareable link, and the shirt.
- **Public page (`/username`)** — anyone can draw on the shirt (colors, brush
  sizes, eraser, undo / Ctrl+Z) and save their signature permanently.

Signatures are stored as stroke data (points, color, size) — not images — and
rendered on a React Konva canvas over an SVG shirt, with multiply blending so
the ink sinks into the fabric shading.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/shirts` | Create a shirt `{ displayName, username }` |
| `GET` | `/api/shirts/:username/signatures` | List signatures |
| `POST` | `/api/shirts/:username/signatures` | Add a signature `{ strokes }` |
