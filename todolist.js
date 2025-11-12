// CLASE TASK - Representa una tarea individual
class Task {
    // Constructor que inicializa una nueva tarea
    constructor(id, name, completed = false) {
        this.id = id;           // Identificador único de la tarea
        this.name = name;       // Nombre/descripción de la tarea
        this.completed = completed; // Estado de completado (true/false)
    }

    // Método para cambiar el estado de completado
    toggleCompleted() {
        this.completed = !this.completed; // Invierte el estado actual
    }
}

// ARRAY DE TAREAS - Almacena todas las tareas
let tasks = []; // Usamos let porque el array cambiará

// FUNCIÓN PARA AGREGAR TAREAS
function addTask(taskName) {
    // Validamos que el nombre no esté vacío
    if (taskName.trim() === '') {
        alert('Por favor, ingresa un nombre para la tarea.');
        return; // Salimos de la función si está vacío
    }

    // Generamos un ID único basado en la fecha actual
    const newId = Date.now();
    
    // Creamos una nueva instancia de Task
    const newTask = new Task(newId, taskName.trim());
    
    // Agregamos la tarea al array
    tasks.push(newTask);
    
    // Actualizamos la visualización
    renderTasks();
    
    // Limpiamos el campo de entrada
    document.getElementById('taskInput').value = '';
    
    // Actualizamos estadísticas
    updateStats();
}

// FUNCIÓN PARA ELIMINAR TAREAS
function deleteTask(taskId) {
    // Filtramos el array para eliminar la tarea con el ID especificado
    tasks = tasks.filter(task => task.id !== taskId);
    
    // Actualizamos la visualización
    renderTasks();
    
    // Actualizamos estadísticas
    updateStats();
}

// FUNCIÓN PARA FILTRAR TAREAS
function filterTasks(completedStatus) {
    // Si no se especifica estado, devolvemos todas las tareas
    if (completedStatus === undefined) {
        return tasks;
    }
    
    // Filtramos según el estado de completado
    return tasks.filter(task => task.completed === completedStatus);
}

// FUNCIÓN PARA MOSTRAR TAREAS EN EL DOM
function renderTasks(filterType = 'all') {
    // Obtenemos el contenedor de tareas del DOM
    const taskList = document.getElementById('taskList');
    
    // Limpiamos el contenido actual
    taskList.innerHTML = '';
    
    // Actualizamos los botones de filtro activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Marcamos como activo el botón del filtro actual
    document.getElementById(`filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`).classList.add('active');
    
    // Determinamos qué tareas mostrar según el filtro
    let tasksToRender;
    switch(filterType) {
        case 'completed':
            tasksToRender = filterTasks(true);
            break;
        case 'pending':
            tasksToRender = filterTasks(false);
            break;
        default:
            tasksToRender = tasks;
    }
    
    // Verificamos si hay tareas para mostrar
    if (tasksToRender.length === 0) {
        // Mostramos un mensaje si no hay tareas
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No hay tareas para mostrar';
        emptyMessage.className = 'empty-message';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // Usamos forEach para iterar sobre cada tarea
    tasksToRender.forEach(task => {
        // Creamos el elemento de lista
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Creamos el checkbox para marcar como completado
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            // Cambiamos el estado de la tarea al hacer clic
            task.toggleCompleted();
            renderTasks(filterType); // Re-renderizamos con el filtro actual
            updateStats(); // Actualizamos estadísticas
        });
        
        // Creamos el span para el nombre de la tarea
        const taskName = document.createElement('span');
        taskName.textContent = task.name;
        taskName.className = 'task-name';
        
        // Creamos el botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        // Creamos un contenedor para las acciones (checkbox y botón eliminar)
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        taskActions.appendChild(checkbox);
        taskActions.appendChild(deleteBtn);
        
        // Agregamos todos los elementos al elemento de lista
        taskItem.appendChild(taskName);
        taskItem.appendChild(taskActions);
        
        // Agregamos el elemento de lista al contenedor
        taskList.appendChild(taskItem);
    });
}

// FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
}

// FUNCIÓN PARA MEJORAR LA EXPERIENCIA EN MÓVILES
function enhanceMobileExperience() {
    // Prevenir zoom en inputs en iOS
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Mejorar el rendimiento de scroll en móviles
    document.addEventListener('touchmove', function() {}, {passive: true});
    
    // Ajustar la altura del viewport en móviles
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Recalcular en cambio de orientación o resize
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// FUNCIÓN PARA INICIALIZAR LA APLICACIÓN
function initApp() {
    // Mejorar experiencia móvil
    enhanceMobileExperience();
    
    // Agregamos evento al botón de agregar tarea
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', () => {
        const taskInput = document.getElementById('taskInput');
        addTask(taskInput.value);
    });
    
    // Agregamos evento al campo de entrada para permitir agregar con Enter
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });
    
    // Agregamos eventos a los botones de filtro
    document.getElementById('filterAll').addEventListener('click', () => {
        renderTasks('all');
    });
    
    document.getElementById('filterCompleted').addEventListener('click', () => {
        renderTasks('completed');
    });
    
    document.getElementById('filterPending').addEventListener('click', () => {
        renderTasks('pending');
    });
    
    // Renderizamos las tareas iniciales
    renderTasks();
    
    // Actualizamos estadísticas iniciales
    updateStats();
}

// INICIALIZAMOS LA APLICACIÓN CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', initApp);