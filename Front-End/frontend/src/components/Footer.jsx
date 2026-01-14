// Componenta Footer care afiseaza un citat amuzant de la un API extern
// API-ul folosit este dummyjson.com/quotes - API gratuit care permite CORS

import { useState, useEffect } from 'react';

function Footer() {
  // stocam citatul curent
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  // lista de citate locale ca backup daca API-ul nu merge
  const fallbackQuotes = [
    { text: "Invatarea nu se termina niciodata.", author: "Leonardo da Vinci" },
    { text: "Cel mai bun timp sa plantezi un copac a fost acum 20 de ani. Al doilea cel mai bun timp este acum.", author: "Proverb Chinezesc" },
    { text: "Succesul nu este final, esecul nu este fatal: curajul de a continua este ceea ce conteaza.", author: "Winston Churchill" },
    { text: "Simplitatea este sofisticarea suprema.", author: "Leonardo da Vinci" },
    { text: "Viitorul apartine celor care cred in frumusetea viselor lor.", author: "Eleanor Roosevelt" },
    { text: "Nu astepta. Nu va fi niciodata momentul potrivit.", author: "Napoleon Hill" },
    { text: "Fiecare expert a fost candva un incepator.", author: "Helen Hayes" },
    { text: "Fa azi ce altii nu vor, ca maine sa poti face ce altii nu pot.", author: "Jerry Rice" }
  ];

  // functie care ia un citat de la API-ul extern DummyJSON
  const fetchQuote = async () => {
    setLoading(true);
    try {
      // DummyJSON - API gratuit care permite CORS
      // luam un citat random (id intre 1 si 30)
      const randomId = Math.floor(Math.random() * 30) + 1;
      const response = await fetch(`https://dummyjson.com/quotes/${randomId}`);
      
      if (!response.ok) {
        throw new Error('API nu a raspuns');
      }
      
      const data = await response.json();
      
      // salvam citatul in state
      setQuote({
        text: data.quote,
        author: data.author
      });
    } catch (err) {
      // daca API-ul nu merge, alegem un citat random din backup
      console.log('API extern indisponibil, folosim citat local:', err);
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      setQuote(fallbackQuotes[randomIndex]);
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
