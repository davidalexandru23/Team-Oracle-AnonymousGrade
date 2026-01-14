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
    return new Date(dateStr).toLocaleString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} zile ramase`;
    }
    return `${hours}h ${minutes}m ramase`;
  };

  const activeAssignments = assignments.filter(a => !isExpired(a.expiresAt));
  const expiredAssignments = assignments.filter(a => isExpired(a.expiresAt));

  if (loading) {
    return <div className="loading">Se incarca evaluarile...</div>;
  }

  return (
    <div className="evaluator-dashboard">
      <div className="dashboard-header">
        <h1>Evaluarile Mele</h1>
        <p className="dashboard-subtitle">
          Proiectele pe care trebuie sa le evaluezi ca membru al juriului
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {assignments.length === 0 ? (
        <div className="empty-state">
          <h3>Nu ai evaluari inca</h3>
          <p>Vei fi alocat aleatoriu sa evaluezi proiecte de catre profesori.</p>
        </div>
      ) : (
        <>
          {activeAssignments.length > 0 && (
            <div className="assignments-section">
              <h2 className="section-title">
                Evaluari Active ({activeAssignments.length})
              </h2>
              <div className="assignments-grid">
                {activeAssignments.map((assignment) => (
                  <div key={assignment.assignmentId} className="assignment-card active">
                    <div className="assignment-card-header">
                      <div className="project-info">
                        <h3>{assignment.deliverable.project.title}</h3>
                        <span className="deliverable-name">{assignment.deliverable.title}</span>
                      </div>
                      <div className="time-badge active">
                        {getTimeRemaining(assignment.expiresAt)}
                      </div>
                    </div>

                    <div className="assignment-card-body">
                      {assignment.deliverable.demoUrl && (
                        <a 
                          href={assignment.deliverable.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="demo-link"
                        >
                          Vezi Demo
                        </a>
                      )}
                      
                      <div className="deadline-info">
                        <span className="label">Termen livrabil:</span>
                        <span className="value">{formatDate(assignment.deliverable.deadline)}</span>
                      </div>
                      
                      <div className="deadline-info">
                        <span className="label">Evaluare pana la:</span>
                        <span className="value highlight">{formatDate(assignment.expiresAt)}</span>
                      </div>
                    </div>

                    <div className="assignment-card-footer">
                      {assignment.myGrade && (
                        <div className="current-grade-display">
                          <span className="grade-label">Nota ta curenta:</span>
                          <span className="grade-value">{assignment.myGrade.score}</span>
                        </div>
                      )}
                      <GradeForm
                        deliverableId={assignment.deliverableId}
                        currentGrade={assignment.myGrade}
                        onSubmit={fetchAssignments}
                        expiresAt={assignment.expiresAt}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expiredAssignments.length > 0 && (
            <div className="assignments-section expired-section">
              <h2 className="section-title">
                Evaluari Finalizate ({expiredAssignments.length})
              </h2>
              <div className="assignments-grid">
                {expiredAssignments.map((assignment) => (
                  <div key={assignment.assignmentId} className="assignment-card expired">
                    <div className="assignment-card-header">
                      <div className="project-info">
                        <h3>{assignment.deliverable.project.title}</h3>
                        <span className="deliverable-name">{assignment.deliverable.title}</span>
                      </div>
                      <div className="time-badge expired">Finalizat</div>
                    </div>

                    <div className="assignment-card-body">
                      <div className="deadline-info">
                        <span className="label">Evaluat la:</span>
                        <span className="value">{formatDate(assignment.expiresAt)}</span>
                      </div>
                    </div>

                    <div className="assignment-card-footer">
                      <GradeForm
                        deliverableId={assignment.deliverableId}
                        currentGrade={assignment.myGrade}
                        onSubmit={fetchAssignments}
                        expiresAt={assignment.expiresAt}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EvaluatorAssignments;
