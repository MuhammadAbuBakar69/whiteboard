# HTML5 Canvas Collaborative Whiteboard React Component

A responsive canvas drawing application built with React and native HTML5 Canvas API.

## Features
- **Drawing Tools**: Freehand pen tool and eraser tool
- **Color Selection**: Preset swatches plus HTML5 color picker
- **Brush Sizing**: Adjustable slider for line width control (1px to 50px)
- **Undo / Redo History**: History stack tracking drawing steps for easy undo and redo
- **Canvas Clear**: One-click wipe to reset canvas background
- **Export to Image**: Export drawing directly as PNG (`canvas.toDataURL()`)
- **Touch & Mouse Support**: Fully responsive drawing supporting touch events on tablets/mobile and mouse drag on desktop

## Setup and Usage

1. Copy `whiteboard_App.jsx` and `whiteboard_App.css` into your Vite React project.
2. Render `App` in `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './whiteboard_App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

3. Launch Vite server:
```bash
npm run dev
```
