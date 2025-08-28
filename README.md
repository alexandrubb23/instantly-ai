# Instantly.AI Project Badges

## Frontend Libraries

<!-- Frontend Badges with different colors -->
[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-5.15.16-007FFF?logo=mui)](https://mui.com/)
[![Emotion](https://img.shields.io/badge/Emotion-11.11.5-c76494?logo=emotion)](https://emotion.sh/docs/introduction)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.62.0-EC5990?logo=reacthookform)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-4.1.4-8e44ad)](https://zod.dev/)
[![TanStack React Query](https://img.shields.io/badge/TanStack%20React%20Query-5.85.5-ff4154?logo=reactquery)](https://tanstack.com/query/latest)
[![Axios](https://img.shields.io/badge/Axios-1.11.0-5A29E4?logo=axios)](https://axios-http.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

## Backend Libraries

<!-- Backend Badges with different colors -->
[![Fastify](https://img.shields.io/badge/Fastify-4.27.0-ffcf00?logo=fastify)](https://www.fastify.io/)
[![Knex](https://img.shields.io/badge/Knex-3.1.0-6e4b3a?logo=knex)](https://knexjs.org/)
[![SQLite3](https://img.shields.io/badge/SQLite3-5.1.7-003B57?logo=sqlite)](https://www.npmjs.com/package/sqlite3)
[![Dotenv](https://img.shields.io/badge/dotenv-17.2.1-10a37f?logo=dotenv)](https://github.com/motdotla/dotenv)
[![AI SDK OpenAI](https://img.shields.io/badge/@ai--sdk/openai-2.0.22-412991?logo=openai)](https://www.npmjs.com/package/@ai-sdk/openai)
[![AI](https://img.shields.io/badge/ai-5.0.27-0b3d91)](https://www.npmjs.com/package/ai)
[![Add](https://img.shields.io/badge/add-2.0.6-ff9800)](https://www.npmjs.com/package/add)
[![Zod](https://img.shields.io/badge/Zod-4.1.4-8e44ad)](https://zod.dev/)
## Dev Tools

<!-- Dev Tools Badges with different colors -->
[![Nodemon](https://img.shields.io/badge/Nodemon-3.1.9-76D04B?logo=nodemon)](https://nodemon.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-8-4B32C3?logo=eslint)](https://eslint.org/)

---

> This file lists all major libraries used in the project with version badges for quick reference.

---

## Getting Started

1. **Clone the repository:**
	```bash
	git clone https://github.com/alexandrubb23/instantly-ai.git
	cd instantly-ai
	```

2. **Install dependencies for both frontend and backend:**
	```bash
	yarn install
	```

3. **Set up environment variables for backend:**
	- Go to the backend folder:
	  ```bash
	  cd backend
	  cp .env.example .env
	  ```
	- Open `.env` and add your `OPENAI_API_KEY`:
	  ```env
	  OPENAI_API_KEY=your-openai-key-here
	  ```

4. **Run database migrations:**
	```bash
	yarn migrate
	```

5. **Return to the root folder:**
	```bash
	cd ..
	```

6. **Start both frontend and backend servers together:**
	```bash
	yarn run dev
	```
	This will start both servers. Frontend runs on [http://localhost:3000](http://localhost:3000), backend on [http://localhost:3001](http://localhost:3001).

## Assignment Description

This project is a coding assignment for AI engineers. The goal is to build a simple web app that allows users to generate and save emails, featuring:

- A sidebar with a list of emails (Apple Mail style)
- A compose form with To, CC, BCC, Subject, and Body fields
- An AI-powered drafting assistant that routes prompts to specialized assistants (Sales or Follow-up) and streams generated content into the form
- All emails are saved in the database (no actual sending required)
- Built as a monorepo with Next.js frontend and Fastify backend
- Uses MUI for frontend design

See the assignment instructions and test cases in the original README for more details.

## Limited time offer

```bash
Share exclusive 20% discount on SaaS subscription plan
```

## Consulting services

```bash
Present our data analytics services to optimize supply chain
```

## Demo invitation

```bash
Invite to schedule a product demo for cloud security platform
```

## Partnership opportunity

```bash
Reach out about potential partnership with our fintech platform
```
