import { useState, useEffect } from 'react';
import { getProjects } from '../api/projects';
import ProjectCard from '../components/ProjectCard';

function TeacherDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading">Se incarca proiectele...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Toate Proiectele</h1>
      <p className="dashboard-subtitle">Vizualizeaza toate proiectele studentilor si gestioneaza alocarea juriului.</p>

      {error && <div className="error-message">{error}</div>}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-data">Nu exista proiecte inca.</p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
