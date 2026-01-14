// Componenta Footer care afiseaza un citat amuzant de la un API extern
// API-ul folosit este zenquotes.io - returneaza citate random

import { useState, useEffect } from 'react';

function Footer() {
  // stocam citatul curent
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  // functie care ia un citat de la API-ul extern
  const fetchQuote = async () => {
    try {
      // folosim un proxy pentru a evita probleme de CORS
      // API-ul zenquotes nu permite requests direct din browser
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      
      // salvam citatul in state
      setQuote({
        text: data.content,
        author: data.author
      });
    } catch (err) {
      // daca API-ul nu merge, punem un citat default
      console.log('Nu am putut lua citatul:', err);
      setQuote({
        text: 'Invatarea nu se termina niciodata.',
        author: 'Anonim'
      });
    } finally {
      setLoading(false);
    }
  };

  // cand componenta se incarca, luam un citat
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {loading ? (
          <p className="quote-loading">Se incarca citatul zilei...</p>
        ) : (
          <div className="quote-container">
            <p className="quote-text">"{quote?.text}"</p>
            <p className="quote-author">— {quote?.author}</p>
          </div>
        )}
        <div className="footer-info">
          <span>NotaAnonima © 2024</span>
          <button onClick={fetchQuote} className="refresh-quote-btn">
            Citat nou
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
