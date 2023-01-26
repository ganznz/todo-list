import { iterateEventOverNodeList, setAttributes } from './helperFunctions';
import Task from './task';
import Folder from './taskFolder';
import { format, formatDistance } from 'date-fns';
import dragula from 'dragula';

// -- ELEMENTS -- //
const upcomingTasksContainer = document.querySelector('.tasks-container.upcoming-tasks');
const inprogressTasksContainer = document.querySelector('.tasks-container.inprogress-tasks');
const completedTasksContainer = document.querySelector('.tasks-container.completed-tasks');
const addTaskBtns = document.querySelectorAll('.tasks-section > .add-btn');
const sidebarBlur = document.querySelector('.sidebar-blur');

const taskSettings = document.querySelector('.task-settings');
const taskSettingsName = taskSettings.querySelector('.sidebar-title input');
const taskUpdateErrorMsg = taskSettings.querySelector('.task-update-error-msg');
const taskSettingsTaskStatusContainer = taskSettings.querySelector('.task-status');
const taskSettingsTaskPriorityContainer = taskSettings.querySelector('.task-priority');
const taskSettingsTaskDateCreatedContainer = taskSettings.querySelector('.task-date-created');
const taskSettingsTaskDateDueContainer = taskSettings.querySelector('.task-date-due');
const taskSettingsTaskDescription = taskSettings.querySelector('.task-description > textarea');
const taskSettingsTodoForm = taskSettings.querySelector('.task-todos > form');
const taskSettingsTodoAddBtn = taskSettings.querySelector('.add-todos');


export default class DOM {

    static createTodoElements = todoObj => {
        const todoContainer = document.createElement('div');
        todoContainer.className = 'form-checkbox-container';
        todoContainer.setAttribute('todo-index', todoObj.index);

        const checkboxInput = document.createElement('input');
        setAttributes(checkboxInput, { 'id':todoObj.description, 'type':'checkbox', 'required':'' });

        const checkboxDescriptionInput = document.createElement('input');
        setAttributes(checkboxDescriptionInput, {'type':'text', 'for':todoObj.description});
        checkboxDescriptionInput.value = todoObj.description;

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-square-minus', 'fa-xl', 'todo-delete-icon');

        todoContainer.appendChild(checkboxInput);
        todoContainer.appendChild(checkboxDescriptionInput);
        todoContainer.appendChild(deleteIcon);
        return todoContainer;
    }

    static clearTaskSettingsTodoElements = () => taskSettingsTodoForm.querySelectorAll('div').forEach(element => element.remove());

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

    static determineTasksContainer = task => {
        switch (task.status) {
            case 'upcoming':
                return upcomingTasksContainer;
            case 'inprogress':
                return inprogressTasksContainer;
            case 'completed':
                return completedTasksContainer;
        };
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

    static populateTaskSettingsTodoForm = taskObj => {
        DOM.clearTaskSettingsTodoElements();
        for (const todo in taskObj.todos) {
            const todoElements = DOM.createTodoElements(taskObj.todos[todo]);
            taskSettingsTodoForm.insertBefore(todoElements, taskSettingsTodoAddBtn);
        }
    }

    static populateTaskSettingsWithTaskInfo = taskObj => {
        taskSettings.setAttribute('selected-task', taskObj.name);
        taskSettingsName.value = taskObj.name;
        taskSettingsTaskStatusContainer.querySelector('h5').className = taskObj.status;
        taskSettingsTaskPriorityContainer.querySelector('h5').className = taskObj.priority;
        taskSettingsTaskDateCreatedContainer.querySelector('h5').textContent = `${format(taskObj.dateCreated, 'PP')} ${format(taskObj.dateCreated, 'p')}`;
        taskSettingsTaskDateDueContainer.querySelector('input').value = `${format(taskObj.dateDue, 'y')}-${format(taskObj.dateDue, 'MM')}-${format(taskObj.dateDue, 'dd')}`;
        taskSettingsTaskDescription.value = taskObj.description;
        DOM.populateTaskSettingsTodoForm(taskObj);
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

    static recreateTaskElements = (taskObj, oldTaskName) => {
        // delete old task elements
        const oldTaskElements = document.querySelector(`[task-name="${oldTaskName}"]`);
        oldTaskElements.remove();

        // create new task elements
        const taskElements = DOM.createTaskElements(taskObj);
        taskElements.setAttribute('task-name', taskObj.name);
        const taskInfoContainer = taskElements.querySelector('.task-info-container');
        taskInfoContainer.querySelector('h3').textContent = taskObj.name;
        taskInfoContainer.querySelector('p').textContent = DOM.updateTaskElementsDueDateDescription(taskObj);
        DOM.appendTaskElementsToDOM(DOM.determineTasksContainer(taskObj), taskElements);

    }

    static updateTaskElements = (taskObj, oldTaskName) => {
        const taskElements = document.querySelector(`[task-name="${oldTaskName}"]`);
        taskElements.setAttribute('task-name', taskObj.name);
        const taskInfoContainer = taskElements.querySelector('.task-info-container');
        taskInfoContainer.querySelector('h3').textContent = taskObj.name;
        taskInfoContainer.querySelector('p').textContent = DOM.updateTaskElementsDueDateDescription(taskObj);
        taskInfoContainer.querySelector('.priority-label').className = `priority-label ${taskObj.priority}`
    }

    static initiateDragula = () => {
        const containers = [upcomingTasksContainer, inprogressTasksContainer, completedTasksContainer]
        
        dragula(containers)
        
        // update tasks status when dropped into task container 
        .on('drop', (taskElements, taskContainer) => {
            const taskObject = folder.tasks[taskElements.getAttribute('task-name')];
            taskObject.status = Task.determineTaskStatus(taskContainer);
        })
    }

    static toggleSettingsSidebarTaskStatuses = () => {
        const statusText = taskSettingsTaskStatusContainer.querySelector('h5');
        const statuses = ['upcoming', 'inprogress', 'completed'];
        statusText.className = statuses[(statuses.indexOf(statusText.className) + 1) % statuses.length];
    }

    static toggleSettingsSidebarTaskPriorities = () => {
        const prioritiesText = taskSettingsTaskPriorityContainer.querySelector('h5');
        const priorities = ['low', 'medium', 'high'];
        prioritiesText.className = priorities[(priorities.indexOf(prioritiesText.className) + 1) % priorities.length];
    }

    static showTaskUpdatingErrorMsg = () => {
        if (!(taskUpdateErrorMsg.classList.contains('active'))) {
            taskUpdateErrorMsg.classList.add('active');
            setTimeout(() => {
                taskUpdateErrorMsg.classList.remove('active'); 
            }, 2000);
        }
    }
}

const folder = new Folder();

iterateEventOverNodeList(addTaskBtns, 'click', folder.createTask);



document.addEventListener('click', e => {
    // task settings exit button clicked on
    if (e.target.classList.contains('task-settings-exit-btn')) {
        
        const taskSettingsInfo = DOM.getTaskSettingsInfo();
        const taskObject = folder.tasks[taskSettings.getAttribute('selected-task')];
        
        // update task object
        if (!(folder.taskNameAlreadyExists(taskSettingsInfo.taskName, taskSettingsInfo.oldTaskName))) {
            DOM.closeTaskSettings();
            const oldTaskStatus = taskObject.status;
            taskObject.updateTask(folder, taskSettingsInfo);
            const newTaskStatus = taskObject.status;

            oldTaskStatus == newTaskStatus
            ? DOM.updateTaskElements(taskObject, taskSettingsInfo.oldTaskName)
            : DOM.recreateTaskElements(taskObject, taskSettingsInfo.oldTaskName);
        } else {
            DOM.showTaskUpdatingErrorMsg();
        }
    }

    // sidebar blur clicked on
    if (e.target == sidebarBlur) {
        if (taskSettings.getAttribute('style') == 'display: flex') {
            
            const taskSettingsInfo = DOM.getTaskSettingsInfo();
            const taskObject = folder.tasks[taskSettings.getAttribute('selected-task')];
            
            // update task object
            if (!(folder.taskNameAlreadyExists(taskSettingsInfo.taskName, taskSettingsInfo.oldTaskName))) {
                DOM.closeTaskSettings();
                const oldTaskStatus = taskObject.status;
                taskObject.updateTask(folder, taskSettingsInfo);
                const newTaskStatus = taskObject.status;
    
                oldTaskStatus == newTaskStatus
                ? DOM.updateTaskElements(taskObject, taskSettingsInfo.oldTaskName)
                : DOM.recreateTaskElements(taskObject, taskSettingsInfo.oldTaskName);
            } else {
                DOM.showTaskUpdatingErrorMsg();
            }
        }
        return;
    }

    // task settings sidebar task status container clicked on
    if (e.target == taskSettingsTaskStatusContainer) {
        DOM.toggleSettingsSidebarTaskStatuses();
    }

    // task settings sidebar task priority container clicked on
    if (e.target == taskSettingsTaskPriorityContainer) {
        DOM.toggleSettingsSidebarTaskPriorities();
    }

    // delete task when task elements delete icon clicked on
    if (e.target.classList.contains('task-delete-icon')) {
        folder.decrementTasksNum();
        const taskElements = e.target.parentNode;
        delete folder.tasks[taskElements.getAttribute('task-name')];
        taskElements.remove();
    }

    // add todos to task when todo add btn clicked on
    if (e.target == taskSettingsTodoAddBtn) {
        const taskObj = folder.tasks[taskSettings.getAttribute('selected-task')];
        const newTodoObj = taskObj.createTodo();
        const todoElements = DOM.createTodoElements(newTodoObj);
        taskSettingsTodoForm.insertBefore(todoElements, taskSettingsTodoAddBtn);
    }

    // delete todos when todo delete icon clicked on
    if (e.target.classList.contains('todo-delete-icon')) {
        const taskObj = folder.tasks[taskSettings.getAttribute('selected-task')];
        const todoIndex = e.target.parentNode.getAttribute('todo-index');
        taskObj.deleteTodo(todoIndex);
    }
})

DOM.initiateDragula();