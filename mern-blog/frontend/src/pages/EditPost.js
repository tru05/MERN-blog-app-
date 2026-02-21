import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Alert from '../components/layout/Alert';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '' });
  const [currentImage, setCurrentImage] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/posts/${id}`).then(res => {
      setForm({ title: res.data.title, body: res.data.body });
      setCurrentImage(res.data.image);
    }).catch(() => navigate('/posts'));
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('body', form.body);
      if (image) formData.append('image', image);
      await API.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h2 className="fw-bold mb-4">Edit Post</h2>
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <Alert message={error} onClose={() => setError('')} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input type="text" className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Content</label>
                <textarea className="form-control" rows="10" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required></textarea>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Replace Cover Image</label>
                {currentImage && !preview && <div className="mb-2"><img src={`http://localhost:5000${currentImage}`} className="img-fluid rounded" style={{ maxHeight: 150 }} alt="current" /></div>}
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                {preview && <img src={preview} className="img-fluid rounded mt-2" style={{ maxHeight: 150 }} alt="new preview" />}
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(`/posts/${id}`)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
