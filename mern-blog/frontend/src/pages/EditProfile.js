import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/layout/Alert';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      if (avatar) formData.append('avatar', avatar);
      const res = await API.put('/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(res.data);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="fw-bold mb-4">Edit Profile</h2>
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <Alert message={error} onClose={() => setError('')} />
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                {preview ? (
                  <img src={preview} className="rounded-circle mb-2" width="100" height="100" style={{ objectFit: 'cover' }} alt="preview" />
                ) : user?.avatar ? (
                  <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${post.image}`} className="rounded-circle mb-2" width="100" height="100" style={{ objectFit: 'cover' }} alt="avatar" />
                ) : (
                  <div className="avatar-placeholder rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center bg-primary text-white fs-2" style={{ width: 100, height: 100 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <label className="form-label d-block">Profile Picture</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleAvatarChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Bio</label>
                <textarea className="form-control" rows="3" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell something about yourself..."></textarea>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/profile')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
