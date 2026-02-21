import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/profile').then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete your account? This cannot be undone.')) return;
    await API.delete('/profile');
    logout();
    navigate('/register');
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    await API.delete(`/posts/${postId}`);
    setData(prev => ({ ...prev, posts: prev.posts.filter(p => p._id !== postId) }));
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card border-0 shadow-sm rounded-4 text-center p-4 mb-4">
          {user?.avatar ? (
            <img src={`http://localhost:5000${user.avatar}`} className="rounded-circle mx-auto mb-3" width="120" height="120" style={{ objectFit: 'cover' }} alt="avatar" />
          ) : (
            <div className="avatar-placeholder rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-primary text-white fs-1" style={{ width: 120, height: 120 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h4 className="fw-bold">{user?.name}</h4>
          <p className="text-muted">{user?.email}</p>
          <p>{user?.bio || 'No bio added yet.'}</p>
          <div className="d-grid gap-2">
            <Link to="/profile/edit" className="btn btn-outline-primary">Edit Profile</Link>
            <button onClick={handleDeleteAccount} className="btn btn-outline-danger">Delete Account</button>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <h4 className="fw-bold mb-3">My Posts ({data?.posts?.length || 0})</h4>
        {data?.posts?.length === 0 && (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-journal fs-1"></i>
            <p className="mt-2">You haven't written any posts yet.</p>
            <Link to="/posts/create" className="btn btn-primary">Write First Post</Link>
          </div>
        )}
        {data?.posts?.map(post => (
          <div key={post._id} className="card border-0 shadow-sm rounded-3 mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-1">{post.title}</h6>
                <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()} · {post.comments.length} comments</small>
              </div>
              <div className="d-flex gap-2">
                <Link to={`/posts/${post._id}`} className="btn btn-sm btn-outline-secondary">View</Link>
                <Link to={`/posts/${post._id}/edit`} className="btn btn-sm btn-outline-primary">Edit</Link>
                <button onClick={() => handleDeletePost(post._id)} className="btn btn-sm btn-outline-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
