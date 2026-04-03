import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Productos from './components/Productos';
import Home from './components/Home';
import TablaAdmin from './components/TablaAdmin';
import FormEdit from './components/FormEdit';
import AltaProducto from './components/AltaProducto';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos/:categoria" element={<Productos />} />

          <Route path="/tabla-admin" element={<TablaAdmin />} />
          <Route path="/form-edit/:id" element={<FormEdit />} />
          <Route path="/alta-producto" element={<AltaProducto />} />
        </Routes>
      </Router>
  );
}

export default App;
