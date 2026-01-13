import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../api/projects';
import { createDeliverable, getDeliverables } from '../api/deliverables';
import { getGrades } from '../api/grades';
import { assignJury } from '../api/jury';
import { useAuth } from '../store/authStore.jsx';
import DeliverableCard from '../components/DeliverableCard';

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [creating, setCreating] = useState(false);

  const isTeacher = user?.role === 'TEACHER';
  const isOwner = project?.ownerId === user?.id;

  const fetchProjectData = async () => {
    try {
      const projectData = await getProject(id);
      setProject(projectData.project);

      const deliverablesData = await getDeliverables(id);
      let delivs = deliverablesData.deliverables || [];

      const deliverablesWithGrades = await Promise.all(
        delivs.map(async (del) => {
          try {
            const gradesData = await getGrades(del.id);
            return {
              ...del,
              finalGrade: gradesData.finalGrade,
              status: gradesData.status,
              gradesCount: gradesData.gradesCount,
              grades: gradesData.grades
            };
          } catch {
            return del;
          }
        })
      );

      setDeliverables(deliverablesWithGrades);
    } catch {
      setError('Nu s-a putut incarca proiectul');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleCreateDeliverable = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await createDeliverable(id, {
        title,
        description,
        deadline: new Date(deadline).toISOString(),
        demoUrl: demoUrl || undefined
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      setDemoUrl('');
      setShowForm(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut crea livrabilul');
    } finally {
      setCreating(false);
    }
  };

  const handleAssignJury = async (deliverableId) => {
    try {
      const result = await assignJury(deliverableId);
      alert(`Juriu alocat! ${result.jurySize} evaluatori, expira la ${new Date(result.expiresAt).toLocaleString('ro-RO')}`);
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.message || 'Nu s-a putut aloca juriul');
    }
  };

  if (loading) {
    return <div className="loading">Se incarca proiectul...</div>;
  }

  if (!project) {
    return <div className="error-message">Proiectul nu a fost gasit</div>;
  }

  return (
    <div className="project-details">
      <div className="project-header">
        <h1>{project.title}</h1>
        <p className="project-description">{project.description}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="deliverables-section">
        <div className="section-header">
          <h2>Livrabile</h2>
          {(isOwner || isTeacher) && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? 'Anuleaza' : 'Adauga Livrabil'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="create-form-container">
            <form onSubmit={handleCreateDeliverable} className="create-form">
              <div className="form-group">
                <label htmlFor="del-title">Titlu</label>
                <input
                  type="text"
                  id="del-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="del-description">Descriere</label>
                <textarea
                  id="del-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label htmlFor="del-deadline">Termen Limita</label>
                <input
                  type="datetime-local"
                  id="del-deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="del-demo">URL Demo (optional)</label>
                <input
                  type="url"
                  id="del-demo"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <button type="submit" disabled={creating} className="btn btn-primary">
                {creating ? 'Se creeaza...' : 'Creeaza Livrabil'}
              </button>
            </form>
          </div>
        )}

        <div className="deliverables-list">
          {deliverables.length === 0 ? (
            <p className="no-data">Nu exista livrabile inca.</p>
          ) : (
            deliverables.map((del) => (
              <div key={del.id} className="deliverable-item">
                <DeliverableCard
                  deliverable={del}
                  onUpdate={fetchProjectData}
                  canEdit={isOwner || isTeacher}
                  showGrades={true}
                />
                {isTeacher && (
                  <div className="teacher-actions">
                    <button
                      onClick={() => handleAssignJury(del.id)}
                      className="btn btn-secondary"
                    >
                      Aloca Juriu
                    </button>
                    {del.grades && del.grades.length > 0 && (
                      <div className="grades-list">
                        <h4>Note Individuale (Anonime):</h4>
                        <ul>
                          {del.grades.map((g, idx) => (
                            <li key={g.gradeId || idx}>
                              Evaluator #{idx + 1}: {g.score}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
