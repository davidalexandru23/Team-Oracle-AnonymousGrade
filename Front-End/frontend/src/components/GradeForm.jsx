// GradeForm.jsx - formularul pentru trimiterea notelor
// afisare diferita daca termenul a expirat vs daca e inca activ

import { useState } from 'react';
import { submitGrade } from '../api/grades';

function GradeForm({ deliverableId, currentGrade, onSubmit, disabled, expiresAt }) {
  // starea formularului
  const [score, setScore] = useState(currentGrade?.score || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // verificam daca termenul a expirat - in timp real
  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : disabled;

  // trimiterea notei
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // verificam inca o data daca nu a expirat
    if (isExpired) {
      setError('Termenul de evaluare a expirat. Nu mai poti modifica nota.');
      return;
    }

    setError('');
    setSuccess('');

    // validam nota - trebuie sa fie intre 1 si 10
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 1 || numScore > 10) {
      setError('Nota trebuie sa fie intre 1 si 10');
      return;
    }

    // rotunjim la 2 zecimale
    const roundedScore = Math.round(numScore * 100) / 100;

    setLoading(true);
    try {
      await submitGrade(deliverableId, roundedScore);
      setSuccess('Nota a fost salvata cu succes!');
      // notificam parintele sa reimprospateze datele
      if (onSubmit) onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut trimite nota');
    } finally {
      setLoading(false);
    }
  };

  // daca a expirat, afisam doar nota finala sau mesaj de ratare
  if (isExpired) {
    return (
      <div className="grade-form-expired">
        {currentGrade ? (
          <p className="final-submitted-grade">
            Nota ta finala: <strong>{currentGrade.score}</strong>
          </p>
        ) : (
          <p className="missed-deadline">
            Nu ai trimis nota la timp. Termenul a expirat.
          </p>
        )}
      </div>
    );
  }

  // formularul activ pentru introducerea notei
  return (
    <form onSubmit={handleSubmit} className="grade-form">
      <div className="form-group">
        <label htmlFor="score">Nota (1-10):</label>
        <input
          type="number"
          id="score"
          min="1"
          max="10"
          step="0.01"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          disabled={loading}
          placeholder="ex: 8.50"
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Se salveaza...' : (currentGrade ? 'Actualizeaza Nota' : 'Trimite Nota')}
      </button>
    </form>
  );
}

export default GradeForm;
