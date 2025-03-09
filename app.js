// 初始化任务数组和DOM引用
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const filters = document.querySelector('.filters');

// 事件委托处理用户交互
document.addEventListener('click', (e) => {
  if (e.target.matches('#addBtn')) {
    addTask();
  } else if (e.target.matches('.delete-btn')) {
    deleteTask(e.target.dataset.id);
  } else if (e.target.matches('.complete-check')) {
    toggleComplete(e.target.dataset.id);
  } else if (e.target.matches('.filter-btn')) {
    handleFilter(e.target.dataset.filter);
  }
});

// 添加新任务
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);
  updateStorageAndRender();
  taskInput.value = '';
}

// 删除任务
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== Number(id));
  updateStorageAndRender();
}

// 切换完成状态
function toggleComplete(id) {
  tasks = tasks.map(task => 
    task.id === Number(id) 
      ? {...task, completed: !task.completed} 
      : task
  );
  updateStorageAndRender();
}

// 过滤任务
function handleFilter(filterType) {
  document.querySelectorAll('.filter-btn').forEach(btn => 
    btn.classList.toggle('active', btn.dataset.filter === filterType)
  );
  renderTasks(filterType);
}

// 更新本地存储并重新渲染
function updateStorageAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
}

// 渲染任务列表
function renderTasks(filter = 'all') {
  taskList.innerHTML = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .map(task => `
      <li class="task-item ${task.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          class="complete-check"
          data-id="${task.id}"
          ${task.completed ? 'checked' : ''}
        >
        <div class="task-content">${task.text}</div>
        <button 
          class="delete-btn"
          data-id="${task.id}"
          aria-label="删除任务"
        >🗑️</button>
      </li>
    `)
    .join('');
}

// 初始化渲染
renderTasks();