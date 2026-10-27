let tasks = [];
let currentFilter = 'all';

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');
const filterBtns = document.querySelectorAll('.filter-btn');

function render() {
  list.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });


  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  updateCounter();
}

function updateCounter() {
  const active = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  counter.textContent = `Осталось: ${active}, Выполнено: ${completed}`;
}

function addTask() {
  const text = input.value.trim();
  if (!text) {
    alert('Введите текст задачи!');
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: text,
    completed: false
  });

  input.value = '';
  render();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  render();
}

const btnDelTask = document.getElementById('clear-completed');
btnDelTask.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    render();
});



addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});
