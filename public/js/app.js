// Lógica principal de la aplicación
let appState = {
    groups: [],
    todos: [],
    classes: [],
    exams: [],
    currentGroup: null,
    currentTodo: null,
    currentClass: null,
    currentExam: null,
    deleteCallback: null,
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initForms();
    loadAllData();
});

// Navegación
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-container');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = item.dataset.view;
            
            // Actualizar elemento de navegación activo
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Mostrar vista correspondiente
            views.forEach(view => view.classList.remove('active'));
            document.getElementById(`${viewName}-view`).classList.add('active');
            
            // Cerrar menú móvil
            document.getElementById('sidebar').classList.remove('active');
        });
    });
    
    // Alternador de menú móvil
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('active');
    });
    
    document.getElementById('mobileMenuClose').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('active');
    });
}

// Modales
function initModals() {
    const modalCloseButtons = document.querySelectorAll('.modal-close, .btn[data-modal]');
    
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            if (modalId) {
                closeModal(modalId);
            }
        });
    });
    
    // Cerrar modal al hacer clic en el fondo
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Formularios
function initForms() {
    // Formulario de grupo
    document.getElementById('btnCreateGroup').addEventListener('click', () => {
        resetGroupForm();
        document.getElementById('groupModalTitle').textContent = 'Crear Grupo de Estudio';
        openModal('groupModal');
    });
    
    document.getElementById('btnAddMember').addEventListener('click', addMember);
    
    document.getElementById('memberInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMember();
        }
    });
    
    document.getElementById('groupForm').addEventListener('submit', handleGroupSubmit);
    
    // Formulario de tarea
    document.getElementById('btnCreateTodo').addEventListener('click', () => {
        resetTodoForm();
        document.getElementById('todoModalTitle').textContent = 'Crear Tarea';
        populateAssigneeSelect();
        openModal('todoModal');
    });
    
    document.getElementById('todoForm').addEventListener('submit', handleTodoSubmit);
    
    // Formulario de clase
    document.getElementById('btnCreateClass').addEventListener('click', () => {
        resetClassForm();
        document.getElementById('classModalTitle').textContent = 'Agregar Clase';
        openModal('classModal');
    });
    
    document.getElementById('classForm').addEventListener('submit', handleClassSubmit);
    
    // Formulario de examen
    document.getElementById('btnCreateExam').addEventListener('click', () => {
        resetExamForm();
        document.getElementById('examModalTitle').textContent = 'Agregar Examen';
        populateClassSelect();
        openModal('examModal');
    });
    
    document.getElementById('examForm').addEventListener('submit', handleExamSubmit);
    
    // Confirmación de eliminación
    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (appState.deleteCallback) {
            appState.deleteCallback();
        }
        closeModal('deleteModal');
    });
}

// Cargar todos los datos
async function loadAllData() {
    try {
        await Promise.all([
            loadGroups(),
            loadTodos(),
            loadClasses(),
            loadExams(),
        ]);
        updateDashboard();
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Grupos
async function loadGroups() {
    try {
        appState.groups = await groupsAPI.getAll();
        renderGroups();
    } catch (error) {
        console.error('Error al cargar grupos:', error);
    }
}

function renderGroups() {
    const grid = document.getElementById('groupsGrid');
    const empty = document.getElementById('groupsEmpty');
    
    if (appState.groups.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    grid.innerHTML = appState.groups.map(group => `
        <div class="group-card" data-testid="card-group-${group.id}">
            <div class="group-card-header">
                <div>
                    <h3 class="group-card-title">${escapeHtml(group.name)}</h3>
                </div>
            </div>
            ${group.description ? `<p class="group-card-description">${escapeHtml(group.description)}</p>` : ''}
            <div class="group-card-meta">
                <span>${group.members.length} miembro${group.members.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="members-list">
                ${group.members.map(member => `
                    <span class="badge badge-gray">${escapeHtml(member)}</span>
                `).join('')}
            </div>
            <div class="group-card-actions">
                <button class="btn btn-secondary btn-sm" onclick="editGroup('${group.id}')" data-testid="button-edit-group-${group.id}">Editar</button>
                <button class="btn btn-secondary btn-sm" onclick="confirmDelete('group', '${group.id}')" data-testid="button-delete-group-${group.id}">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function addMember() {
    const input = document.getElementById('memberInput');
    const memberName = input.value.trim();
    
    if (!memberName) return;
    
    const membersList = document.getElementById('membersList');
    const badge = document.createElement('span');
    badge.className = 'member-badge';
    badge.innerHTML = `
        ${escapeHtml(memberName)}
        <button type="button" class="member-remove" onclick="this.parentElement.remove()" title="Eliminar">&times;</button>
    `;
    
    membersList.appendChild(badge);
    input.value = '';
    input.focus();
}

function resetGroupForm() {
    document.getElementById('groupForm').reset();
    document.getElementById('groupId').value = '';
    document.getElementById('membersList').innerHTML = '';
    appState.currentGroup = null;
}

async function handleGroupSubmit(e) {
    e.preventDefault();
    
    const groupId = document.getElementById('groupId').value;
    const name = document.getElementById('groupName').value;
    const description = document.getElementById('groupDescription').value;
    const memberBadges = document.querySelectorAll('#membersList .member-badge');
    const members = Array.from(memberBadges).map(badge => {
        return badge.textContent.replace('×', '').trim();
    });
    
    const data = { name, description, members };
    
    try {
        if (groupId) {
            await groupsAPI.update(groupId, data);
        } else {
            await groupsAPI.create(data);
        }
        
        await loadGroups();
        closeModal('groupModal');
        updateDashboard();
    } catch (error) {
        alert('Error al guardar grupo: ' + error.message);
    }
}

async function editGroup(id) {
    const group = appState.groups.find(g => g.id === id);
    if (!group) return;
    
    appState.currentGroup = group;
    document.getElementById('groupId').value = group.id;
    document.getElementById('groupName').value = group.name;
    document.getElementById('groupDescription').value = group.description || '';
    
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '';
    group.members.forEach(member => {
        const badge = document.createElement('span');
        badge.className = 'member-badge';
        badge.innerHTML = `
            ${escapeHtml(member)}
            <button type="button" class="member-remove" onclick="this.parentElement.remove()" title="Eliminar">&times;</button>
        `;
        membersList.appendChild(badge);
    });
    
    document.getElementById('groupModalTitle').textContent = 'Editar Grupo de Estudio';
    openModal('groupModal');
}

// Tareas
async function loadTodos() {
    try {
        appState.todos = await todosAPI.getAll();
        renderTodos();
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

function renderTodos() {
    const list = document.getElementById('todosList');
    const empty = document.getElementById('todosEmpty');
    
    if (appState.todos.length === 0) {
        list.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    list.style.display = 'flex';
    empty.style.display = 'none';
    
    list.innerHTML = appState.todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-testid="card-todo-${todo.id}">
            <div class="todo-header">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo('${todo.id}')"
                    data-testid="checkbox-todo-${todo.id}"
                >
                <div class="todo-content">
                    <h4 class="todo-title">${escapeHtml(todo.title)}</h4>
                    ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
                    <div class="todo-meta">
                        ${todo.dueDate ? `<span class="badge badge-${getDueDateStatus(todo.dueDate)}">${formatDate(todo.dueDate)}</span>` : ''}
                        ${todo.assignedTo ? `<span class="badge badge-primary">Asignado a: ${escapeHtml(todo.assignedTo)}</span>` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="btn btn-secondary btn-icon" onclick="editTodo('${todo.id}')" data-testid="button-edit-todo-${todo.id}" title="Editar">Editar</button>
                    <button class="btn btn-secondary btn-icon" onclick="confirmDelete('todo', '${todo.id}')" data-testid="button-delete-todo-${todo.id}" title="Eliminar">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function populateAssigneeSelect() {
    const select = document.getElementById('todoAssignee');
    const allMembers = new Set();
    
    appState.groups.forEach(group => {
        group.members.forEach(member => allMembers.add(member));
    });
    
    select.innerHTML = '<option value="">Sin asignar</option>' +
        Array.from(allMembers).map(member => 
            `<option value="${escapeHtml(member)}">${escapeHtml(member)}</option>`
        ).join('');
}

function resetTodoForm() {
    document.getElementById('todoForm').reset();
    document.getElementById('todoId').value = '';
    appState.currentTodo = null;
}

async function handleTodoSubmit(e) {
    e.preventDefault();
    
    const todoId = document.getElementById('todoId').value;
    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;
    const dueDate = document.getElementById('todoDueDate').value;
    const assignedTo = document.getElementById('todoAssignee').value;
    
    const data = { 
        title, 
        description, 
        dueDate: dueDate || null,
        assignedTo: assignedTo || null,
        completed: appState.currentTodo?.completed || false
    };
    
    try {
        if (todoId) {
            await todosAPI.update(todoId, data);
        } else {
            await todosAPI.create(data);
        }
        
        await loadTodos();
        closeModal('todoModal');
        updateDashboard();
    } catch (error) {
        alert('Error al guardar tarea: ' + error.message);
    }
}

async function editTodo(id) {
    const todo = appState.todos.find(t => t.id === id);
    if (!todo) return;
    
    appState.currentTodo = todo;
    document.getElementById('todoId').value = todo.id;
    document.getElementById('todoTitle').value = todo.title;
    document.getElementById('todoDescription').value = todo.description || '';
    document.getElementById('todoDueDate').value = todo.dueDate || '';
    
    populateAssigneeSelect();
    document.getElementById('todoAssignee').value = todo.assignedTo || '';
    
    document.getElementById('todoModalTitle').textContent = 'Editar Tarea';
    openModal('todoModal');
}

async function toggleTodo(id) {
    try {
        await todosAPI.toggleComplete(id);
        await loadTodos();
        updateDashboard();
    } catch (error) {
        console.error('Error al cambiar estado de tarea:', error);
    }
}

// Clases
async function loadClasses() {
    try {
        appState.classes = await classesAPI.getAll();
        renderClasses();
    } catch (error) {
        console.error('Error al cargar clases:', error);
    }
}

function renderClasses() {
    const grid = document.getElementById('classesGrid');
    const empty = document.getElementById('classesEmpty');
    
    if (appState.classes.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    grid.innerHTML = appState.classes.map(cls => `
        <div class="class-card" data-testid="card-class-${cls.id}">
            <div class="class-card-header">
                <h3 class="class-card-title">${escapeHtml(cls.name)}</h3>
                ${cls.code ? `<p class="class-card-code">${escapeHtml(cls.code)}</p>` : ''}
            </div>
            <div class="class-card-info">
                ${cls.instructor ? `
                    <div class="class-card-info-item">
                        <span>Instructor: ${escapeHtml(cls.instructor)}</span>
                    </div>
                ` : ''}
                ${cls.schedule ? `
                    <div class="class-card-info-item">
                        <span>Horario: ${escapeHtml(cls.schedule)}</span>
                    </div>
                ` : ''}
            </div>
            <div class="class-card-actions">
                <button class="btn btn-secondary btn-sm" onclick="editClass('${cls.id}')" data-testid="button-edit-class-${cls.id}">Editar</button>
                <button class="btn btn-secondary btn-sm" onclick="confirmDelete('class', '${cls.id}')" data-testid="button-delete-class-${cls.id}">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function resetClassForm() {
    document.getElementById('classForm').reset();
    document.getElementById('classId').value = '';
    appState.currentClass = null;
}

async function handleClassSubmit(e) {
    e.preventDefault();
    
    const classId = document.getElementById('classId').value;
    const name = document.getElementById('className').value;
    const code = document.getElementById('classCode').value;
    const instructor = document.getElementById('classInstructor').value;
    const schedule = document.getElementById('classSchedule').value;
    
    const data = { name, code, instructor, schedule };
    
    try {
        if (classId) {
            await classesAPI.update(classId, data);
        } else {
            await classesAPI.create(data);
        }
        
        await loadClasses();
        closeModal('classModal');
        updateDashboard();
    } catch (error) {
        alert('Error al guardar clase: ' + error.message);
    }
}

async function editClass(id) {
    const cls = appState.classes.find(c => c.id === id);
    if (!cls) return;
    
    appState.currentClass = cls;
    document.getElementById('classId').value = cls.id;
    document.getElementById('className').value = cls.name;
    document.getElementById('classCode').value = cls.code || '';
    document.getElementById('classInstructor').value = cls.instructor || '';
    document.getElementById('classSchedule').value = cls.schedule || '';
    
    document.getElementById('classModalTitle').textContent = 'Editar Clase';
    openModal('classModal');
}

// Exámenes
async function loadExams() {
    try {
        appState.exams = await examsAPI.getAll();
        renderExams();
    } catch (error) {
        console.error('Error al cargar exámenes:', error);
    }
}

function renderExams() {
    const tbody = document.getElementById('examsTableBody');
    const table = document.getElementById('examsTable');
    const empty = document.getElementById('examsEmpty');
    
    if (appState.exams.length === 0) {
        table.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    empty.style.display = 'none';
    
    tbody.innerHTML = appState.exams.map(exam => {
        const className = appState.classes.find(c => c.id === exam.classId)?.name || 'Desconocido';
        const status = getExamStatus(exam.date);
        
        return `
            <tr data-testid="row-exam-${exam.id}">
                <td>${escapeHtml(className)}</td>
                <td>${escapeHtml(exam.type)}</td>
                <td>${formatDate(exam.date)}</td>
                <td>${exam.time || '-'}</td>
                <td><span class="badge badge-${status.color}">${status.text}</span></td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary btn-icon" onclick="editExam('${exam.id}')" data-testid="button-edit-exam-${exam.id}" title="Editar">Editar</button>
                        <button class="btn btn-secondary btn-icon" onclick="confirmDelete('exam', '${exam.id}')" data-testid="button-delete-exam-${exam.id}" title="Eliminar">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function populateClassSelect() {
    const select = document.getElementById('examClass');
    select.innerHTML = '<option value="">Selecciona una clase</option>' +
        appState.classes.map(cls => 
            `<option value="${cls.id}">${escapeHtml(cls.name)}${cls.code ? ` (${escapeHtml(cls.code)})` : ''}</option>`
        ).join('');
}

function resetExamForm() {
    document.getElementById('examForm').reset();
    document.getElementById('examId').value = '';
    appState.currentExam = null;
}

async function handleExamSubmit(e) {
    e.preventDefault();
    
    const examId = document.getElementById('examId').value;
    const classId = document.getElementById('examClass').value;
    const type = document.getElementById('examType').value;
    const date = document.getElementById('examDate').value;
    const time = document.getElementById('examTime').value;
    const location = document.getElementById('examLocation').value;
    
    const data = { classId, type, date, time, location };
    
    try {
        if (examId) {
            await examsAPI.update(examId, data);
        } else {
            await examsAPI.create(data);
        }
        
        await loadExams();
        closeModal('examModal');
        updateDashboard();
    } catch (error) {
        alert('Error al guardar examen: ' + error.message);
    }
}

async function editExam(id) {
    const exam = appState.exams.find(e => e.id === id);
    if (!exam) return;
    
    appState.currentExam = exam;
    document.getElementById('examId').value = exam.id;
    
    populateClassSelect();
    document.getElementById('examClass').value = exam.classId;
    document.getElementById('examType').value = exam.type;
    document.getElementById('examDate').value = exam.date;
    document.getElementById('examTime').value = exam.time || '';
    document.getElementById('examLocation').value = exam.location || '';
    
    document.getElementById('examModalTitle').textContent = 'Editar Examen';
    openModal('examModal');
}

// Confirmación de eliminación
function confirmDelete(type, id) {
    const messages = {
        group: '¿Estás seguro de que deseas eliminar este grupo de estudio?',
        todo: '¿Estás seguro de que deseas eliminar esta tarea?',
        class: '¿Estás seguro de que deseas eliminar esta clase?',
        exam: '¿Estás seguro de que deseas eliminar este examen?',
    };
    
    document.getElementById('deleteMessage').textContent = messages[type];
    
    appState.deleteCallback = async () => {
        try {
            switch (type) {
                case 'group':
                    await groupsAPI.delete(id);
                    await loadGroups();
                    break;
                case 'todo':
                    await todosAPI.delete(id);
                    await loadTodos();
                    break;
                case 'class':
                    await classesAPI.delete(id);
                    await loadClasses();
                    break;
                case 'exam':
                    await examsAPI.delete(id);
                    await loadExams();
                    break;
            }
            updateDashboard();
        } catch (error) {
            alert('Error al eliminar elemento: ' + error.message);
        }
    };
    
    openModal('deleteModal');
}

// Panel de control
function updateDashboard() {
    document.getElementById('stat-groups').textContent = appState.groups.length;
    document.getElementById('stat-todos').textContent = appState.todos.filter(t => !t.completed).length;
    document.getElementById('stat-classes').textContent = appState.classes.length;
    
    const upcomingExams = appState.exams.filter(e => {
        const examDate = new Date(e.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return examDate >= today;
    });
    document.getElementById('stat-exams').textContent = upcomingExams.length;
    
    // Renderizar próximos exámenes en el panel
    const dashboardExams = document.getElementById('dashboard-exams');
    if (upcomingExams.length === 0) {
        dashboardExams.innerHTML = '<p class="text-secondary">No hay exámenes próximos</p>';
    } else {
        dashboardExams.innerHTML = upcomingExams.slice(0, 5).map(exam => {
            const className = appState.classes.find(c => c.id === exam.classId)?.name || 'Desconocido';
            const status = getExamStatus(exam.date);
            
            return `
                <div class="card" style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${escapeHtml(className)}</strong> - ${escapeHtml(exam.type)}
                            <br>
                            <small class="text-secondary">${formatDate(exam.date)}${exam.time ? ` a las ${exam.time}` : ''}</small>
                        </div>
                        <span class="badge badge-${status.color}">${status.text}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Renderizar tareas recientes en el panel
    const dashboardTodos = document.getElementById('dashboard-todos');
    const recentTodos = appState.todos.filter(t => !t.completed).slice(0, 5);
    
    if (recentTodos.length === 0) {
        dashboardTodos.innerHTML = '<p class="text-secondary">No hay tareas activas</p>';
    } else {
        dashboardTodos.innerHTML = recentTodos.map(todo => `
            <div class="card" style="margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <input 
                        type="checkbox" 
                        class="todo-checkbox" 
                        onchange="toggleTodo('${todo.id}')"
                    >
                    <div style="flex: 1;">
                        <strong>${escapeHtml(todo.title)}</strong>
                        ${todo.dueDate ? `<br><small class="text-secondary">${formatDate(todo.dueDate)}</small>` : ''}
                    </div>
                    ${todo.assignedTo ? `<span class="badge badge-primary">${escapeHtml(todo.assignedTo)}</span>` : ''}
                </div>
            </div>
        `).join('');
    }
}

// Funciones de utilidad
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getDueDateStatus(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'danger';
    if (diffDays === 0) return 'warning';
    if (diffDays <= 3) return 'warning';
    return 'success';
}

function getExamStatus(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { text: 'Pasado', color: 'gray' };
    } else if (diffDays === 0) {
        return { text: 'Hoy', color: 'danger' };
    } else if (diffDays <= 7) {
        return { text: 'Esta Semana', color: 'warning' };
    } else {
        return { text: 'Próximo', color: 'success' };
    }
}
