document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const counter = document.getElementById('counter');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Cargar tema guardado
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
        themeLabel.textContent = '☀️ Modo Claro';
    }

    // Toggle de tema
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeLabel.textContent = isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    });

    // Renderizar tareas
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('li');
            taskElement.className = 'task';
            taskElement.draggable = true;
            taskElement.dataset.index = index;

            if (task.completed) {
                taskElement.classList.add('completed');
            }

            taskElement.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn">❌</button>
            `;

            // Drag & Drop
            taskElement.addEventListener('dragstart', dragStart);
            taskElement.addEventListener('dragover', dragOver);
            taskElement.addEventListener('drop', drop);
            taskElement.addEventListener('dragend', dragEnd);

            // Completar tarea
            taskElement.querySelector('span').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            // Eliminar tarea (con animación)
            taskElement.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                taskElement.classList.add('animate__animated', 'animate__flipOutX');
                taskElement.addEventListener('animationend', () => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                });
            });

            taskList.appendChild(taskElement);
        });
        updateCounter();
    }

    // Añadir tarea (con animación)
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            
            // Animación al añadir
            const lastTask = taskList.lastChild;
            lastTask.classList.add('animate__animated', 'animate__flipInX');
        }
    }

    // Contador
    function updateCounter() {
        const pendingTasks = tasks.filter(task => !task.completed).length;
        counter.textContent = `${pendingTasks} tarea${pendingTasks !== 1 ? 's' : ''} pendiente${pendingTasks !== 1 ? 's' : ''}`;
    }

    // Drag & Drop
    let draggedItem = null;

    function dragStart() {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        if (draggedItem !== this) {
            const fromIndex = parseInt(draggedItem.dataset.index);
            const toIndex = parseInt(this.dataset.index);
            [tasks[fromIndex], tasks[toIndex]] = [tasks[toIndex], tasks[fromIndex]];
            saveTasks();
            renderTasks();
        }
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    // Guardar en localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Eventos
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Inicializar
    renderTasks();
});
