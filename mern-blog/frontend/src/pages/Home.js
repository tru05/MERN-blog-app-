import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div className="text-center py-5 hero-section">
        <h1 className="display-3 fw-bold">Welcome to <span className="text-primary">BlogApp</span></h1>
        <p className="lead text-muted mt-3 mb-4">Share your ideas, stories and thoughts with the world.</p>
        {user ? (
          <>
            <Link to="/posts/create" className="btn btn-primary btn-lg me-3">Write a Post</Link>
            <Link to="/posts" className="btn btn-outline-secondary btn-lg">Browse Posts</Link>
          </>
        ) : (
          <>
            <Link to="/register" className="btn btn-primary btn-lg me-3">Get Started</Link>
            <Link to="/posts" className="btn btn-outline-secondary btn-lg">Browse Posts</Link>
          </>
        )}
      </div>

      <div className="row mt-5 g-4 text-center">
        {[
          { icon: 'bi-pencil-fill', color: 'text-primary', title: 'Create Posts', desc: 'Write and publish blog posts with image support.' },
          { icon: 'bi-chat-dots-fill', color: 'text-success', title: 'Comments', desc: 'Engage with posts through comments.' },
          { icon: 'bi-shield-lock-fill', color: 'text-warning', title: 'Secure Auth', desc: 'JWT-based authentication with bcrypt hashing.' },
        ].map((f) => (
          <div key={f.title} className="col-md-4">
            <div className="feature-card p-4 rounded-4 shadow-sm h-100">
              <i className={`bi ${f.icon} ${f.color} fs-1`}></i>
              <h4 className="mt-3">{f.title}</h4>
              <p className="text-muted">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
