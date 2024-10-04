//define el campo donde se van a guardar las tareas, y las obtiene desde el local storage
const task_key = "tasks";
var task_array = JSON.parse(localStorage.getItem(task_key)) ?? [];

//define los elemetnos del html que vamos a usar en el programa
const task_form = document.getElementById("task_form");
const task_input = document.getElementById("task_input");
const task_list = document.getElementById("task_list");

//funcion que guarde las tareas
const saveTask = (ev) => {
  ev.preventDefault();

  if (!task_input.value) {
    alert("La tarea no puede estar vacía");
    return;
  }

  //crea un nuevo objeto de la tarea, y la guarda en el local storage
  const newTask = {
    task: task_input.value,
    done: false,
  };

  task_array.push(newTask);
  localStorage.setItem(task_key, JSON.stringify(task_array));

  task_input.value = null;

  showTasks();
};

//Remueve el elemento del arreglo por el indice, y lo guarda en el local storage
const deleteTask = (index) => {
  task_array.splice(index, 1);
  localStorage.setItem(task_key, JSON.stringify(task_array));

  showTasks();
};


//cambia el campo "done" de la tarea, y lo guarda en el local storage
const completeTask = (index) => {
  if (task_array[index].done) return;

  task_array[index].done = true;
  localStorage.setItem(task_key, JSON.stringify(task_array));

  showTasks();
};

//Regresa el elemento html de la tarea tachada 
const showTaskCompleted = (task) => {
  return `<s>${task.task}</s>`;
};

//Regresa el boton html de completar tarea
const showCompleteButton = (index, hide) => {
  return `
        <button class="btn btn-success ${hide}" onclick="completeTask(${index})">
            <i class="bi-check"></i>
        </button>`;
};


//Recopila las tareas y las agrega al elemnto ul del html
const showTasks = () => {
  let tasks = "";

  task_array.forEach((element, index) => {
    tasks += `
        <li
            class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2"
        >
            <div class="d-flex align-items-center break-word">${
              element.done ? showTaskCompleted(element) : element.task
            }</div>

            <div class="min-width">
                ${
                  !element.done
                    ? showCompleteButton(index, "")
                    : showCompleteButton(index, "hidden")
                }
                <button class="btn btn-danger" onclick="deleteTask(${index})">
                    <i class="bi-trash"></i>
                </button>
            </div>
        </li>
        
        `;
  });

  task_list.innerHTML = tasks;
};

showTasks();
task_form.addEventListener("submit", saveTask);
