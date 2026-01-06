# Unfollow App 😊

A modern, mobile-first React application to find users who don't follow you back. Built with React, Tailwind CSS, and daisyUI.

## Features ✨

- 📱 **Mobile-first design** with responsive layout
- 🎨 **Modern UI** with rounded corners, soft shadows, and smooth transitions
- 📊 **Multiple JSON format support**:
  - Simple arrays: `["user1", "user2"]`
  - Object arrays: `[{ "username": "user1" }]`
  - Instagram export format (auto-detected)
- ✅ **Real-time JSON validation** with friendly error messages
- 🎉 **Celebration effects** with confetti when results appear
- 💾 **Data persistence** using localStorage (survives page refresh)
- ⚡ **Skeleton loading** states for smooth UX
- 🗑️ **Remove users** from results with one click

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Usage

1. Paste your **Followers JSON** in the first textarea
2. Paste your **Following JSON** in the second textarea
3. Click "Compare & Find Non-Followers 🔥"
4. View the results and remove users as needed
5. All data is automatically saved to localStorage

## Tech Stack

- React 18 (functional components + hooks)
- Tailwind CSS
- daisyUI
- Vite
- canvas-confetti
- react-icons

## Project Structure

```
src/
  ├── components/      # Reusable UI components
  ├── utils/          # Utility functions (parsing, storage)
  ├── App.jsx         # Main application component
  ├── main.jsx        # Entry point
  └── index.css       # Global styles
```

## License

MIT

