import { useState } from 'react';
import { submitGrade } from '../api/grades';

function GradeForm({ deliverableId, currentGrade, onSubmit, disabled, expiresAt }) {
  const [score, setScore] = useState(currentGrade?.score || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check expiration in real-time
  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : disabled;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double-check expiration before submitting
    if (isExpired) {
      setError('Termenul de evaluare a expirat. Nu mai poti modifica nota.');
      return;
    }

    setError('');
    setSuccess('');

    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 1 || numScore > 10) {
      setError('Nota trebuie sa fie intre 1 si 10');
      return;
    }

    // Round to 2 decimal places
    const roundedScore = Math.round(numScore * 100) / 100;

    setLoading(true);
    try {
      await submitGrade(deliverableId, roundedScore);
      setSuccess('Nota a fost salvata cu succes!');
      if (onSubmit) onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut trimite nota');
    } finally {
      setLoading(false);
    }
  };

  // If expired, show read-only view
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
