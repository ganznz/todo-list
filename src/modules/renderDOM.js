import { format, formatDistance } from "date-fns";
import Folder, { allFolders } from "./tasksFolder";
import { setAttributes } from "./helperFunctions";

// -- ELEMENTS -- //
const mainContentContainer = document.querySelector('.main-content-container');
const sidebarBlur = document.querySelector('.sidebar-blur');
const folderMenu = document.querySelector('.folder-menu');
const addFoldersBtn = document.querySelector('.add-folders');
const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');

const taskSettingsDOM = document.querySelector('.task-settings');
const titleInput = taskSettingsDOM.querySelector('.task-minor-info-section > .sidebar-title > input');
const taskStatusLabel = taskSettingsDOM.querySelector('.task-minor-container > .task-status > h5');
const taskPriorityLabel = taskSettingsDOM.querySelector('.task-minor-container > .task-priority > h5');
const taskDescription = taskSettingsDOM.querySelector('.task-main-info-section > .task-description > textarea');
const taskDateCreated = taskSettingsDOM.querySelector('.task-date-created > h5');
const taskDateDue = taskSettingsDOM.querySelector('.task-date-due > input');
const taskTodosSection = taskSettingsDOM.querySelector('.task-todos');
const taskTodosForm = taskTodosSection.querySelector('form');


export default class renderDOM {

  static addFolderToSidebar = (folder) => {
    const ul = folderMenu.querySelector('ul');
    const li = document.createElement('li');
    li.setAttribute('folderindex', allFolders.length - 1)
    li.textContent = folder.name;
    if (allFolders.length > 1) {
      const previouslySelected = folderMenu.querySelector('.selected-folder');
      previouslySelected.classList.remove('selected-folder');
    }
    li.classList.add('selected-folder');
    ul.appendChild(li)
  }

  static renderFolder = (folder) => {
    // removes old task DOM elements
    this.clearFolderTasksElements();
  }

  static createTaskElements = (task, index) => {
    const taskPerspectiveContainer = document.createElement('div');
    taskPerspectiveContainer.classList.add('task-perspective-container');
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task');

    const taskIcon = document.createElement('i');
    taskIcon.classList.add('fa-solid', 'fa-face-smile', 'fa-lg', 'task-icon');

    const taskInfoContainer = document.createElement('div');
    taskInfoContainer.classList.add('task-info-container');
    const h3 = document.createElement('h3');
    h3.textContent = task.name;
    const p = document.createElement('p');
    p.textContent = `Due in ${formatDistance(task.dateCreated, task.dateDue)}`;
    const priorityLabel = document.createElement('div');
    priorityLabel.classList.add('priority-label', task.priority);

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can');

    taskInfoContainer.append(h3);
    taskInfoContainer.append(p);
    taskInfoContainer.append(priorityLabel);

    taskContainer.appendChild(taskIcon);
    taskContainer.appendChild(taskInfoContainer);
    taskContainer.appendChild(deleteIcon);
    taskPerspectiveContainer.appendChild(taskContainer);
    taskPerspectiveContainer.setAttribute('id', index);
    return taskPerspectiveContainer;
  }

  static appendTaskElementsToDOM = (task, taskElements) => {
    if (task.status == 'upcoming') {
      upcomingTasksContainer.appendChild(taskElements);
    } else if (task.status == 'inprogress') {
      inprogressTasksContainer.appendChild(taskElements);
    } else {
      completedTasksContainer.appendChild(taskElements);
    }

    // update task card due date info
    const dueDateDescription = taskElements.querySelector('.task-info-container > p');
    setInterval(() => { this.updateTaskCardDueDateDescription(task, dueDateDescription) }, 1000);
  }

  static updateTaskCardDueDateDescription = (task, element) => {
    if (task.dateCreated < task.dateDue) {
      element.textContent = `Due in ${formatDistance(task.dateCreated, task.dateDue)}`;
      element.classList.remove('overdue-task');
    } else {
      element.textContent = `Overdue by about ${formatDistance(task.dateCreated, task.dateDue)}!`;
      element.classList.add('overdue-task');
      // setAttributes(element, {'style':'color: var(--priority-red)', 'font-weight':'700'});
    }
  }

  static createTodoElements = (taskObj) => {
    // clear todos previously shown in task settings
    this.clearTodoElements();

    taskObj.todos.forEach(todo => {
      const todoContainer = document.createElement('div');
      todoContainer.classList.add('form-checkbox-container');
      const inputCheckbox = document.createElement('input');
      setAttributes(inputCheckbox, {'type':'checkbox', 'id':`checkbox${taskObj.numOfTodos}`, 'name':`checkbox${taskObj.numOfTodos}`});
      const inputDescription = document.createElement('input');
      setAttributes(inputDescription, {'type':'text', 'value':todo.description});
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-square-minus', 'fa-xl');
      
      todoContainer.appendChild(inputCheckbox);
      todoContainer.appendChild(inputDescription);
      todoContainer.appendChild(deleteIcon);

      taskTodosForm.insertBefore(todoContainer, taskTodosForm.querySelector('.add-todos.btn'));
    })
  }

  static clearTodoElements = () => {
    taskTodosForm.querySelectorAll('div').forEach(node => node.remove());
  }

  static clearFolderTasksElements = () => {
    document.querySelectorAll('.tasks-container').forEach(container => container.innerHTML = "");
  }

  static showTaskSettingsView = (task) => {
    [sidebarBlur, taskSettingsDOM].forEach(element => element.setAttribute('style', 'display: block'));
    taskSettingsDOM.setAttribute('taskindex', task.index);

    setTimeout(() => {
      sidebarBlur.classList.add('visible');
      taskSettingsDOM.classList.add('visible');
    }, 100);

    titleInput.setAttribute('value', task.name);
    titleInput.value = task.name;
    taskStatusLabel.className = '';
    taskStatusLabel.classList.add(task.status);
    taskStatusLabel.textContent = task.status == 'upcoming' ? 'Upcoming' : (task.status == "inprogress" ? 'In Progress' : 'Completed');
    taskPriorityLabel.className = '';
    taskPriorityLabel.classList.add(task.priority);
    taskPriorityLabel.textContent = task.priority == 'low' ? 'Low' : (task.priority == "medium" ? 'Medium' : 'High');
    taskDateCreated.textContent = `${format(task.dateCreated, 'PP')} ${format(task.dateCreated, 'p')}`;
    taskDateDue.value = `${format(task.dateDue, 'y')}-${format(task.dateDue, 'MM')}-${format(task.dateDue, 'dd')}`;
    taskDateDue.setAttribute('value', `${format(task.dateDue, 'y')}-${format(task.dateDue, 'MM')}-${format(task.dateDue, 'dd')}`);
    taskDescription.setAttribute('value', task.description);
    taskDescription.value = task.description;

    this.createTodoElements(task);
  }

  static closeTaskSettingsView = e => {
      [taskSettingsDOM, sidebarBlur].forEach(element => element.classList.remove('visible'));
      setTimeout(() => { [taskSettingsDOM, sidebarBlur].forEach(element => element.setAttribute('style', 'display: none')) }, 1000);
  }

  static closeFoldersSettingsView = e => {
      [folderMenu, sidebarBlur].forEach(element => element.classList.remove('visible'));
      setTimeout(() => { [folderMenu, sidebarBlur].forEach(element => element.setAttribute('style', 'display: none')) }, 1000);
  }

  static toggleSettingsViewTaskStatus = (statuses) => {
    const label = taskSettingsStatus.querySelector('h5');
    const previousIndex = statuses.indexOf(label.className);
    label.className = '';
    label.classList.add(`${statuses[(previousIndex + 1) % statuses.length]}`);
    taskStatusLabel.textContent = label.className == 'upcoming' ? 'Upcoming' : (label.className == "inprogress" ? 'In Progress' : 'Completed');
    return label.className;
  }

  static toggleSettingsViewTaskPriorities = (priorities) => {
    const label = taskSettingsPriority.querySelector('h5');
    const previousIndex = priorities.indexOf(label.className);
    label.className = '';
    label.classList.add(`${priorities[(previousIndex + 1) % priorities.length]}`);
    taskPriorityLabel.textContent = label.className == 'low' ? 'Low' : (label.className == "medium" ? 'Medium' : 'High');
    return label.className;
  }
}

// values for changing task settings status and priority
const taskSettingsStatus = taskSettingsDOM.querySelector('.task-status');
const taskSettingsPriority = taskSettingsDOM.querySelector('.task-priority');
const taskStatuses = ['upcoming', 'inprogress', 'completed'];
const taskPriorities = ['low', 'medium', 'high'];

document.addEventListener('click', e => {
  const target = e.target;
  let priorityClassName;

  // change task settings status and priority
  if (target == taskSettingsStatus || target == taskSettingsPriority) {
    const folderIndex = folderMenu.querySelector('.selected-folder').getAttribute('folderindex');
    const taskIndex = taskSettingsDOM.getAttribute('taskindex');
    const taskElements = document.getElementById(taskIndex);
    const taskObj = allFolders[folderIndex].tasks[taskIndex]

    if (target.classList.contains('task-status')) { // update task status
      const statusClassName = renderDOM.toggleSettingsViewTaskStatus(taskStatuses);
      taskObj.status = statusClassName;
    } else { // update task priority
      priorityClassName = renderDOM.toggleSettingsViewTaskPriorities(taskPriorities);
      taskObj.priority = priorityClassName;
      taskElements.querySelector('.priority-label').classList.remove('low', 'medium', 'high');
      taskElements.querySelector('.priority-label').classList.add(priorityClassName);
    }
    renderDOM.appendTaskElementsToDOM(taskObj, taskElements);
  }

  // close task settings sidebar
  if (target.classList.contains('task-settings-exit-btn') || (target.classList.contains('sidebar-blur'))) {
    renderDOM.closeTaskSettingsView(e);
    const selectedFolder = folderMenu.querySelector('.selected-folder');
    const selectedFolderIndex = selectedFolder.getAttribute('folderindex');
    const taskIndex = taskSettingsDOM.getAttribute('taskindex');
    
    // update task
    // conditional statement ensures to update task only when task settings menu is closing and not the folder menu too 
    if (target.classList.contains('sidebar-blur') && taskSettingsDOM.getAttribute('style') == 'display: block') {
      allFolders[selectedFolderIndex].updateTask(taskIndex);
    }
  }

  // open folders sidebar
  if (target.classList.contains('folders-menu-icon')) {
    [sidebarBlur, folderMenu].forEach(element => element.setAttribute('style', 'display: block'));
    setTimeout(() => {
      sidebarBlur.classList.add('visible');
      folderMenu.classList.add('visible');
    }, 100);
  }

  // close folders sidebar
  if (target.classList.contains('folders-menu-exit-btn') || (e.target.classList.contains('sidebar-blur'))) {
    renderDOM.closeFoldersSettingsView(e);
  }
});

// add folders to sidebar
addFoldersBtn.addEventListener('click', e => {
  renderDOM.clearFolderTasksElements(); // clears old folder viewport before showing new one
  const folderObj = new Folder();
  allFolders.push(folderObj);
  renderDOM.addFolderToSidebar(folderObj);
});