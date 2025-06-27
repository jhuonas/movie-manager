import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-4 border-t text-center text-sm text-gray-500 mt-8">
      <span>
        © {new Date().getFullYear()} Movie Manager. Desenvolvido por <a href="https://github.com/jhuonas/movie-manager" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">jhuonas</a>.
      </span>
    </footer>
  );
} 