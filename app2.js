// Define UI vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const checkBox = document.querySelector('.complete-item');
let editingActiveId = null;

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
    form.addEventListener('submit', addTask);
    clearBtn.addEventListener('click', clearTasks);
    filter.addEventListener('keyup', filterTasks);
}

let tasks;

// Get Tasks from Local Storage
if(localStorage.getItem('tasks') === null) {
    tasks = [];
} else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

// Add Task
function addTask(e) {
    e.preventDefault(); 
    if(taskInput.value === '') {
        alert('Add a task');
    } else {
        let item = {
            text: taskInput.value,
            complete: false,
            id: Math.random() * 10000
        }
        tasks.unshift(item);
        taskInput.value = '';
        updateView();
        updateLocalStorage();
    }
}

function updateView() {
    taskList.innerHTML = "";
    const newList = tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.addEventListener('dblclick', ()=>toggleEditingMode(task.id))
        li.className = 'collection-item';
        if (task.complete) {
            li.classList.add('complete');
        }
        const checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.addEventListener('click', ()=>completeTask(task.id))
        checkBox.checked = task.complete;
        li.appendChild(checkBox);
        if (task.id === editingActiveId) {
            const inputText = document.createElement("input");
            inputText.setAttribute("type", "text");
            inputText.value = task.text;
            inputText.addEventListener('keyup', (event)=>userHitKeyInEdit(event, task.id));
            li.appendChild(inputText);
        } else {
            li.appendChild(document.createTextNode(task.text));
        }
        const deleteBtn = document.createElement('img');
        deleteBtn.onclick = function () {
            removeTask(index);
        }
        // Add class
        deleteBtn.className = 'delete-item';
        // Add icon HTML
        deleteBtn.setAttribute("src", "images/close2.png");
        // Append link to li
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Store in local storage
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Complete Task
function completeTask(id) {
    const task = tasks.find(t => (t.id === id));
    const index = tasks.findIndex(t => (t.id === id));
    task.complete = !task.complete;
    tasks.splice(index, 1, task);
    
    updateView();
    updateLocalStorage();
}

function toggleEditingMode (id) {
    editingActiveId = id;
    updateView();
    console.log("hello")
};

function userHitKeyInEdit (event, id) {
    if (event.code === 'Enter') {
        const task = tasks.find(t => (t.id === id));
        const index = tasks.findIndex(t => (t.id === id));
        task.text = event.target.value;
        tasks.splice(index, 1, task);
        editingActiveId = null;
        updateView();
        updateLocalStorage();
    }
    console.log(event);
    console.log(id);
};

// Remove Task
function removeTask(index) {
    tasks.splice(index, 1);
    updateView();
    updateLocalStorage();
}

// Clear Tasks
function clearTasks() {
    if(confirm('Are you sure?')) {
        tasks = [];
        updateView();
        updateLocalStorage();
    }
}

// Filter Tasks
function filterTasks(e) {
    const text = e.target.value.toLowerCase();
    
    document.querySelectorAll('.collection-item').forEach(function(task){
        const item = task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}
updateView();