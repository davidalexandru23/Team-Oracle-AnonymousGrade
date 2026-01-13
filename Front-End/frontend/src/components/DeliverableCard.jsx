import { useState } from 'react';
import { updateDemoUrl } from '../api/deliverables';

function DeliverableCard({ deliverable, onUpdate, canEdit, showGrades }) {
  const [editing, setEditing] = useState(false);
  const [demoUrl, setDemoUrl] = useState(deliverable.demoUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDemoUrl(deliverable.id, demoUrl);
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch {
      alert('Nu s-a putut actualiza URL-ul demo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ro-RO');
  };

  return (
    <div className="card deliverable-card">
      <h4>{deliverable.title}</h4>
      <p>{deliverable.description}</p>
      <div className="deliverable-meta">
        <span>Termen limita: {formatDate(deliverable.deadline)}</span>
      </div>

      <div className="deliverable-demo">
        <label>URL Demo:</label>
        {editing ? (
          <div className="demo-edit">
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
            />
            <button onClick={handleSave} disabled={loading} className="btn btn-small">
              Salveaza
            </button>
            <button onClick={() => setEditing(false)} className="btn btn-small btn-secondary">
              Anuleaza
            </button>
          </div>
        ) : (
          <div className="demo-display">
            {deliverable.demoUrl ? (
              <a href={deliverable.demoUrl} target="_blank" rel="noopener noreferrer">
                {deliverable.demoUrl}
              </a>
            ) : (
              <span className="no-demo">Niciun URL demo setat</span>
            )}
            {canEdit && (
              <button onClick={() => setEditing(true)} className="btn btn-small">
                Editeaza
              </button>
            )}
          </div>
        )}
      </div>

      {showGrades && deliverable.finalGrade !== undefined && (
        <div className="deliverable-grade">
          {deliverable.status === 'ok' ? (
            <span className="final-grade">Nota Finala: {deliverable.finalGrade}</span>
          ) : (
            <span className="waiting-grade">Se asteapta note</span>
          )}
        </div>
      )}
    </div>
  );
}

export default DeliverableCard;
