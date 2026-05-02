import { useState, useEffect } from "react";
import axios from "axios";
import ToDoEdit from "./ToDoEdit";

const API = "http://localhost:8000/todos";

// ── Axios instance that automatically attaches the JWT token ─────────────────
const api = axios.create({ baseURL: API });
api.interceptors.request.use(cfg => {
    const token = localStorage.getItem("tk-token");  // still works as fallback
    if (token) cfg.params = { ...cfg.params, token };
    return cfg;
});
// ─────────────────────────────────────────────────────────────────────────────

const PRIORITY_COLORS = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444" };

// ── Deadline badge: turns red when past due ──────────────────────────────────
function DeadlineBadge({ deadline }) {
    if (!deadline) return null;
    const d = new Date(deadline);
    const isOverdue = d < new Date();
    return (
        <span className={`tk-deadline ${isOverdue ? "overdue" : "ok"}`}>
            {isOverdue ? "⚠ Overdue" : `⏰ ${d.toLocaleDateString()}`}
        </span>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

function ToDoList() {
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [error, setError] = useState("");

    // ── Load todos + categories on mount ───────────────────────────────────────
    useEffect(() => {
        api.get("/").then(r => setTodos(r.data)).catch(() => setError("Failed to load tasks"));
        api.get("/categories").then(r => setCategories(r.data));
    }, []);

    // ── CRUD handlers ──────────────────────────────────────────────────────────
    const addTodo = async (data) => {
        try {
            const res = await api.post("/", data);
            setTodos(prev => [...prev, res.data]);
        } catch { setError("Could not add task"); }
    };

    const deleteTodo = async (id) => {
        await api.delete(`/${id}`);
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const updateTodo = async (updated) => {
        const res = await api.put(`/${updated.id}`, updated);
        setTodos(prev => prev.map(t => t.id === updated.id ? res.data : t));
        setEditingTodo(null);
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    // Import ToDoForm here to keep categories flowing down as a prop
    const ToDoForm = require("./ToDoForm").default;

    return (
        <div>
            <ToDoForm onAdd={addTodo} categories={categories} />

            {error && <p className="tk-error">{error}</p>}

            <h4 className="my-3" style={{ marginBottom: "1rem", color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Your Tasks ({todos.length})
            </h4>

            {todos.length === 0 && (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
                    No tasks yet — add one above!
                </p>
            )}

            {todos.map(todo => {
                const cat = categories.find(c => c.id === todo.category_id);

                return (
                    <div
                        key={todo.id}
                        className={`tk-card ${todo.done ? "done" : ""}`}
                    >
                        {editingTodo?.id === todo.id ? (
                            <ToDoEdit
                                todo={editingTodo}
                                categories={categories}
                                onUpdate={updateTodo}
                                onCancel={() => setEditingTodo(null)}
                            />
                        ) : (
                            /* ── Task row ── */
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                {/* Priority dot */}
                                <span
                                    className="tk-priority-dot"
                                    style={{ background: PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS.medium }}
                                    title={`${todo.priority} priority`}
                                />

                                {/* Title + description */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 500,
                                        textDecoration: todo.done ? "line-through" : "none",
                                        color: "var(--text)",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                    }}>
                                        {todo.title}
                                    </div>
                                    {todo.description && (
                                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                            {todo.description}
                                        </div>
                                    )}
                                </div>

                                {/* Category badge — color comes from the category object */}
                                {cat && (
                                    <span
                                        className="tk-cat-badge"
                                        style={{
                                            background: cat.color + "22",
                                            color: cat.color,
                                            borderColor: cat.color + "55",
                                        }}
                                    >
                                        {cat.name}
                                    </span>
                                )}

                                {/* Deadline badge */}
                                <DeadlineBadge deadline={todo.deadline} />

                                {/* Done badge */}
                                {todo.done && (
                                    <span className="tk-deadline ok">Done</span>
                                )}

                                {/* Action buttons */}
                                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                                    <button
                                        className="tk-btn tk-btn-sm tk-btn-outline"
                                        onClick={() => setEditingTodo(todo)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="tk-btn tk-btn-sm tk-btn-danger"
                                        onClick={() => deleteTodo(todo.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default ToDoList;