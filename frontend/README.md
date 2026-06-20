# AI Tutor

AI Tutor is a Next.js app for practicing English and interview answers with an AI coach.

## Features

- Chat-style coaching flow with a message history pane
- Grammar correction, concise explanation, and interview question suggestions
- Multiple coaching modes: Grammar Coach, Interview Prep, Behavioral Feedback
- Clean responsive UI with dark mode support
- Secure AI key handling through server-side API route

## Getting Started

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create an environment file:

```bash
cp .env.example .env.local
```

3. Add your Gemini key in `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint

## Deployment

This app is ready to deploy to Vercel or any Next.js compatible host.

## Notes

The AI key is used only on the server via the API route at `app/api/chat/route.ts`.
