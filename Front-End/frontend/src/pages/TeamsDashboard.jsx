import { useState, useEffect } from 'react';
import { getTeams, createTeam } from '../api/teams';
import TeamCard from '../components/TeamCard';

function TeamsDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data.teams || []);
    } catch {
      setError('Nu s-au putut incarca echipele');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await createTeam(name, description);
      setName('');
      setDescription('');
      setShowForm(false);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Nu s-a putut crea echipa');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="loading">Se incarca echipele...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Echipele Mele</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Anuleaza' : 'Creeaza Echipa'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="create-form-container">
          <form onSubmit={handleCreate} className="create-form">
            <div className="form-group">
              <label htmlFor="team-name">Nume Echipa</label>
              <input
                type="text"
                id="team-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Echipa Alpha"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="team-description">Descriere</label>
              <textarea
                id="team-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrierea echipei..."
                required
                rows={3}
              />
            </div>
            <button type="submit" disabled={creating} className="btn btn-primary">
              {creating ? 'Se creeaza...' : 'Creeaza Echipa'}
            </button>
          </form>
        </div>
      )}

      <div className="teams-grid">
        {teams.length === 0 ? (
          <p className="no-data">Nu faci parte din nicio echipa. Creeaza prima ta echipa!</p>
        ) : (
          teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))
        )}
      </div>
    </div>
  );
}

export default TeamsDashboard;
