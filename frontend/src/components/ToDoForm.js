import { useState } from "react";

// Helper: format today's datetime as the min value for the deadline picker
const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};

const PRIORITY_OPTIONS = ["low", "medium", "high"];

function ToDoForm({ onAdd, categories }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("medium");
    const [categoryId, setCategoryId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({
            title,
            description,
            done: false,
            deadline: deadline || null,
            priority,
            category_id: categoryId ? Number(categoryId) : null,
        });
        // Reset
        setTitle(""); setDescription(""); setDeadline("");
        setPriority("medium"); setCategoryId("");
    };

    return (
        <div className="tk-form">
            <h4>Add New Task</h4>

            {/* Row 1: title + description */}
            <div className="tk-form-row">
                <input
                    className="tk-input"
                    placeholder="Task title *"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <input
                    className="tk-input"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            {/* Row 2: deadline + priority + category */}
            <div className="tk-form-row">
                {/* Deadline — datetime-local gives a native date+time picker */}
                <input
                    className="tk-input"
                    type="datetime-local"
                    min={nowLocal()}
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    title="Deadline (optional)"
                />

                {/* Priority */}
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

                {/* Category — populated from the categories prop */}
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

            <button className="tk-btn tk-btn-primary" onClick={handleSubmit}
                style={{ width: "auto" }}>
                Add Task
            </button>
        </div>
    );
}

export default ToDoForm;