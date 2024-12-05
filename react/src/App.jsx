import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/register';
import Login from './pages/login';
import CompleteProfile from './pages/complete-profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
