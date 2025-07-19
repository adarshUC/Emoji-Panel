import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { EmojiPage } from '@/pages/EmojiPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/emoji" element={<EmojiPage />} />
    </Routes>
  );
}

export default App;
