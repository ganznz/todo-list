import { iterateEventOverNodeList } from './helperFunctions';
import Folder from './taskFolder';
import { formatDistance } from 'date-fns';

const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');
const addTaskBtns = document.querySelectorAll('.tasks-section > .add-btn');

export default class DOM {

    static createTaskElements = task => {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task');

        const taskInfoContainer = document.createElement('div');
        taskInfoContainer.classList.add('task-info-container');

        const h3 = document.createElement('h3');
        h3.textContent = task.name;

        const p = document.createElement('p');
        p.textContent = `Due in ${formatDistance(task.dateCreated, task.dateDue)}`;

        const priorityLabel = document.createElement('div');
        priorityLabel.classList.add('priority-label', task.priority);

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-lg',  'task-delete-icon');

        taskInfoContainer.append(h3);
        taskInfoContainer.append(p);
        taskInfoContainer.append(priorityLabel);

        taskContainer.appendChild(taskInfoContainer);
        taskContainer.appendChild(deleteIcon);

        return taskContainer;
    }

    static appendTaskElementsToDOM = (tasksContainer, taskElements) => tasksContainer.appendChild(taskElements);
}

const folder = new Folder()

iterateEventOverNodeList(addTaskBtns, 'click', folder.createTask);

