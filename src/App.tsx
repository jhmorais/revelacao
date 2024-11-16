import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { Home } from './pages/Home';
import { Vote } from './pages/Vote';

import './styles/global.scss';
import { Register } from './pages/Register';
import { UpdateProfile } from './pages/UpdateProfile';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}