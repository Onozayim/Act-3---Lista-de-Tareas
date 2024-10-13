//define el campo donde se van a guardar las tareas, y las obtiene desde el local storage
const task_key = "tasks";

//define los elemetnos del html que vamos a usar en el programa
const task_form = document.getElementById("task_form");
const task_input = document.getElementById("task_input");
const task_list = document.getElementById("task_list");

//url del back-end
const url = "http://localhost:8000/api/task";

//funcion que guarde las tareas
const saveTask = async (ev) => {
  ev.preventDefault();

  try {
    const res = await axios.post(url + "/create", { task: task_input.value });

    addTask(res.data.data);

    task_input.value = "";
    return;
  } catch (error) {
    alert(error.response.data.message);
    return;
  }
};

const addTask = (task) => {
  task_list.insertAdjacentHTML(
    "afterend",
    `<li
          class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2"
          id = "task-${task.id}"
      >
          <div id="task-text-${task.id}" class="d-flex align-items-center break-word">${
            task.done ? showTaskCompleted(task) : task.task
          }</div>

          <div class="min-width">
              ${
                !task.done
                  ? showCompleteButton(task.id, "", task.task)
                  : showCompleteButton(task.id, "hidden", task.task)
              }
              <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                  <i class="bi-trash"></i>
              </button>
          </div>
      </li>`
  );
};

//Remueve el elemento del arreglo por el indice, y lo guarda en el local storage
const deleteTask = async (index) => {
  try {
    await axios.delete(url + "/delete/" + index);
    document.getElementById(`task-${index}`).remove();
  } catch (error) {
    alert(error.response.data.message);
    return;
  }
};

//cambia el campo "done" de la tarea, y lo guarda en el local storage
const completeTask = async (index, task) => {
  try {
    await axios.patch(url + "/complete/" + index);
    document.getElementById(`complete-${index}`).disabled = true;
    document.getElementById(`task-text-${index}`).innerHTML = `<s>${task}</s>`
  } catch (error) {
    alert(error.response.data.message);
    return;
  }
};

//Regresa el elemento html de la tarea tachada
const showTaskCompleted = (task) => {
  return `<s>${task.task}</s>`;
};

//Regresa el boton html de completar tarea
const showCompleteButton = (index, hide, task) => {
  return `
        <button id="complete-${index}" class="btn btn-success ${hide}" onclick="completeTask(${index}, '${task}')" ${hide ? "disabled": ""}>
            <i class="bi-check"></i>
        </button>`;
};

//Recopila las tareas y las agrega al elemnto ul del html
const showTasks = async () => {
  const res = await axios.get(url);

  res.data.data.forEach((element) => {
    addTask(element);
  });
};

showTasks();
task_form.addEventListener("submit", saveTask);
