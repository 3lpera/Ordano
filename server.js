import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Data directory
const DATA_DIR = path.join(__dirname, 'data');
const FILES = {
    groups: path.join(DATA_DIR, 'groups.json'),
    todos: path.join(DATA_DIR, 'todos.json'),
    classes: path.join(DATA_DIR, 'classes.json'),
    exams: path.join(DATA_DIR, 'exams.json'),
};

// Initialize data directory and files
async function initializeData() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        for (const [key, filepath] of Object.entries(FILES)) {
            try {
                await fs.access(filepath);
            } catch {
                await fs.writeFile(filepath, JSON.stringify([], null, 2));
                console.log(`Created ${key}.json`);
            }
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Helper functions for file operations
async function readData(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

async function writeData(file, data) {
    try {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing file:', error);
        throw error;
    }
}

// ===================================
// STUDY GROUPS API
// ===================================

// Get all groups
app.get('/api/groups', async (req, res) => {
    try {
        const groups = await readData(FILES.groups);
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups' });
    }
});

// Get single group
app.get('/api/groups/:id', async (req, res) => {
    try {
        const groups = await readData(FILES.groups);
        const group = groups.find(g => g.id === req.params.id);
        
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group' });
    }
});

// Create group
app.post('/api/groups', async (req, res) => {
    try {
        const { name, description, members } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        
        const groups = await readData(FILES.groups);
        const newGroup = {
            id: randomUUID(),
            name,
            description: description || '',
            members: members || [],
        };
        
        groups.push(newGroup);
        await writeData(FILES.groups, groups);
        
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group' });
    }
});

// Update group
app.put('/api/groups/:id', async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const groups = await readData(FILES.groups);
        const index = groups.findIndex(g => g.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        groups[index] = {
            ...groups[index],
            name: name !== undefined ? name : groups[index].name,
            description: description !== undefined ? description : groups[index].description,
            members: members !== undefined ? members : groups[index].members,
        };
        
        await writeData(FILES.groups, groups);
        res.json(groups[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating group' });
    }
});

// Delete group
app.delete('/api/groups/:id', async (req, res) => {
    try {
        const groups = await readData(FILES.groups);
        const filtered = groups.filter(g => g.id !== req.params.id);
        
        if (filtered.length === groups.length) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        await writeData(FILES.groups, filtered);
        res.json({ message: 'Group deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting group' });
    }
});

// ===================================
// TO-DOS API
// ===================================

// Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await readData(FILES.todos);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

// Get single todo
app.get('/api/todos/:id', async (req, res) => {
    try {
        const todos = await readData(FILES.todos);
        const todo = todos.find(t => t.id === req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todo' });
    }
});

// Create todo
app.post('/api/todos', async (req, res) => {
    try {
        const { title, description, dueDate, assignedTo } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        
        const todos = await readData(FILES.todos);
        const newTodo = {
            id: randomUUID(),
            title,
            description: description || '',
            dueDate: dueDate || null,
            assignedTo: assignedTo || null,
            completed: false,
        };
        
        todos.push(newTodo);
        await writeData(FILES.todos, todos);
        
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo' });
    }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { title, description, dueDate, assignedTo, completed } = req.body;
        const todos = await readData(FILES.todos);
        const index = todos.findIndex(t => t.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        todos[index] = {
            ...todos[index],
            title: title !== undefined ? title : todos[index].title,
            description: description !== undefined ? description : todos[index].description,
            dueDate: dueDate !== undefined ? dueDate : todos[index].dueDate,
            assignedTo: assignedTo !== undefined ? assignedTo : todos[index].assignedTo,
            completed: completed !== undefined ? completed : todos[index].completed,
        };
        
        await writeData(FILES.todos, todos);
        res.json(todos[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
});

// Toggle todo completion
app.patch('/api/todos/:id/toggle', async (req, res) => {
    try {
        const todos = await readData(FILES.todos);
        const index = todos.findIndex(t => t.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        todos[index].completed = !todos[index].completed;
        await writeData(FILES.todos, todos);
        
        res.json(todos[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling todo' });
    }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todos = await readData(FILES.todos);
        const filtered = todos.filter(t => t.id !== req.params.id);
        
        if (filtered.length === todos.length) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        await writeData(FILES.todos, filtered);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

// ===================================
// CLASSES API
// ===================================

// Get all classes
app.get('/api/classes', async (req, res) => {
    try {
        const classes = await readData(FILES.classes);
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});

// Get single class
app.get('/api/classes/:id', async (req, res) => {
    try {
        const classes = await readData(FILES.classes);
        const cls = classes.find(c => c.id === req.params.id);
        
        if (!cls) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
        res.json(cls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching class' });
    }
});

// Create class
app.post('/api/classes', async (req, res) => {
    try {
        const { name, code, instructor, schedule } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        
        const classes = await readData(FILES.classes);
        const newClass = {
            id: randomUUID(),
            name,
            code: code || '',
            instructor: instructor || '',
            schedule: schedule || '',
        };
        
        classes.push(newClass);
        await writeData(FILES.classes, classes);
        
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Error creating class' });
    }
});

// Update class
app.put('/api/classes/:id', async (req, res) => {
    try {
        const { name, code, instructor, schedule } = req.body;
        const classes = await readData(FILES.classes);
        const index = classes.findIndex(c => c.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
        classes[index] = {
            ...classes[index],
            name: name !== undefined ? name : classes[index].name,
            code: code !== undefined ? code : classes[index].code,
            instructor: instructor !== undefined ? instructor : classes[index].instructor,
            schedule: schedule !== undefined ? schedule : classes[index].schedule,
        };
        
        await writeData(FILES.classes, classes);
        res.json(classes[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating class' });
    }
});

// Delete class
app.delete('/api/classes/:id', async (req, res) => {
    try {
        const classes = await readData(FILES.classes);
        const filtered = classes.filter(c => c.id !== req.params.id);
        
        if (filtered.length === classes.length) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
        await writeData(FILES.classes, filtered);
        res.json({ message: 'Class deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting class' });
    }
});

// ===================================
// EXAMS API
// ===================================

// Get all exams
app.get('/api/exams', async (req, res) => {
    try {
        const exams = await readData(FILES.exams);
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exams' });
    }
});

// Get single exam
app.get('/api/exams/:id', async (req, res) => {
    try {
        const exams = await readData(FILES.exams);
        const exam = exams.find(e => e.id === req.params.id);
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exam' });
    }
});

// Create exam
app.post('/api/exams', async (req, res) => {
    try {
        const { classId, type, date, time, location } = req.body;
        
        if (!classId || !type || !date) {
            return res.status(400).json({ message: 'Class, type, and date are required' });
        }
        
        const exams = await readData(FILES.exams);
        const newExam = {
            id: randomUUID(),
            classId,
            type,
            date,
            time: time || '',
            location: location || '',
        };
        
        exams.push(newExam);
        await writeData(FILES.exams, exams);
        
        res.status(201).json(newExam);
    } catch (error) {
        res.status(500).json({ message: 'Error creating exam' });
    }
});

// Update exam
app.put('/api/exams/:id', async (req, res) => {
    try {
        const { classId, type, date, time, location } = req.body;
        const exams = await readData(FILES.exams);
        const index = exams.findIndex(e => e.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        
        exams[index] = {
            ...exams[index],
            classId: classId !== undefined ? classId : exams[index].classId,
            type: type !== undefined ? type : exams[index].type,
            date: date !== undefined ? date : exams[index].date,
            time: time !== undefined ? time : exams[index].time,
            location: location !== undefined ? location : exams[index].location,
        };
        
        await writeData(FILES.exams, exams);
        res.json(exams[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating exam' });
    }
});

// Delete exam
app.delete('/api/exams/:id', async (req, res) => {
    try {
        const exams = await readData(FILES.exams);
        const filtered = exams.filter(e => e.id !== req.params.id);
        
        if (filtered.length === exams.length) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        
        await writeData(FILES.exams, filtered);
        res.json({ message: 'Exam deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exam' });
    }
});

// Start server
async function startServer() {
    await initializeData();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`
╔════════════════════════════════════════╗
║        StudySync Server Ready!         ║
╚════════════════════════════════════════╝

📚 Server running on http://0.0.0.0:${PORT}
🌐 Visit http://localhost:${PORT} in your browser

Features:
  ✓ Study Groups Management
  ✓ To-Do Lists with Assignments
  ✓ Class Scheduling
  ✓ Exam Tracking
  
Data Storage: JSON files in ./data/
        `);
    });
}

startServer();
