import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useTodoStore } from '../../store/todoStore';
import { Trash2, Pencil, CheckCircle, PauseCircle, PlayCircle, Timer } from 'lucide-react';

export default function TodoList() {
  const user = useUserStore((s) => s.currentUser);
  const {
    addTodo,
    deleteTodo,
    toggleTodo,
    getUserTodos,
    setAllTodos,
    toggleTimerState,
    decrementTimer,
    allTodos
  } = useTodoStore();

  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (user) {
      setTodos(getUserTodos());
    }
  }, [user, allTodos]);

  useEffect(() => {
    const interval = setInterval(() => {
      allTodos.forEach((todo) => {
        if (todo.timer?.isRunning && todo.timer.seconds > 0) {
          decrementTimer(todo.id);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [allTodos, decrementTimer]);

  const handleAdd = () => {
    if (title.trim() === '') return;
    addTodo(title);
    setTitle('');
  };

  const handleTimerChange = (id, value) => {
    const updated = allTodos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            timer: {
              ...todo.timer,
              minutes: parseInt(value) || 0,
              seconds: (parseInt(value) || 0) * 60,
            },
          }
        : todo
    );
    setAllTodos(updated);
  };

  const finishEdit = (id) => {
    const updated = allTodos.map((todo) =>
      todo.id === id ? { ...todo, title: editText } : todo
    );
    setAllTodos(updated);
    setEditId(null);
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-wrapper">
      <div className="todo-input-wrapper">
        <input
          type="text"
          placeholder="Enter a task"
          className="todo-input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleAdd} className="add-todo-button">Add</button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />

            {editId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && finishEdit(todo.id)}
                />
                <CheckCircle onClick={() => finishEdit(todo.id)} className="cursor-pointer text-green-600" />
              </>
            ) : (
              <>
                <span className={`${todo.completed ? 'line-through' : ''}`}>{todo.title}</span>
                <Pencil onClick={() => { setEditId(todo.id); setEditText(todo.title); }} className="cursor-pointer text-yellow-500" />
                <Trash2 onClick={() => deleteTodo(todo.id)} className="cursor-pointer text-red-600" />
              </>
            )}

            {!todo.completed && (
              <>
                <input
                  type="number"
                  min="1"
                  placeholder="min"
                  onChange={(e) => handleTimerChange(todo.id, e.target.value)}
                />
                {todo.timer?.isRunning ? (
                  <PauseCircle onClick={() => toggleTimerState(todo.id)} className="cursor-pointer text-blue-500" />
                ) : (
                  <PlayCircle onClick={() => toggleTimerState(todo.id)} className="cursor-pointer text-blue-500" />
                )}
              </>
            )}

            {!todo.completed && todo.timer?.seconds > 0 && (
              <span className="timer">
                <Timer size={18} /> {formatTime(todo.timer.seconds)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
