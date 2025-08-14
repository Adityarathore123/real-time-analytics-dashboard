import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../../store/userStore';
import "./login.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);
  const currentUser = useUserStore((s) => s.currentUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);

    const updatedUser = useUserStore.getState().currentUser;

    if (updatedUser) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
