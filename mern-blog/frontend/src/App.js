import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4 mb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/posts/:id/edit" element={<PrivateRoute><EditPost /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          </Routes>
        </div>
        <footer className="bg-dark text-white text-center py-4">
          <p className="mb-0">&copy; {new Date().getFullYear()} BlogApp · Built with MERN Stack</p>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
