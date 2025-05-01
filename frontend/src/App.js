// src/App.js
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/main.css';

function App() {
  const { isLoggedIn, isAdmin, loading } = useContext(AuthContext);
  
  // Optional: show loading state while checking authentication
  if (loading) {
    return <div className="container page-content">Loading application...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin route - protected by admin check in the component */}
        <Route 
          path="/admin" 
          element={
            <Admin />
          } 
        />
      </Routes>
    </>
  );
}

export default App;
