# Lanang Blog

🚀 A modern blog website built with **Next.js 15** and **TypeScript**, using **Prisma** as ORM and **PostgreSQL** as the database.

## Features

- 🌍 **Next.js 15** for server-side rendering and static site generation.
- 📜 **TypeScript** for type safety and better development experience.
- 🛠 **Prisma** as the ORM for interacting with **PostgreSQL**.
- ✍ **Tiptap** rich text editor with multiple extensions for a great writing experience.
- 🔍 **Dynamic Metadata** for better SEO and social sharing.
- 🔄 **Axios** for efficient data fetching.
- 🔑 **NextAuth.js** with Google authentication.
- 🎨 **Radix UI** components for accessible UI elements.
- 🎭 **Redux Toolkit** for state management.

## Tech Stack

- **Frontend**: Next.js 15 (TypeScript), React 19
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Google OAuth)
- **Styling**: Tailwind CSS, Sass
- **State Management**: Redux Toolkit
- **Editor**: Tiptap with various extensions

## Installation

1. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

2. Set up environment variables:
   Create a `.env` file and add the following variables:
   ```env
   NEXT_PUBLIC_APP_NAME="Your Blog Name"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   COOKIE_NAME="your_cookie_name"
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   SECRET_KEY="your_secret_key"
   ```

3. Run database migration:
   ```sh
   npx prisma migrate dev
   ```

4. Seed the database:
   ```sh
   npx prisma db seed
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Create and manage blog posts using the Tiptap editor with custom extensions.
- Users can sign in using their Google account.
- Fetch and display blog posts dynamically with Axios.
- Utilize Radix UI for accessible UI components.

## Deployment
To deploy your Next.js app, you can use:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/) (for hosting PostgreSQL + backend)

## Contributing
Contributions are welcome! Feel free to open issues and pull requests.

## License
This project is licensed under the MIT License.
