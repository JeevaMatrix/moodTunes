import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Log from './pages/Log';
// import Navbar from './pages/Navbar';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if(user) setUser(user);
  }, []);



  return (
    <>
      {/* <Navbar user={user} onLogout={handleLogout} /> */}
      <Routes>
        <Route
          path="/"
          element={user ? <Home user={user} setUser={setUser}/> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/logs" element={<Log />} />
      </Routes>
    </>
  );
}

export default App;
