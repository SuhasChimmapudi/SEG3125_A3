import { useEffect, useState } from 'react';
import './Header.css'; // link this to your CSS

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <div className="logo">MATCH & REMEMBER</div>
        <nav>
          <a href="/">home</a>
          <a href="/about">about</a>
          
        </nav>
      </div>
    </header>
  );
}
