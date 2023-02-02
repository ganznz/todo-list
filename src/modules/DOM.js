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
const taskSettingsTaskIcon = taskSettings.querySelector('.task-settings-task-icon');
const taskUpdateErrorMsg = taskSettings.querySelector('.task-update-error-msg');
const taskIconSelectionContainer = taskSettings.querySelector('.task-icon-selection-container')
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
        checkboxInput.checked = todoObj.status;
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

    static createTaskElements = taskObj => {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task');

        const taskIcon = document.createElement('i');
        taskIcon.classList.add('fa-solid', taskObj.icon, 'fa-lg',  'task-icon');

        const taskInfoContainer = document.createElement('div');
        taskInfoContainer.classList.add('task-info-container');

        const h3 = document.createElement('h3');
        h3.textContent = taskObj.name;

        const p = document.createElement('p');
        p.textContent = DOM.updateTaskElementsDueDateDescription(taskObj);

        const priorityLabel = document.createElement('div');
        priorityLabel.classList.add('priority-label', taskObj.priority);

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-lg', 'task-delete-icon');

        taskInfoContainer.append(h3);
        taskInfoContainer.append(p);
        taskInfoContainer.append(priorityLabel);

        taskContainer.appendChild(taskIcon);
        taskContainer.appendChild(taskInfoContainer);
        taskContainer.appendChild(deleteIcon);

        return taskContainer;
    }

    static getAllTaskIcons = () => {
        return [
            'fa-scroll',
            'fa-palette',
            'fa-code',
            'fa-face-smile',
            'fa-book',
            'fa-money-bill',
            'fa-comments',
            'fa-tree',
            'fa-newspaper',
            'fa-wrench',
            'fa-crown',
            'fa-circle-check',
            'fa-volleyball',
            'fa-peace',
            'fa-paw',
            'fa-paintbrush',
            'fa-pen-clip',
            'fa-message',
            'fa-gas-pump',
            'fa-bread-slice',
            'fa-car',
            'fa-bus-simple',
            'fa-apple-whole',
            'fa-gamepad',
            'fa-cookie-bite',
            'fa-child',
            'fa-handshake',
            'fa-gift',
            'fa-heart',
            'fa-leaf',
            'fa-globe',
            'fa-plane-arrival',
            'fa-user-tie',
        ]
    }

    static chooseTaskIcon = () => {
        const allTaskIcons = DOM.getAllTaskIcons();
        return allTaskIcons[Math.floor(Math.random() * allTaskIcons.length)];
    }

    static renderTaskIconSelectionContainer = allTaskIcons => {
        for (const iconClass of allTaskIcons) {
            const div = document.createElement('div');
            
            const i = document.createElement('i');
            i.classList.add('fa-solid', 'fa-xl', iconClass);
            
            div.appendChild(i);
            taskIconSelectionContainer.appendChild(div);
        }
    }

    static openTaskIconSelectionContainer = () => {
        DOM.displaySelectedTaskIconInTaskIconSelectionContainer();
        taskIconSelectionContainer.classList.add('active');
    }

    static closeTaskIconSelectionContainer = () => taskIconSelectionContainer.classList.remove('active');

    static displaySelectedTaskIconInTaskIconSelectionContainer = () => {
        const taskObj = folder.tasks[taskSettings.getAttribute('selected-task')];

        taskIconSelectionContainer.querySelectorAll('div > svg').forEach(icon => {
            icon.classList.contains(taskObj.icon)
            ? icon.classList.add('selected-task-icon')
            : icon.classList.remove('selected-task-icon')
        });
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
                clearInterval(updateDueDateDesc);
                return;
            }
            DOM.openTaskSettings(taskElements);
            DOM.populateTaskSettingsWithTaskInfo(folder.tasks[taskElements.getAttribute('task-name')]);
        });

        // update task elements due date description every 10 seconds
        const updateDueDateDesc = setInterval(() => {
            taskElements.querySelector('p').textContent = DOM.updateTaskElementsDueDateDescription(folder.tasks[taskElements.getAttribute('task-name')]);
        }, 1000);
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
        DOM.closeTaskIconSelectionContainer();

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
        taskSettingsTaskIcon.innerHTML = '';
        const taskIcon = document.createElement('i');
        taskIcon.className = `fa-solid fa-2xl ${taskObj.icon}`;
        taskSettingsTaskIcon.appendChild(taskIcon)
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
            taskDescription: taskSettingsTaskDescription.value,
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
            taskObject.updateTaskTodos(taskSettingsTodoForm);
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
                taskObject.updateTaskTodos(taskSettingsTodoForm);
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

    // task settings sidebar task icon clicked on
    if (e.target == taskSettingsTaskIcon.querySelector('svg')) {
        taskIconSelectionContainer.classList.contains('active')
        ? DOM.closeTaskIconSelectionContainer()
        : DOM.openTaskIconSelectionContainer();
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
DOM.renderTaskIconSelectionContainer(DOM.getAllTaskIcons());