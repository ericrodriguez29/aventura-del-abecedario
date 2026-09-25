import React, { useRef, useState, useEffect } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Palette, RotateCcw, Volume2, Sparkles, Star, Download } from 'lucide-react';

interface DrawingModeProps {
  user: User;
  onLetterDrawn: () => void;
}

const BRUSH_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

export const DrawingMode: React.FC<DrawingModeProps> = ({ user, onLetterDrawn }) => {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(14);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    clearCanvas();
  }, [selectedLetter]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fill white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw guidelines & watermark letter
    ctx.save();
    ctx.font = 'bold 220px Fredoka, sans-serif';
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${selectedLetter.letter}${selectedLetter.lower}`, canvas.width / 2, canvas.height / 2);

    // Dashed guide outline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 10]);
    ctx.strokeText(`${selectedLetter.letter}${selectedLetter.lower}`, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDone = () => {
    soundManager.playCorrect();
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
    soundManager.speak(`¡Hermoso dibujo de la letra ${selectedLetter.letter}, ${user.name}! ¡Eres un gran artista!`);
    onLetterDrawn();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-lime-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-1.5">
            <Palette className="w-3.5 h-3.5 text-yellow-300" />
            Taller Mágico: Trazo y Dibujo
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            ¡Traza y Pinta la Letra!
          </h2>
          <p className="text-teal-100 text-xs sm:text-sm font-medium">
            Sigue las líneas punteadas o dibuja con tus colores favoritos.
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            soundManager.speak(`Letra ${selectedLetter.letter}. ${selectedLetter.word}.`);
          }}
          className="bg-white/25 hover:bg-white/35 backdrop-blur-md border border-white/40 text-white font-black px-4 py-2 rounded-2xl flex items-center gap-2 text-sm shadow transition-all active:scale-95 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-yellow-300" />
          <span>Escuchar Letra</span>
        </button>
      </div>

      {/* Main Drawing Area */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-teal-200">
        {/* Letter Selector Carousel */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
          {ALPHABET_DATA.map((item) => (
            <button
              key={item.letter}
              onClick={() => {
                soundManager.playPop();
                setSelectedLetter(item);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-2xl font-black text-base border-2 transition-all cursor-pointer ${
                selectedLetter.letter === item.letter
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {item.letter}{item.lower}
            </button>
          ))}
        </div>

        {/* Color Palette & Brush Tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-2xl mb-4">
          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-600 mr-1">Colores:</span>
            {BRUSH_COLORS.map((col) => (
              <button
                key={col}
                onClick={() => {
                  soundManager.playPop();
                  setBrushColor(col);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-md transition-transform cursor-pointer ${
                  brushColor === col ? 'scale-125 ring-3 ring-slate-800' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playPop();
                clearCanvas();
              }}
              className="bg-white hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-slate-300 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>

            <button
              onClick={handleDone}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black px-4 py-1.5 rounded-xl text-xs shadow-md border-b-2 border-emerald-800 flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>¡Terminé mi trazo!</span>
            </button>
          </div>
        </div>

        {/* Canvas Element */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={380}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="w-full max-w-xl h-auto border-4 border-slate-300 rounded-3xl bg-white shadow-inner cursor-crosshair touch-none"
          />
        </div>
      </div>
    </div>
  );
};
