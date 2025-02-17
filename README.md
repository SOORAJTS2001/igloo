# Igloo 🍙 - Your Own Knowledge base

A modern, responsive web application for managing and searching through various document formats with real-time search capabilities and dark mode support.

![Knowledge Base](https://raw.githubusercontent.com/SOORAJTS2001/igloo/refs/heads/main/igloo.webp)

## Features

- 📁 Support for multiple file formats:
  - JSON
  - CSV
  - Excel (XLSX/XLS)
  - Text files
- 🔍 Real-time search with highlighted results
- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- ⚡ Infinite scrolling for large document sets
- 🎯 Document preview with syntax highlighting

## Tech Stack

- **Framework**: Next.js 13.5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Document Highlighter**: shikhi
- **Icons**: Lucide React

## Getting Started - Frontend

1. Clone the repository
2. Change directory to frontend:
   ```bash
    cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Frontend Structure

```
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── providers.tsx    # App providers
├── components/
│   ├── document-list.tsx    # Document list component
│   ├── document-viewer.tsx  # Document viewer
│   └── ui/                  # UI components
├── lib/
│   ├── api.ts              # API service
│   ├── document-parser.ts  # File parsing logic
│   ├── store.ts           # State management
│   └── utils.ts           # Utility functions
└── types/
    └── document.ts        # TypeScript types
```

## Features in Detail

### Document Management
- Upload multiple documents simultaneously
- Automatic format detection and parsing
- Document preview with syntax highlighting
- Delete documents with confirmation

### Search Functionality
- Real-time search across all documents
- Highlighted search results
- Search within specific documents
- Page and line number indicators

### User Interface
- Responsive sidebar navigation
- Dark/Light mode toggle
- Mobile-friendly design
- Infinite scroll for large document sets
- Loading states and animations

### Performance
- Efficient document parsing
- Pagination and infinite scroll
- Optimized rendering for large documents

## Getting Started - Backend

1. Clone the repository
2. Change directory to frontend:
   ```bash
    cd backend
   ```
3. Install dependencies:
   ```bash
   pip install poetry
   poetry install
   ```
4. Start the development server:
   ```bash
   uvicorn app:app --reload --port 6969
   ```
5. Open [http://localhost:6969/docs](http://localhost:6969/docs) in your browser

## Backend Structure

```
├── base_models/
│   ├── document_data.py       # How document is stored
│   ├── response_data.py       # How document is shown
├── controllers/
│   ├── controller.py           # Controls the data flow b/w DB and APP
├── settings/
│   └── base.py       # Loading the environment variables
└── utils/
│    └── db_engine       # Used for database interactions
│   └── file_handlers    # Used to convert files into     documents
│   
└──app.py  # Entry point to the application, calls the controller
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icons
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Next.js](https://nextjs.org/) for the framework