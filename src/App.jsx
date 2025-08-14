import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import DashboardPage from './pages/DashboardPage';
import { useUserStore } from './store/userStore';

function App() {
  const user = useUserStore((s) => s.currentUser);

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;







