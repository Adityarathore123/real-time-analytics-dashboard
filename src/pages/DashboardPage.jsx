import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import TodoList from '../components/todo/TodoList';
import Charts from '../components/charts/Charts';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const user = useUserStore((s) => s.currentUser);
  const logout = useUserStore((s) => s.logout);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <nav className="navbar">
        <div className="title">📊 Real-Time Dashboard</div>
        <div className="actions">
          <button
            className="theme-toggle-button"
            onClick={() =>
              setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
            }
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard">
        <h2>Hello, {user?.email}</h2>

        <div className="main-content">
          {/* Left side - Todo List */}
          <div className="todo-section">
            <TodoList />
          </div>

          {/* Right side - Charts Row */}
          <div className="chart-section charts-row">
            <Charts />
          </div>
        </div>
      </div>
    </>
  );
}
