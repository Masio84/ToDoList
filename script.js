document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Renderizar tareas guardadas
    renderTasks();

    // Añadir nueva tarea
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            
            // Aplicar efecto flipInX a la última tarea añadida
            const lastTask = taskList.lastChild;
            lastTask.classList.add('animate__animated', 'animate__flipInX');
        }
    }

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

            // Eventos para drag & drop
            taskElement.addEventListener('dragstart', dragStart);
            taskElement.addEventListener('dragover', dragOver);
            taskElement.addEventListener('drop', drop);
            taskElement.addEventListener('dragend', dragEnd);

            // Marcar como completada
            taskElement.querySelector('span').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            // Eliminar tarea
            // Dentro de renderTasks(), modifica el evento del botón de eliminar:
taskElement.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    taskElement.classList.add('animate__animated', 'animate__flipOutX');
    
    // Espera a que termine la animación antes de eliminar
    taskElement.addEventListener('animationend', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });
});

            taskList.appendChild(taskElement);
        });
    }

    // Funciones para Drag & Drop
    let draggedItem = null;

    function dragStart(e) {
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

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});