import React, { useRef, useState, useEffect } from 'react';
import './whiteboard_App.css';

const PRESET_COLORS = [
  '#000000',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ffffff',
];

export default function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas size and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas internal resolution to match container
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill background white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial blank state to history
    saveStateToHistory(canvas);
  }, []);

  const saveStateToHistory = (canvas) => {
    const dataUrl = canvas.toDataURL();
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, dataUrl];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 3;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();

    saveStateToHistory(canvas);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveStateToHistory(canvas);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      const img = new Image();
      img.src = history[newIdx];
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistoryIndex(newIdx);
      };
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      const img = new Image();
      img.src = history[newIdx];
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistoryIndex(newIdx);
      };
    }
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="wb-container">
      {/* Top Floating Toolbar */}
      <header className="wb-toolbar">
        <div className="wb-brand">
          <span className="wb-logo">🎨</span>
          <h1>Whiteboard</h1>
        </div>

        {/* Tools */}
        <div className="wb-tool-group">
          <button
            className={`wb-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
            title="Pen"
          >
            ✏️ Pen
          </button>
          <button
            className={`wb-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            🧹 Eraser
          </button>
        </div>

        {/* Color Palette */}
        {tool === 'pen' && (
          <div className="wb-color-group">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                className={`wb-color-swatch ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="wb-color-picker"
              title="Custom Color"
            />
          </div>
        )}

        {/* Brush Size Slider */}
        <div className="wb-size-group">
          <label htmlFor="brushSize">Size: {brushSize}px</label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="wb-slider"
          />
        </div>

        {/* Actions */}
        <div className="wb-action-group">
          <button
            className="wb-btn"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            ↩️ Undo
          </button>
          <button
            className="wb-btn"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            ↪️ Redo
          </button>
          <button className="wb-btn btn-danger" onClick={handleClear} title="Clear Canvas">
            🗑️ Clear
          </button>
          <button className="wb-btn btn-success" onClick={handleSaveImage} title="Save Image">
            💾 Save PNG
          </button>
        </div>
      </header>

      {/* Canvas Area */}
      <div className="wb-canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`wb-canvas ${tool}`}
        />
      </div>
    </div>
  );
}
