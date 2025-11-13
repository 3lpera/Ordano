// Cliente API para interactuar con el servidor
const API_BASE = '/api';

// Función base para realizar solicitudes API
async function apiRequest(method, endpoint, data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// API de Grupos de Estudio
const groupsAPI = {
    getAll: () => apiRequest('GET', '/groups'),
    getOne: (id) => apiRequest('GET', `/groups/${id}`),
    create: (data) => apiRequest('POST', '/groups', data),
    update: (id, data) => apiRequest('PUT', `/groups/${id}`, data),
    delete: (id) => apiRequest('DELETE', `/groups/${id}`),
};

// Api de Tareas (To-Do)
const todosAPI = {
    getAll: () => apiRequest('GET', '/todos'),
    getOne: (id) => apiRequest('GET', `/todos/${id}`),
    create: (data) => apiRequest('POST', '/todos', data),
    update: (id, data) => apiRequest('PUT', `/todos/${id}`, data),
    delete: (id) => apiRequest('DELETE', `/todos/${id}`),
    toggleComplete: (id) => apiRequest('PATCH', `/todos/${id}/toggle`),
};

// API de Clases
const classesAPI = {
    getAll: () => apiRequest('GET', '/classes'),
    getOne: (id) => apiRequest('GET', `/classes/${id}`),
    create: (data) => apiRequest('POST', '/classes', data),
    update: (id, data) => apiRequest('PUT', `/classes/${id}`, data),
    delete: (id) => apiRequest('DELETE', `/classes/${id}`),
};

// Api de exámenes
const examsAPI = {
    getAll: () => apiRequest('GET', '/exams'),
    getOne: (id) => apiRequest('GET', `/exams/${id}`),
    create: (data) => apiRequest('POST', '/exams', data),
    update: (id, data) => apiRequest('PUT', `/exams/${id}`, data),
    delete: (id) => apiRequest('DELETE', `/exams/${id}`),
};
