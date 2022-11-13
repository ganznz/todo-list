import { differenceInBusinessDays } from "date-fns";
import Folder, { allFolders } from "./tasksFolder";

// -- ELEMENTS -- //
const sidebarBlur = document.querySelector('.sidebar-blur');
const taskSettingsDOM = document.querySelector('.task-settings');
const folderMenu = document.querySelector('.folder-menu');
const addFoldersBtn = document.querySelector('.add-folders');

const titleInput = taskSettingsDOM.querySelector('.task-minor-info-section > .sidebar-title > input');
const taskStatusLabel = taskSettingsDOM.querySelector('.task-minor-container > .task-status > h5');
const taskPriorityLabel = taskSettingsDOM.querySelector('.task-minor-container > .task-priority > h5');
const taskDescription = taskSettingsDOM.querySelector('.task-main-info-section > .task-description > textarea');

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
    const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
    const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
    const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');

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
    p.textContent = 'Due 23/11/22';
    const priorityLabel = document.createElement('div');
    priorityLabel.classList.add('priority-label', task.priority);
    taskInfoContainer.append(h3);
    taskInfoContainer.append(p);
    taskInfoContainer.append(priorityLabel);
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can');
    taskContainer.appendChild(taskIcon);
    taskContainer.appendChild(taskInfoContainer);
    taskContainer.appendChild(deleteIcon);
    taskPerspectiveContainer.appendChild(taskContainer);
    taskPerspectiveContainer.setAttribute('id', index);
    return taskPerspectiveContainer;
  }

  static appendTaskElementsToDOM = (task, taskElements) => {
    const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
    const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
    const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');

    if (task.status == 'upcoming') {
      upcomingTasksContainer.appendChild(taskElements);
    } else if (task.status == 'inprogress') {
      inprogressTasksContainer.appendChild(taskElements);
    } else {
      completedTasksContainer.appendChild(taskElements);
    }
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
    taskDescription.setAttribute('value', task.description);
    taskDescription.value = task.description;
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

  // change task settings status and priority
  if (target == taskSettingsStatus || target == taskSettingsPriority) {
    const folderIndex = folderMenu.querySelector('.selected-folder').getAttribute('folderindex');
    const taskIndex = taskSettingsDOM.getAttribute('taskindex');

    if (target.classList.contains('task-status')) { // update task status
      const statusClassName = renderDOM.toggleSettingsViewTaskStatus(taskStatuses);
      allFolders[folderIndex].tasks[taskIndex].status = statusClassName;
      console.log( allFolders[folderIndex].tasks[taskIndex].status)
    } else { // update task priority
      const priorityClassName = renderDOM.toggleSettingsViewTaskPriorities(taskPriorities);
      allFolders[folderIndex].tasks[taskIndex].priority = priorityClassName;
      console.log(allFolders[folderIndex].tasks[taskIndex].priority)
    }
  }

  // close task settings sidebar
  if (target.classList.contains('task-settings-exit-btn') || (target.classList.contains('sidebar-blur'))) {
    renderDOM.closeTaskSettingsView(e);
    const selectedFolder = folderMenu.querySelector('.selected-folder');
    const selectedFolderIndex = selectedFolder.getAttribute('folderindex');
    const taskIndex = taskSettingsDOM.getAttribute('taskindex');
    
    // update task
    allFolders[selectedFolderIndex].updateTask(taskIndex);
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