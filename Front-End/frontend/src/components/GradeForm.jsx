import { useState } from 'react';
import { submitGrade } from '../api/grades';

function GradeForm({ deliverableId, currentGrade, onSubmit, disabled }) {
  const [score, setScore] = useState(currentGrade?.score || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 1 || numScore > 10) {
      setError('Nota trebuie sa fie intre 1 si 10');
      return;
    }

    setLoading(true);
    try {
      await submitGrade(deliverableId, numScore);
      if (onSubmit) onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut trimite nota');
    } finally {
      setLoading(false);
    }
  };

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
          disabled={disabled || loading}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={disabled || loading} className="btn btn-primary">
        {currentGrade ? 'Actualizeaza Nota' : 'Trimite Nota'}
      </button>
    </form>
  );
}

export default GradeForm;
