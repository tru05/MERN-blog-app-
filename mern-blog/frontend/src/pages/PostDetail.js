import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/layout/Alert';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/posts/${id}`).then(res => setPost(res.data)).catch(() => navigate('/posts')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await API.delete(`/posts/${id}`);
    navigate('/posts');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/posts/${id}/comments`, { text: commentText });
      setPost(res.data);
      setCommentText('');
    } catch { setError('Failed to add comment'); }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const res = await API.put(`/posts/${id}/comments/${commentId}`, { text: editText });
      setPost(res.data);
      setEditingComment(null);
    } catch { setError('Failed to update comment'); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete comment?')) return;
    const res = await API.delete(`/posts/${id}/comments/${commentId}`);
    setPost(res.data);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (!post) return null;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <Alert message={error} onClose={() => setError('')} />

        <article className="card border-0 shadow-sm rounded-4 mb-4">
          {post.image && <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${post.image}`} className="card-img-top rounded-top-4" alt="post" style={{ maxHeight: 400, objectFit: 'cover' }} />}
          <div className="card-body p-4 p-lg-5">
            <h1 className="fw-bold">{post.title}</h1>
            <div className="d-flex align-items-center text-muted mb-4">
              <i className="bi bi-person-circle me-2"></i>
              <span>{post.authorName}</span>
              <span className="mx-2">·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{post.body}</div>

            {user && user._id === post.author && (
              <div className="mt-4 d-flex gap-2">
                <Link to={`/posts/${post._id}/edit`} className="btn btn-outline-primary"><i className="bi bi-pencil me-1"></i>Edit</Link>
                <button onClick={handleDelete} className="btn btn-outline-danger"><i className="bi bi-trash me-1"></i>Delete</button>
              </div>
            )}
          </div>
        </article>

        {/* Comments */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h4 className="fw-bold mb-4"><i className="bi bi-chat-dots me-2"></i>Comments ({post.comments.length})</h4>

            {user ? (
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="d-flex gap-2">
                  <textarea className="form-control" rows="2" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." required></textarea>
                  <button className="btn btn-primary px-4">Post</button>
                </div>
              </form>
            ) : (
              <p className="text-muted"><Link to="/login">Login</Link> to leave a comment.</p>
            )}

            {post.comments.length === 0 && <p className="text-muted">No comments yet. Be the first!</p>}

            {post.comments.map(comment => (
              <div key={comment._id} className="border-bottom pb-3 mb-3">
                {editingComment === comment._id ? (
                  <div className="d-flex gap-2">
                    <textarea className="form-control" rows="2" value={editText} onChange={e => setEditText(e.target.value)}></textarea>
                    <div className="d-flex flex-column gap-1">
                      <button className="btn btn-sm btn-primary" onClick={() => handleUpdateComment(comment._id)}>Save</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingComment(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{comment.authorName}</strong>
                      <small className="text-muted ms-2">{new Date(comment.createdAt).toLocaleDateString()}</small>
                      <p className="mb-0 mt-1">{comment.text}</p>
                    </div>
                    {user && user._id === comment.author && (
                      <div className="d-flex gap-2 ms-3 flex-shrink-0">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditingComment(comment._id); setEditText(comment.text); }}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(comment._id)}><i className="bi bi-trash"></i></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Link to="/posts" className="btn btn-outline-secondary"><i className="bi bi-arrow-left me-1"></i>Back to Posts</Link>
      </div>
    </div>
  );
}
