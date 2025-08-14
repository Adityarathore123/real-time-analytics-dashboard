import { useUserStore } from "../../store/userStore";
import { useTodoStore } from "../../store/todoStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import "./charts.css";

export default function Charts() {
  const allTodos = useTodoStore((state) => state.allTodos);
  const user = useUserStore((state) => state.currentUser);

  const userTodos = user
    ? allTodos.filter((todo) => todo.userId === user.email)
    : [];

  const data = [
    { name: "Total", value: userTodos.length },
    { name: "Completed", value: userTodos.filter((t) => t.completed).length },
    { name: "Pending", value: userTodos.filter((t) => !t.completed).length },
  ];

  return (
    <>
      {/* Bar Chart */}
      <div className="chart-card">
        <h4 className="chart-title">📊 Bar Chart</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3498db" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="chart-card">
        <h4 className="chart-title">📈 Line Chart</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
