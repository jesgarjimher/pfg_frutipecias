import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Productos from './components/Productos';
import Home from './components/Home';
import TablaAdmin from './components/TablaAdmin';
import FormEdit from './components/FormEdit';
import AltaProducto from './components/AltaProducto';
import NavBar from './components/common/NavBar';
import Login from './components/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useState } from 'react';
import AboutUs from './components/AboutUs';


function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isAdmin = user && user.role === 'admin';
  return (
      <Router>
        <NavBar user={user} setUser={setUser}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos/:categoria" element={<Productos />} />
          <Route path="/productos" element={<Productos />} />

          <Route element={<ProtectedRoute isAdmin={isAdmin} />}>
            <Route path="/tabla-admin" element={<TablaAdmin />} />
            <Route path="/form-edit/:id" element={<FormEdit />} />
            <Route path="/alta-producto" element={<AltaProducto />} />
          </Route>
          <Route path="/login" element={<Login setUser={setUser}/>} />

          <Route path="/sobre-nosotros" element={<AboutUs />} />
        </Routes>
      </Router>
  );
}

export default App;
