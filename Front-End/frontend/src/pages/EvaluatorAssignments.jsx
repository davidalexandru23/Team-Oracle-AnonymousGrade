import { useState, useEffect } from 'react';
import { getMyAssignments } from '../api/jury';
import GradeForm from '../components/GradeForm';

function EvaluatorAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignments = async () => {
    try {
      const data = await getMyAssignments();
      setAssignments(data.assignments || []);
    } catch {
      setError('Nu s-au putut incarca evaluarile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('ro-RO');
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="loading">Se incarca evaluarile...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Evaluarile Mele</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="assignments-list">
        {assignments.length === 0 ? (
          <p className="no-data">Nu ai evaluari inca. Vei fi alocat sa evaluezi proiecte de catre profesori.</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.assignmentId} className="card assignment-card">
              <div className="assignment-header">
                <h3>{assignment.deliverable.project.title}</h3>
                <span className={`status-badge ${isExpired(assignment.expiresAt) ? 'expired' : 'active'}`}>
                  {isExpired(assignment.expiresAt) ? 'Expirat' : 'Activ'}
                </span>
              </div>
              <div className="assignment-details">
                <p><strong>Livrabil:</strong> {assignment.deliverable.title}</p>
                <p><strong>Termen limita:</strong> {formatDate(assignment.deliverable.deadline)}</p>
                <p><strong>Notarea expira la:</strong> {formatDate(assignment.expiresAt)}</p>
                {assignment.deliverable.demoUrl && (
                  <p>
                    <strong>Demo:</strong>{' '}
                    <a href={assignment.deliverable.demoUrl} target="_blank" rel="noopener noreferrer">
                      {assignment.deliverable.demoUrl}
                    </a>
                  </p>
                )}
              </div>

              <div className="assignment-grade">
                {assignment.myGrade ? (
                  <div className="current-grade">
                    <p>Nota ta actuala: <strong>{assignment.myGrade.score}</strong></p>
                    <p className="grade-date">Ultima actualizare: {formatDate(assignment.myGrade.updatedAt)}</p>
                  </div>
                ) : (
                  <p className="no-grade">Nu ai trimis inca o nota.</p>
                )}

                <GradeForm
                  deliverableId={assignment.deliverableId}
                  currentGrade={assignment.myGrade}
                  onSubmit={fetchAssignments}
                  disabled={isExpired(assignment.expiresAt)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EvaluatorAssignments;
