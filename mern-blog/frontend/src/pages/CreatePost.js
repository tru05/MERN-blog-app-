import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Alert from '../components/layout/Alert';

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', body: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return setError('File must be under 5MB');
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('body', form.body);
      if (image) formData.append('image', image);
      const res = await API.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h2 className="fw-bold mb-4">Create New Post</h2>
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <Alert message={error} onClose={() => setError('')} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input type="text" className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required maxLength="200" placeholder="Post title..." />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Content</label>
                <textarea className="form-control" rows="10" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required placeholder="Write your post here..."></textarea>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Cover Image <span className="text-muted fw-normal">(optional, max 5MB)</span></label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                {preview && <img src={preview} className="img-fluid rounded mt-2" style={{ maxHeight: 200 }} alt="preview" />}
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Publishing...' : 'Publish Post'}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/posts')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
