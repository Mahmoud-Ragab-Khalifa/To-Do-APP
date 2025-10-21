// Selectors
let tempText = document.querySelector(".temp");
let createTaskButton = document.querySelector(".header .add");
let tasksContainer = document.querySelector(".body");

// Array Of Tasks
let arrayOfTasks = [];

// Handle Data From Local Storage
window.onload = function () {
  // Get Tasks From Local Storage
  if (window.localStorage.getItem("tasks")) {
    for (let i = 0; i < JSON.parse(window.localStorage.getItem("tasks")).length; i++) {
      arrayOfTasks.push(JSON.parse(window.localStorage.getItem("tasks"))[i]);
      createTask(JSON.parse(window.localStorage.getItem("tasks"))[i]);
    }
  }
};

// Adding The Task To The To Do List
createTaskButton.onclick = function () {
  createTaskPopUp("الرجاء إدخال عنوان المهمة الجديدة");
  handlePopUp();
};

// Function Create The PopUp For Adding Task
function createTaskPopUp(txt) {
  let popup = document.createElement("div");
  popup.classList.add("popup");
  let content = document.createElement("div");
  content.classList.add("content");
  let h1 = document.createElement("h1");
  h1.appendChild(document.createTextNode(txt));
  content.appendChild(h1);
  let input = document.createElement("input");
  input.setAttribute("class", "input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "title");
  content.appendChild(input);
  let btns = document.createElement("div");
  btns.classList.add("btns");
  let cancel = document.createElement("span");
  cancel.classList.add("cancel");
  cancel.appendChild(document.createTextNode("إلغاء"));
  btns.appendChild(cancel);
  let add = document.createElement("span");
  add.classList.add("add");
  add.appendChild(document.createTextNode("إضافة"));
  btns.appendChild(add);
  content.appendChild(btns);
  popup.appendChild(content);
  document.body.appendChild(popup);
}

// Function Handle The Adding Popup Task Control
function handlePopUp() {
  let input = document.querySelector(".input");
  let addButton = document.querySelector(".btns .add");
  let cancelButton = document.querySelector(".btns .cancel");
  input.focus();
  addButton.addEventListener("click", function () {
    if (input.value !== "") {
      let task = {
        title: input.value,
        date: new Date().toJSON(),
        done: false,
        id: Date.now(),
      };
      arrayOfTasks.push(task);
      window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
      removePopUp(document.querySelector(".popup"));
      document.getElementById("correct").play();
      createTask(task);
    }
  });

  cancelButton.addEventListener("click", function () {
    document.getElementById("wrong").play();
    removePopUp(document.querySelector(".popup"));
  });
}

// Function Remove The PopUp From Dom
function removePopUp(popup) {
  popup.remove();
}

// Function Create The Task Box
function createTask(task) {
  // Empty Tasks Container From Temp Text To Show Tasks
  tempText.classList.add("hide");
  // Main Box Container
  let taskBox = document.createElement("div");
  taskBox.classList.add("box");
  taskBox.setAttribute("data-id", task.id);
  // Control Section
  let boxControl = document.createElement("div");
  boxControl.classList.add("control");
  let editIcon = document.createElement("i");
  editIcon.classList.add("edit", "fa-solid", "fa-pencil");
  boxControl.appendChild(editIcon);
  let checkIcon = document.createElement("i");
  checkIcon.classList.add("check", "fa-solid", "fa-check");
  // Handle Done And Check Status
  if (task.done) {
    taskBox.classList.add("done");
    checkIcon.classList.add("checked");
  }
  boxControl.appendChild(checkIcon);
  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("delete", "fa-solid", "fa-trash");
  boxControl.appendChild(deleteIcon);
  taskBox.appendChild(boxControl);
  // Content Section
  let boxContent = document.createElement("div");
  boxContent.classList.add("content");
  let h2 = document.createElement("h2");
  h2.classList.add("task-head");
  h2.appendChild(document.createTextNode(task.title));
  boxContent.appendChild(h2);
  let taskDateContainer = document.createElement("div");
  taskDateContainer.classList.add("task-date");
  let fullDate = document.createElement("div");
  fullDate.classList.add("date");
  let day = document.createElement("span");
  day.classList.add("day");
  day.appendChild(document.createTextNode(`${Number(task.date.slice(8, 10))}-`));
  fullDate.appendChild(day);
  let month = document.createElement("span");
  month.classList.add("month");
  month.appendChild(document.createTextNode(`${task.date.slice(5, 7)}-`));
  fullDate.appendChild(month);
  let year = document.createElement("span");
  year.classList.add("year");
  year.appendChild(document.createTextNode(`${task.date.slice(0, 4)}`));
  fullDate.appendChild(year);
  taskDateContainer.appendChild(fullDate);
  let calenderIcon = document.createElement("i");
  calenderIcon.classList.add("fa-solid", "fa-calendar-days");
  taskDateContainer.appendChild(calenderIcon);
  boxContent.appendChild(taskDateContainer);
  taskBox.appendChild(boxContent);
  tasksContainer.appendChild(taskBox);
}

// Update Task By Click On Edit Pencil
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit")) {
    createTaskPopUp("إدخل عنوان المهمة الجديد لتعديلها");
    document.querySelectorAll(".box").forEach((box) => {
      box.classList.remove("current");
    });
    e.target.parentElement.parentElement.classList.add("current");
    handleEdit(document.querySelector(".current .task-head").textContent);
  }
});

// Function Handle The Task Edit => Update
function handleEdit(oldTitle) {
  let input = document.querySelector(".input");
  let addButton = document.querySelector(".btns .add");
  let cancelButton = document.querySelector(".btns .cancel");
  let title = document.querySelector(".current .task-head");
  input.value = oldTitle;
  input.select();
  addButton.onclick = function () {
    title.textContent = input.value;
    removePopUp(document.querySelector(".popup"));
    // Edit On Local Storage
    let lsArray = JSON.parse(window.localStorage.getItem("tasks"));
    for (let i = 0; i < lsArray.length; i++) {
      if (lsArray[i].title == oldTitle) {
        lsArray[i].title = input.value;
      }
    }
    window.localStorage.setItem("tasks", JSON.stringify(lsArray));
  };
  cancelButton.addEventListener("click", function () {
    removePopUp(document.querySelector(".popup"));
  });
}

// Done Task By Clicking On Check Button
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("check")) {
    e.target.parentElement.parentElement.classList.toggle("done");
    e.target.classList.toggle("checked");
    // Done On Local Storage
    let lsArray = JSON.parse(window.localStorage.getItem("tasks"));
    for (let i = 0; i < lsArray.length; i++) {
      if (lsArray[i].id == e.target.parentElement.parentElement.dataset.id) {
        lsArray[i].done ? (lsArray[i].done = false) : (lsArray[i].done = true);
      }
    }
    window.localStorage.setItem("tasks", JSON.stringify(lsArray));
  }
});

// Delete Task By Clicking On Trash Button
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    // Get All Tasks Boxes
    let boxes = document.querySelectorAll(".box");
    let lsArray = JSON.parse(window.localStorage.getItem("tasks"));
    boxes.forEach((box, index) => {
      if (box.dataset.id == e.target.parentElement.parentElement.dataset.id) {
        confirmDeletePopUp(lsArray[index].title);
        handleDelete(e.target.parentElement.parentElement, e.target.parentElement.parentElement.dataset.id);
      }
    });
  }
});

// Function Create PopUp To Ask User If Really Need To Delete Task
function confirmDeletePopUp(taskTitle) {
  let popup = document.createElement("div");
  popup.classList.add("popup");
  let content = document.createElement("div");
  content.classList.add("content");
  let h1 = document.createElement("h1");
  h1.appendChild(document.createTextNode(`هل انت متأكد من حذف مهمة : ${taskTitle}`));
  content.appendChild(h1);
  let btns = document.createElement("div");
  btns.classList.add("btns");
  let cancel = document.createElement("span");
  cancel.classList.add("cancel");
  cancel.appendChild(document.createTextNode("إلغاء"));
  btns.appendChild(cancel);
  let add = document.createElement("span");
  add.classList.add("add");
  add.appendChild(document.createTextNode("حذف"));
  btns.appendChild(add);
  content.appendChild(btns);
  popup.appendChild(content);
  document.body.appendChild(popup);
}

// Function Handle Task Delete
function handleDelete(target, targetId) {
  let addButton = document.querySelector(".btns .add");
  let cancelButton = document.querySelector(".btns .cancel");
  addButton.addEventListener("click", function () {
    target.remove();
    removePopUp(document.querySelector(".popup"));
    // Remove From Local Storage
    let lsArray = JSON.parse(window.localStorage.getItem("tasks"));
    let resultArray = lsArray.filter((box) => box.id != targetId);
    window.localStorage.setItem("tasks", JSON.stringify(resultArray));
  });
  cancelButton.addEventListener("click", function () {
    document.getElementById("wrong").play();
    removePopUp(document.querySelector(".popup"));
  });
}
