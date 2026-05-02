import { useState } from "react";

const PRIORITY_OPTIONS = ["low", "medium", "high"];

// Format a stored ISO datetime back to the value datetime-local expects
const toLocalInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};

function ToDoEdit({ todo, categories, onUpdate, onCancel }) {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description || "");
    const [done, setDone] = useState(todo.done);
    const [deadline, setDeadline] = useState(toLocalInput(todo.deadline));
    const [priority, setPriority] = useState(todo.priority || "medium");
    const [categoryId, setCategoryId] = useState(todo.category_id || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({
            ...todo,
            title,
            description,
            done,
            deadline: deadline || null,
            priority,
            category_id: categoryId ? Number(categoryId) : null,
        });
    };

    return (
        <div style={{ padding: "0.5rem 0" }}>
            <h5 style={{ marginBottom: "0.75rem", color: "var(--text)" }}>Edit Task</h5>

            {/* Row 1: title + description */}
            <div className="tk-form-row">
                <input
                    className="tk-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <input
                    className="tk-input"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                />
            </div>

            {/* Row 2: deadline + priority + category */}
            <div className="tk-form-row">
                <input
                    className="tk-input"
                    type="datetime-local"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    title="Deadline"
                />
                <select
                    className="tk-select"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                >
                    {PRIORITY_OPTIONS.map(p => (
                        <option key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)} priority
                        </option>
                    ))}
                </select>
                <select
                    className="tk-select"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                >
                    <option value="">No category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Done toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "var(--text)", cursor: "pointer" }}>
                <input
                    type="checkbox"
                    checked={done}
                    onChange={e => setDone(e.target.checked)}
                />
                Mark as completed
            </label>

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="tk-btn tk-btn-primary" style={{ width: "auto" }} onClick={handleSubmit}>
                    Update
                </button>
                <button className="tk-btn tk-btn-outline tk-btn-sm" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default ToDoEdit;