import { iterateEventOverNodeList } from './helperFunctions';
import Folder from './taskFolder';
import { format, formatDistance } from 'date-fns';

// -- ELEMENTS -- //
const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');
const addTaskBtns = document.querySelectorAll('.tasks-section > .add-btn');
const sidebarBlur = document.querySelector('.sidebar-blur');

const taskSettings = document.querySelector('.task-settings');
const taskSettingsName = taskSettings.querySelector('.sidebar-title > input');
const taskSettingsTaskStatusContainer = taskSettings.querySelector('.task-status');
const taskSettingsTaskPriorityContainer = taskSettings.querySelector('.task-priority');
const taskSettingsTaskDateCreatedContainer = taskSettings.querySelector('.task-date-created');
const taskSettingsTaskDateDueContainer = taskSettings.querySelector('.task-date-due');
const taskSettingsTaskDescription = taskSettings.querySelector('.task-description > textarea');


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
        deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-lg', 'task-delete-icon');

        taskInfoContainer.append(h3);
        taskInfoContainer.append(p);
        taskInfoContainer.append(priorityLabel);

        taskContainer.appendChild(taskInfoContainer);
        taskContainer.appendChild(deleteIcon);

        return taskContainer;
    }

    static appendTaskElementsToDOM = (tasksContainer, taskElements) => {
        tasksContainer.appendChild(taskElements);
        DOM.applyTaskElementEventListeners(taskElements);

    };

    static applyTaskElementEventListeners = taskElements => {
        const taskCard = taskElements;

        taskCard.addEventListener('click', e => {
            if (e.target.classList.contains('task-delete-icon')) {
                // delete task
                return;
            }
            DOM.openTaskSettings(taskElements);
            DOM.populateTaskSettingsWithTaskInfo(folder.tasks[taskElements.getAttribute('task-name')]);
        })
    }

    static openTaskSettings = () => {
        [sidebarBlur, taskSettings].forEach(element => {
            element.setAttribute('style', 'display: flex');
            element.classList.add('visible');
        });
    }

    static closeTaskSettings = () => {
        [sidebarBlur, taskSettings].forEach(element => {
            element.classList.remove('visible');
            element.setAttribute('style', 'display: none');
        });

    }

    static populateTaskSettingsWithTaskInfo = task => {
        taskSettings.setAttribute('selected-task', task.name);
        taskSettingsName.value = task.name;
        taskSettingsTaskStatusContainer.querySelector('h5').className = task.status;
        taskSettingsTaskPriorityContainer.querySelector('h5').className = task.priority;
        taskSettingsTaskDateCreatedContainer.querySelector('h5').textContent = `${format(task.dateCreated, 'PP')} ${format(task.dateCreated, 'p')}`;
        taskSettingsTaskDateDueContainer.querySelector('input').value = `${format(task.dateDue, 'y')}-${format(task.dateDue, 'MM')}-${format(task.dateDue, 'dd')}`;
        taskSettingsTaskDescription.value = task.description;
    }

    static getTaskSettingsInfo = () => {
        return {
            oldTaskName: taskSettings.getAttribute('selected-task'),
            taskName: taskSettingsName.value,
            taskStatus: taskSettingsTaskStatusContainer.querySelector('h5').className,
            taskPriority: taskSettingsTaskPriorityContainer.querySelector('h5').className,
            taskDueDate: taskSettingsTaskDateDueContainer.querySelector('input').value,
            taskDescription: taskSettingsTaskDescription.value
        };
    }

    static updateTaskElementsDueDateDescription = taskObj => {
        return taskObj.dateCreated < taskObj.dateDue
        ? `Due in ${formatDistance(new Date(), taskObj.dateDue)}` :
        `Overdue by ${formatDistance(new Date(), taskObj.dateDue)}!`;
    }

    static updateTaskElements = (taskObj, oldTaskName) => {
        const taskElements = document.querySelector(`[task-name="${oldTaskName}"]`);
        taskElements.setAttribute('task-name', taskObj.name);
        const taskInfoContainer = taskElements.querySelector('.task-info-container');
        taskInfoContainer.querySelector('h3').textContent = taskObj.name;
        taskInfoContainer.querySelector('p').textContent = DOM.updateTaskElementsDueDateDescription(taskObj);
    }
}

const folder = new Folder();

iterateEventOverNodeList(addTaskBtns, 'click', folder.createTask);



document.addEventListener('click', e => {

    // task settings exit button clicked on
    if (e.target.classList.contains('task-settings-exit-btn')) {
        DOM.closeTaskSettings();

        // update task object
        const taskSettingsInfo = DOM.getTaskSettingsInfo();
        const taskObject = folder.tasks[taskSettings.getAttribute('selected-task')];
        taskObject.updateTask(folder, taskSettingsInfo);
        DOM.updateTaskElements(taskObject, taskSettingsInfo.oldTaskName);
    }

    // sidebar blur clicked on
    if (e.target == sidebarBlur) {
        if (taskSettings.getAttribute('style') == 'display: flex') {
            DOM.closeTaskSettings();
            
            // update task object
            const taskSettingsInfo = DOM.getTaskSettingsInfo();
            const taskObject = folder.tasks[taskSettings.getAttribute('selected-task')];
            taskObject.updateTask(folder, taskSettingsInfo);
            DOM.updateTaskElements(taskObject, taskSettingsInfo.oldTaskName);
        }
        return;
    }
})

