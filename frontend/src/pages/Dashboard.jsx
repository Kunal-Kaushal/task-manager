import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../api';

const STAGES = [
  { key: 'todo', label: 'Todo', color: 'bg-yellow-950/50 border-yellow-800' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-blue-950/50 border-blue-800' },
  { key: 'done', label: 'Done', color: 'bg-green-950/50 border-green-800' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', stage: 'todo' });
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
    } catch { setError('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTask(editingId, form);
      } else {
        await createTask(form);
      }
      setForm({ title: '', description: '', stage: 'todo' });
      setShowForm(false);
      setEditingId(null);
      fetchTasks();
    } catch { setError('Failed to save task'); }
  };

  const handleDelete = async (id) => {
    try { await deleteTask(id); fetchTasks(); }
    catch { setError('Failed to delete task'); }
  };

  const handleStageChange = async (id, stage) => {
    try { await updateTask(id, { stage }); fetchTasks(); }
    catch { setError('Failed to update task'); }
  };

  const startEdit = (task) => {
    setForm({ title: task.title, description: task.description, stage: task.stage });
    setEditingId(task.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Hi, {user?.name}</span>
            <button onClick={logout} className="text-sm text-red-400 hover:underline">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-200">Your Tasks</h2>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', description: '', stage: 'todo' }); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            + New Task
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-4 rounded mb-6 space-y-3">
            <input type="text" placeholder="Title" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Description (optional)" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}
              className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 text-sm">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STAGES.map(stage => (
              <div key={stage.key} className={`rounded-lg border p-4 ${stage.color}`}>
                <h3 className="font-semibold mb-3 text-gray-300">{stage.label} ({tasks.filter(t => t.stage === stage.key).length})</h3>
                <div className="space-y-2">
                  {tasks.filter(t => t.stage === stage.key).length === 0 && (
                    <p className="text-sm text-gray-600">No tasks</p>
                  )}
                  {tasks.filter(t => t.stage === stage.key).map(task => (
                    <div key={task.id} className="bg-gray-800 border border-gray-700 rounded p-3">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      {task.description && <p className="text-sm text-gray-400 mt-1">{task.description}</p>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <select value={task.stage} onChange={(e) => handleStageChange(task.id, e.target.value)}
                          className="text-xs bg-gray-700 border border-gray-600 text-gray-300 rounded px-2 py-1">
                          {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                        <button onClick={() => startEdit(task)} className="text-xs text-blue-400 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(task.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
