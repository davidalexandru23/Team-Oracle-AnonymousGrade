import { useState, useEffect } from 'react';
import { getProjects, createProject } from '../api/projects';
import ProjectCard from '../components/ProjectCard';

function MpDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch {
      setError('Nu s-au putut incarca proiectele');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await createProject(title, description);
      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut crea proiectul');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="loading">Se incarca proiectele...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Proiectele Mele</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Anuleaza' : 'Creeaza Proiect'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="create-form-container">
          <form onSubmit={handleCreate} className="create-form">
            <div className="form-group">
              <label htmlFor="title">Titlu Proiect</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descriere</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>
            <button type="submit" disabled={creating} className="btn btn-primary">
              {creating ? 'Se creeaza...' : 'Creeaza'}
            </button>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-data">Nu ai proiecte inca. Creeaza primul tau proiect!</p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}

export default MpDashboard;
