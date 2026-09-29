let todos = [];
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const inputWrapper = document.querySelector('.input-wrapper');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const counterInfo = document.getElementById('counter-info');

const countTotal = document.getElementById('count-total');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

function render() {
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  // Очистка текущего списка 
  todoList.innerHTML = '';

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const checkbox = document.createElement('div');
    checkbox.className = 'custom-checkbox';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(textSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Удалить задачу';

    checkbox.addEventListener('click', () => toggleTodo(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });

  if (filteredTodos.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // Обновление счётчиков
  updateCounters();
}

function updateCounters() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  countTotal.textContent = total;
  countActive.textContent = active;
  countCompleted.textContent = completed;

  counterInfo.textContent = `Осталось: ${active} | Выполнено: ${completed}`;
}

function addTodo(text) {
  // Очищаем текст от лишних пробелов
  const trimmedText = text.trim();

  // Проверка на пустой ввод
  if (!trimmedText) {
    inputWrapper.classList.add('error');
    return;
  }

  inputWrapper.classList.remove('error');

  const newTodo = {
    id: Date.now(), // ID
    text: trimmedText,
    completed: false
  };

  todos.unshift(newTodo);
  taskInput.value = '';
  render();
}

function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  render();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  render();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(taskInput.value);
});

taskInput.addEventListener('input', () => {
  if (taskInput.value.trim()) {
    inputWrapper.classList.remove('error');
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
