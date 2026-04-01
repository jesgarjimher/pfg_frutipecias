import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Productos from './components/Productos';
import Home from './components/Home';
import TablaAdmin from './components/TablaAdmin';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos/:categoria" element={<Productos />} />

          <Route path="/tabla-admin" element={<TablaAdmin />} />
        </Routes>
      </Router>
  );
}

export default App;
