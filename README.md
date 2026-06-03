# Mutsura Admin

This project is a front-end implementation of the management dashboard (dashboard) for the Mutsra blog system. It connects to [mutsura-api](https://github.com/kurocode25/mutsura-api) and manages content.

Currently, it is in **development** stage, with frequent additions or changes of functions.

## Overview

A simple and intuitive management panel built with React, TypeScript, and Vite.
Provides management functionality for articles (Post), fixed pages (Page), categories, and tags.

## Main Features

- **Authentication**: login function, JWT token-based authentication, automatic token refresh.
- **Dashboard**: displays system-wide statistics and summaries.
- **Article Management**: creates, edits, lists, and deletes articles using a Markdown editor.
- **Page Management**: lists, creates, edits, and deletes fixed pages.
- **Category Management**: manages categories with listing and detailed management.
- **Tag Management**: manages tags with listing and detailed management.

## Technical Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Emotion](https://emotion.sh/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Markdown Editor**: [EasyMDE](https://github.com/Ionaru/easy-markdown-editor) ([react-simplemde-editor](https://github.com/RIP21/react-simplemde-editor))
- **Utilities**: [date-fns](https://date-fns.org/), [notistack](https://github.com/iamhosseindhv/notistack)

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Installation

Run the following command in the project root directory:

```bash
npm install
```

### Environment Configuration

Create a `.env` file (or `.env.local`) and set the backend API URL.

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Development Server Startup

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to access the development server.

### Build

Generates files for production environment.

```bash
npm run build
```

## Project Structure

```text
src/
├── api.ts          # API client definition
├── App.tsx         # routing settings
├── main.tsx        # entry point
├── theme.ts        # MUI theme settings
├── components/     # UI components
│   ├── auth/       # authentication-related (login, protected routes)
│   ├── posts/      # article management functionality
│   ├── pages/      # page management functionality
│   ├── categories/ # category management functionality
│   └── tags/       # tag management functionality
└── contexts/       # React Context (AuthContext, etc.)
```

## License

See [LICENSE](./LICENSE), [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).
