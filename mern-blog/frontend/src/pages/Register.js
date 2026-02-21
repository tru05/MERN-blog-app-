import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/layout/Alert';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5">
            <h2 className="fw-bold mb-4 text-center">Create Account</h2>
            <Alert message={error} onClose={() => setError('')} />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="password2" className="form-control" value={form.password2} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <p className="mt-3 text-center">Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
