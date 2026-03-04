'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { ChevronLeft, ChevronRight, Play, Pause, Send, Bot, User } from 'lucide-react';
import { presentationData } from '../presentationData';

export default function InteractivePitchDeck() {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentSlideData = presentationData[currentIndex];
  const totalSlides = presentationData.length;

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      { 
        id: 'welcome-msg', 
        role: 'assistant', 
        content: "Welcome. I am the AIlevator & Visiabell automated guide. I can run a web audit, map a growth strategy, or answer questions about our packages. What can I help you with?" 
      }
    ]
  });

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSlideData.audio;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      }
    }
  }, [currentIndex, currentSlideData.audio, isPlaying]);

  const handleNextSlide = () => {
    if (currentIndex < totalSlides - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* LEFT COLUMN: Viewer */}
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between border-r border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Garage Band Venture Company
          </h1>
          <span className="text-sm text-slate-400 font-mono">
            Slide {currentSlideData.id}
          </span>
        </div>

        <div className="flex-grow flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800 shadow-inner overflow-hidden relative aspect-video">
          {/* Fallback text while you upload images */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-0">
            <span>Upload {currentSlideData.image} to GitHub</span>
          </div>
          <img 
            src={currentSlideData.image} 
            alt={currentSlideData.title} 
            className="object-contain w-full h-full z-10 relative"
            onError={(e) => e.target.style.opacity = 0} // Hides broken image icon if missing
          />
        </div>

        <audio ref={audioRef} onEnded={handleNextSlide} className="hidden" />

        <div className="mt-6 flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-800">
          <button 
            onClick={toggleAudio}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span className="font-medium">{isPlaying ? 'Pause Audio' : 'Play Presentation'}</span>
          </button>

          <div className="flex gap-3">
            <button 
              onClick={handlePrevSlide} disabled={currentIndex === 0}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-md transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNextSlide} disabled={currentIndex === totalSlides - 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-md transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI Agent */}
      <div className="w-full md:w-1/3 flex flex-col bg-slate-900 shadow-xl h-screen">
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-full">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100">AIlevator Assistant</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
            </p>
          </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-slate-800'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-blue-400" />}
              </div>
              <div className={`p-3 rounded-lg text-sm leading-relaxed max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}>
                {msg.content}
                {/* Visual indicator if a tool was called */}
                {msg.toolInvocations?.map(tool => (
                  <div key={tool.toolCallId} className="mt-2 p-2 bg-slate-950 text-xs rounded border border-slate-700 text-blue-400">
                    ⚙️ Executing: {tool.toolName}...
                  </div>
                ))}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-slate-500 text-xs italic ml-11">AI is thinking...</div>}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask for an audit or strategy..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-full transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
