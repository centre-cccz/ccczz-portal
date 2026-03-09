Notes pratiques Next.js on cPanel / production

- Next.js App Router API routes must live under app/api/<route>/route.ts
- For MySQL access from Next.js route, add mysql2 (npm install mysql2)
- If hosting on cPanel use the "Setup Node.js App" feature to run the app (set correct app root, start command 'npm start')
- Keep .env out of version control; use cPanel environment variables where possible
- For small sites you may also export static via `next export` but API routes won't work
