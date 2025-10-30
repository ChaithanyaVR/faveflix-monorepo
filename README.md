# Faveflix 

A full‑stack personal media library where users can search movies, auto‑fill movie details using TMDB, and save favorites. This project focuses on building a clean user experience with smart form assistance and a modern tech stack.

## Features
### Core Functionalities
 - Search movies in real‑time using TMDB API
 - Auto‑fill movie metadata (poster, release year, budget etc.)
 - Save & manage favorites in your personal dashboard
 - Clean responsive UI with intuitive UX
 - Secure API layer with proper request validation

### Additional Enhancements
 - Smart auto‑complete movie input
 - Auto‑population of form fields from selected movie
 - Optimized API structure for scalability

## Built With
### Frontend
  - Vite + Typescript
  - Tailwind CSS
  - Flowbite

 ### Backend
  - Node.js
  - Express.js
  - MySQL Workbench
  - Prisma ORM
  - TMDB API integration

## Setup & Installation
 1. Clone the repository:
```bash
git clone https://github.com/your-username/faveflix-monorepo.git
cd faveflix-monorepo
```
2.Install server dependencies:
```bash
cd server
npm install
```
3.Install client dependencies:
```bash
cd client
npm install
```
4.Set up MySQL database:
1.Start MySQL (Workbench or local server)
```bash
CREATE DATABASE media_library;
```
2.Copy .env.example → .env
In backend/.env
```bash
DATABASE_URL="mysql://root:password@localhost:3306/media_library"
TMDB_API_KEY="YOUR_TMDB_API_KEY"
```
3.Prisma Commands
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```
4.TMDB API Setup
Go to: https://developer.themoviedb.org/
```bash
Create a free API key, TOKEN and paste it in server .env
```

5.Run Project
Start Backend
```bash
cd server
npm run dev
```
Start Frontend
```bash
cd client
npm run dev
```





  
