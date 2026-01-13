import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeam, addProjectToTeam } from '../api/teams';
import { useAuth } from '../store/authStore.jsx';

function TeamDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const isOwner = team?.ownerId === user?.id;

  const fetchTeam = async () => {
    try {
      const data = await getTeam(id);
      setTeam(data.team);
    } catch {
      setError('Nu s-a putut incarca echipa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await addProjectToTeam(id, title, description);
      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut adauga proiectul');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="loading">Se incarca echipa...</div>;
  }

  if (!team) {
    return <div className="error-message">Echipa nu a fost gasita</div>;
  }

  return (
    <div className="team-details">
      <div className="team-header">
        <div className="team-header-info">
          <Link to="/teams" className="back-link">← Inapoi la echipe</Link>
          <h1>
            {team.name}
            {isOwner && <span className="owner-badge">Owner</span>}
          </h1>
          <p className="team-description">{team.description}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="team-section">
        <div className="section-header">
          <h2>Proiecte</h2>
          {isOwner && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? 'Anuleaza' : 'Adauga Proiect'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="create-form-container">
            <form onSubmit={handleAddProject} className="create-form">
              <div className="form-group">
                <label htmlFor="proj-title">Titlu Proiect</label>
                <input
                  type="text"
                  id="proj-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Aplicatie Web"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="proj-description">Descriere</label>
                <textarea
                  id="proj-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrierea proiectului..."
                  required
                  rows={3}
                />
              </div>
              <button type="submit" disabled={creating} className="btn btn-primary">
                {creating ? 'Se adauga...' : 'Adauga Proiect'}
              </button>
            </form>
          </div>
        )}

        <div className="projects-grid">
          {team.projects?.length === 0 ? (
            <p className="no-data">
              {isOwner 
                ? 'Nu exista proiecte inca. Adauga primul proiect!' 
                : 'Nu exista proiecte inca.'}
            </p>
          ) : (
            team.projects?.map((project) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.id}`} 
                className="card project-card"
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="team-section">
        <h2>Membri ({(team.members?.length || 0) + 1})</h2>
        <div className="members-list">
          <div className="member-item">
            <span className="member-name">{team.owner?.name || 'Owner'}</span>
            <span className="member-role">Owner</span>
          </div>
          {team.members?.map((member) => (
            <div key={member.id} className="member-item">
              <span className="member-name">{member.name}</span>
              <span className="member-role">Membru</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamDetails;
