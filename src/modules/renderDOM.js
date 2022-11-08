export default class renderDOM {

  static renderFolder = (folder) => {
    const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
    const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
    const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');
    
    // removes old task DOM elements
    this.clearFolderTasksElements();

  }

  static createTaskElements = (task) => {
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
    return taskContainer;
  }

  static appendTaskElementsToDOM = (task, taskElements) => {
    const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
    const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
    const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');

    if (task.status == 'upcoming') {
      upcomingTasksContainer.appendChild(taskElements);
    } else if (task.status == 'in progress') {
      inprogressTasksContainer.appendChild(taskElements);
    } else {
      completedTasksContainer.appendChild(taskElements);
    }
  }

  static clearFolderTasksElements = () => {
    document.querySelectorAll('.tasks-container').forEach(container => container.innerHTML = "");
  }
}