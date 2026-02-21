import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/posts').then(res => setPosts(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">All Posts</h2>
        {user && <Link to="/posts/create" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>New Post</Link>}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-journal-x fs-1 text-muted"></i>
          <h4 className="mt-3 text-muted">No posts yet. Be the first!</h4>
          {user && <Link to="/posts/create" className="btn btn-primary mt-3">Create Post</Link>}
        </div>
      ) : (
        <div className="row g-4">
          {posts.map(post => (
            <div key={post._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 post-card">
                {post.image ? (
                  <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${post.image}`}className="card-img-top rounded-top-4" alt="post" style={{ height: 200, objectFit: 'cover' }} />
                ) : (
                  <div className="card-img-placeholder rounded-top-4 d-flex align-items-center justify-content-center bg-light" style={{ height: 200 }}>
                    <i className="bi bi-image text-muted fs-1"></i>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title fw-bold">{post.title}</h5>
                  <p className="card-text text-muted">{post.body.substring(0, 120)}...</p>
                </div>
                <div className="card-footer border-0 bg-transparent d-flex justify-content-between align-items-center">
                  <small className="text-muted"><i className="bi bi-person me-1"></i>{post.authorName}</small>
                  <Link to={`/posts/${post._id}`} className="btn btn-sm btn-outline-primary">Read More</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
