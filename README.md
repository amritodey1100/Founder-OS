# Founder OS - Content Pipeline Dashboard

A React-based content management dashboard with a dark, terminal-style programmer aesthetic. Built for managing video content pipelines using a Kanban workflow.

![Terminal Dashboard](https://img.shields.io/badge/UI-Terminal%20Style-000000?style=flat-square&logo=windowsterminal)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)

## Features

- **Kanban Board** - Organize content across columns: Ideas → Scripting → Filming → Posted
- **Dynamic Sections** - Add, rename, and delete custom columns
- **Markdown Support** - Full GFM support for descriptions (headings, lists, code blocks, tables)
- **Local Storage** - All data persists in browser localStorage
- **Search/Filter** - Quickly find items across all columns
- **Terminal Aesthetic** - Dark theme with Fira Code font and subtle neon accents

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- react-markdown + remark-gfm
- react-icons (Heroicons)
- LocalStorage for persistence

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx         # App header with logo & status
│   ├── SearchBar.jsx      # Global search filter
│   ├── Column.jsx         # Kanban column
│   ├── ItemCard.jsx       # Task/item card
│   ├── Modal.jsx          # Reusable modal wrapper
│   ├── EditItemModal.jsx  # Markdown editor modal
│   ├── ViewItemModal.jsx  # Item detail view
│   └── AddSectionModal.jsx # Create new columns
├── hooks/
│   └── useLocalStorage.js # Persistent state hook
├── utils/
│   └── localStorage.js    # Storage utilities
├── App.jsx                # Main application
└── index.css              # Tailwind + custom styles
```

## License

MIT
