import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeam, addProjectToTeam, addTeamMember, removeTeamMember, getAvailableStudents } from '../api/teams';
import { useAuth } from '../store/authStore.jsx';

function TeamDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Project form state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);

  // Member management state
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

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

  const fetchAvailableStudents = async () => {
    setLoadingStudents(true);
    try {
      const data = await getAvailableStudents(id);
      setAvailableStudents(data.students || []);
    } catch {
      setError('Nu s-au putut incarca studentii disponibili');
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  useEffect(() => {
    if (showMemberForm && isOwner) {
      fetchAvailableStudents();
    }
  }, [showMemberForm, isOwner, id]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    setCreatingProject(true);
    setError('');

    try {
      await addProjectToTeam(id, projectTitle, projectDescription);
      setProjectTitle('');
      setProjectDescription('');
      setShowProjectForm(false);
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut adauga proiectul');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    
    setAddingMember(true);
    setError('');

    try {
      await addTeamMember(id, selectedStudentId);
      setSelectedStudentId('');
      setShowMemberForm(false);
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut adauga membrul');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Esti sigur ca vrei sa stergi acest membru?')) return;
    
    try {
      await removeTeamMember(id, memberId);
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut sterge membrul');
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

      {/* Projects Section */}
      <div className="team-section">
        <div className="section-header">
          <h2>Proiecte</h2>
          {isOwner && (
            <button onClick={() => setShowProjectForm(!showProjectForm)} className="btn btn-primary">
              {showProjectForm ? 'Anuleaza' : 'Adauga Proiect'}
            </button>
          )}
        </div>

        {showProjectForm && (
          <div className="create-form-container">
            <form onSubmit={handleAddProject} className="create-form">
              <div className="form-group">
                <label htmlFor="proj-title">Titlu Proiect</label>
                <input
                  type="text"
                  id="proj-title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="ex: Aplicatie Web"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="proj-description">Descriere</label>
                <textarea
                  id="proj-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Descrierea proiectului..."
                  required
                  rows={3}
                />
              </div>
              <button type="submit" disabled={creatingProject} className="btn btn-primary">
                {creatingProject ? 'Se adauga...' : 'Adauga Proiect'}
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

      {/* Members Section */}
      <div className="team-section">
        <div className="section-header">
          <h2>Membri ({(team.members?.length || 0) + 1})</h2>
          {isOwner && (
            <button onClick={() => setShowMemberForm(!showMemberForm)} className="btn btn-secondary">
              {showMemberForm ? 'Anuleaza' : 'Adauga Membru'}
            </button>
          )}
        </div>

        {showMemberForm && isOwner && (
          <div className="create-form-container">
            <form onSubmit={handleAddMember} className="create-form">
              <div className="form-group">
                <label htmlFor="student-select">Selecteaza Student</label>
                {loadingStudents ? (
                  <p>Se incarca studentii...</p>
                ) : availableStudents.length === 0 ? (
                  <p className="no-data">Nu exista studenti disponibili de adaugat.</p>
                ) : (
                  <select
                    id="student-select"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                  >
                    <option value="">-- Alege un student --</option>
                    {availableStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button 
                type="submit" 
                disabled={addingMember || !selectedStudentId} 
                className="btn btn-primary"
              >
                {addingMember ? 'Se adauga...' : 'Adauga Membru'}
              </button>
            </form>
          </div>
        )}

        <div className="members-list">
          <div className="member-item">
            <span className="member-name">{team.owner?.name || 'Owner'}</span>
            <span className="member-role owner">Owner</span>
          </div>
          {team.members?.map((member) => (
            <div key={member.id} className="member-item">
              <div className="member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-email">{member.email}</span>
              </div>
              <div className="member-actions">
                <span className="member-role">Membru</span>
                {isOwner && (
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="btn btn-small btn-danger"
                    title="Sterge membru"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamDetails;
