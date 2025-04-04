import React, { useState, useRef, useEffect } from 'react';

interface PixelEditorProps {
  width: number;
  height: number;
  onSave: (dataUrl: string) => void;
}

export function PixelEditor({ width, height, onSave }: PixelEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ff71ce');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  const pixelSize = 30;
  const canvasWidth = width * pixelSize;
  const canvasHeight = height * pixelSize;

  const colors = [
    '#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', // Neon
    '#fffb96', '#ff9f1c', '#ff4040', '#8b5cf6', // Pastel
    '#ffffff', '#000000', '#4a4a4a', '#facc15'  // Essentials
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    drawGrid(ctx);
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    for (let x = 0; x <= canvasWidth; x += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  };

  const drawPixel = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelX = Math.floor(x / pixelSize) * pixelSize;
    const pixelY = Math.floor(y / pixelSize) * pixelSize;

    ctx.fillStyle = currentColor;
    ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    saveHistory();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveHistory();
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    drawGrid(ctx);
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    setHistory((prev) => [...prev, imageData]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = history.pop();
    if (lastState) {
      setRedoStack((prev) => [...prev, ctx.getImageData(0, 0, canvasWidth, canvasHeight)]);
      ctx.putImageData(lastState, 0, 0);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastRedo = redoStack.pop();
    if (lastRedo) {
      setHistory((prev) => [...prev, ctx.getImageData(0, 0, canvasWidth, canvasHeight)]);
      ctx.putImageData(lastRedo, 0, 0);
    }
  };

  return (
    <div className="pixel-editor bg-opacity-80 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-lg">
      {/* Color Palette */}
      <div className="mb-4 flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button" // Prevents default form submission
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              color === currentColor ? 'ring-4 ring-white' : 'border-gray-600'
            }`}
            style={{ backgroundColor: color }}
            onClick={(e) => {
              e.preventDefault(); // Extra safety
              setCurrentColor(color);
            }}
          />
        ))}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border-4 border-gray-500 cursor-crosshair rounded-lg shadow-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-4">
        <button type="button" onClick={handleUndo} className="neon-button bg-yellow-500">Undo</button>
        <button type="button" onClick={handleRedo} className="neon-button bg-purple-500">Redo</button>
        <button type="button" onClick={handleClear} className="neon-button bg-red-500">Clear</button>
        <button type="button" onClick={handleSave} className="neon-button bg-green-500">Save</button>
      </div>

      <style jsx>{`
        .neon-button {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: bold;
          color: white;
          text-shadow: 0 0 5px white;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .neon-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}
export default PixelEditor;