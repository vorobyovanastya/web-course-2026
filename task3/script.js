// --- Хранилище данных (Массив объектов) ---
let todos = [];
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

// --- Селекторы элементов DOM ---
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const inputWrapper = document.querySelector('.input-wrapper');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const counterInfo = document.getElementById('counter-info');

// Элементы статистики и фильтров
const countTotal = document.getElementById('count-total');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// --- Функция отрисовки (Render) ---
function render() {
  // 1. Фильтрация массива для отображения
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // 2. Очистка текущего списка в DOM
  todoList.innerHTML = '';

  // 3. Генерация элементов с помощью методов массивов и createElement
  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    // Контент задачи (Чекбокс + Текст)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const checkbox = document.createElement('div');
    checkbox.className = 'custom-checkbox';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(textSpan);

    // Кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Удалить задачу';

    // Слушатели событий на элементы отдельной задачи (без onclick в HTML)
    checkbox.addEventListener('click', () => toggleTodo(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });

  // 4. Показ/скрытие сообщения о пустом списке
  if (filteredTodos.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  // 5. Обновление счётчиков
  updateCounters();
}

// --- Подсчёт статистики ---
function updateCounters() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  countTotal.textContent = total;
  countActive.textContent = active;
  countCompleted.textContent = completed;

  counterInfo.textContent = `Осталось: ${active} | Выполнено: ${completed}`;
}

// --- Добавление задачи ---
function addTodo(text) {
  const trimmedText = text.trim();

  // Проверка на пустой ввод
  if (!trimmedText) {
    inputWrapper.classList.add('error');
    return;
  }

  inputWrapper.classList.remove('error');

  // Создание нового объекта задачи
  const newTodo = {
    id: Date.now(), // Уникальный ID
    text: trimmedText,
    completed: false
  };

  todos.push(newTodo);
  taskInput.value = '';
  render();
}

// --- Переключение состояния задачи (Выполнено/Активно) ---
function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  render();
}

// --- Удаление задачи ---
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  render();
}

// --- Инициализация слушателей событий ---

// Обработка отправки формы (по кнопке или Enter)
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(taskInput.value);
});

// Снятие ошибки при вводе текста
taskInput.addEventListener('input', () => {
  if (taskInput.value.trim()) {
    inputWrapper.classList.remove('error');
  }
});

// Переключение фильтров при клике на плашки статистики
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Первый рендер при загрузке страницы
render();
