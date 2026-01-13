import { Link } from 'react-router-dom';

function ProjectCard({ project }) {
  return (
    <div className="card project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="card-footer">
        <Link to={`/projects/${project.id}`} className="btn btn-primary">
          Vezi Detalii
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
