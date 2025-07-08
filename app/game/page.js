'use client';

import { Suspense } from 'react';
import GameBoard from '../components/GameBoard';

// A wrapper component to ensure useSearchParams is used within a Suspense boundary
function GamePageContent() {
  return <GameBoard />;
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Game...</div>}>
      <GamePageContent />
    </Suspense>
  );
}