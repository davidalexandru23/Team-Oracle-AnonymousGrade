import { Link } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';

function TeamCard({ team }) {
  const { user } = useAuth();
  const isOwner = team.ownerId === user?.id;

  return (
    <Link to={`/teams/${team.id}`} className="card team-card">
      <div className="team-card-header">
        <h3>{team.name}</h3>
        {isOwner && <span className="owner-badge">Owner</span>}
      </div>
      <p className="team-description">{team.description}</p>
      <div className="team-meta">
        <span>{team.projects?.length || 0} proiecte</span>
        <span>{(team.members?.length || 0) + 1} membri</span>
      </div>
      {!isOwner && team.owner && (
        <p className="team-owner-info">Owner: {team.owner.name}</p>
      )}
    </Link>
  );
}

export default TeamCard;
