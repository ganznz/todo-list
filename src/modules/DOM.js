import { iterateEventOverNodeList, setAttributes } from './helperFunctions';
import Task from './task';
import Folder, { allFolders } from './taskFolder';
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

const folderNameInput = document.querySelector('header > input');
const folderMenuSidebar = document.querySelector('.folder-menu');
const folderMenuSidebarFoldersList = folderMenuSidebar.querySelector('.folders-list');
const folderMenuSidebarAddFoldersBtn = folderMenuSidebar.querySelector('.add-folders');
const folderDeletionMsg = folderMenuSidebar.querySelector('.folder-deletion-error-msg');


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
            div.setAttribute('icon-class-name', iconClass);
            
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
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
        const taskObj = folderObj.tasks[taskSettings.getAttribute('selected-task')];
        taskIconSelectionContainer.setAttribute('selected-icon', taskObj.icon);

        taskIconSelectionContainer.querySelectorAll('div > svg').forEach(icon => {
            icon.classList.contains(taskObj.icon)
            ? icon.classList.add('selected-task-icon')
            : icon.classList.remove('selected-task-icon');
        });
    }

    static updateTaskSettingsTaskIconDisplayed = taskObj => {
        taskSettingsTaskIcon.innerHTML = '';
        const taskIcon = document.createElement('i');
        taskIcon.classList.add('fa-solid', 'fa-2xl', taskObj.icon);
        
        taskSettingsTaskIcon.appendChild(taskIcon);
    }

    static updateDisplayedSelectedTaskIconInTaskIconSelectionContainer = (e, taskObj) => {
        taskObj.icon = e.target.getAttribute('icon-class-name');
        DOM.displaySelectedTaskIconInTaskIconSelectionContainer();
        
    }

    static createTaskElements = taskObj => {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task');
        taskContainer.setAttribute('task-name', taskObj.name);

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

    static renderFolderTasksElements = folderObj => {
        const allTasks = folderObj.tasks;
        for (const taskName in allTasks) {
            const taskObj = allTasks[taskName];
            const taskEl = DOM.createTaskElements(taskObj);
            DOM.appendTaskElementsToDOM(DOM.determineTasksContainer(taskObj), taskEl);
        }
    }

    static applyTaskElementEventListeners = taskElements => {
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];

        taskElements.addEventListener('click', e => {
            if (e.target.classList.contains('task-delete-icon')) {
                clearInterval(updateDueDateDesc);
                return;
            }
            DOM.openTaskSettings(taskElements);
            DOM.populateTaskSettingsWithTaskInfo(folderObj.tasks[taskElements.getAttribute('task-name')]);
            DOM.displaySelectedTaskIconInTaskIconSelectionContainer();
        });

        // update task elements due date description every 10 seconds
        const updateDueDateDesc = setInterval(() => {
            try {
                taskElements.querySelector('p').textContent = DOM.updateTaskElementsDueDateDescription(folderObj.tasks[taskElements.getAttribute('task-name')]);
            } catch {
                clearInterval(updateDueDateDesc);
            }
        }, 1000);
    }

    static updateFolderNameInput = folderObj => folderNameInput.value = folderObj.name; 

    static applyFolderElementEventListeners = folderElements => {
        folderElements.addEventListener('click', e => {

            // render selected folder
            if (e.target == folderElements) {
                DOM.clearFolderTasksElements();
                DOM.updateCurrentlySelectedFolder(e.target.getAttribute('folder-index'));

                const selectedFolderElements = folderMenuSidebarFoldersList.querySelector('.selected-folder');
                const folderObj = allFolders[selectedFolderElements.getAttribute('folder-index')];
                DOM.renderFolderTasksElements(folderObj);
                DOM.updateFolderNameInput(folderObj);
            }

            // delete folder
            if (e.target.classList.contains('folder-delete-icon')) {
                const selectedFolderElements = e.target.parentNode;
                const folderObj = allFolders[selectedFolderElements.getAttribute('folder-index')];

                // delete folder only if others exist
                if (Object.keys(allFolders).length > 1) {
                    Folder.deleteFolder(folderObj, selectedFolderElements);
                    
                    DOM.clearFolderTasksElements();
                    DOM.updateCurrentlySelectedFolder(Object.keys(allFolders)[0]);
                    DOM.renderFolderTasksElements(allFolders[Object.keys(allFolders)[0]]);
                    DOM.updateFolderNameInput(allFolders[document.querySelector('.selected-folder').getAttribute('folder-index')]);
                } else {
                    DOM.showFolderDeletionErrorMsg();
                }
            }
        })
    }

    static createFolderElements = folderObj => {
        const li = document.createElement('li');
        li.setAttribute('folder-index', folderObj.index);

        const p = document.createElement('p');
        p.textContent = folderObj.name;

        const i = document.createElement('i');
        i.classList.add('fa-solid', 'fa-trash-can', 'fa-lg', 'folder-delete-icon');

        li.appendChild(p);
        li.appendChild(i);

        DOM.applyFolderElementEventListeners(li);

        return li;
    }

    static clearFolderTasksElements = () => document.querySelectorAll('.tasks-container').forEach(container => container.innerHTML = "");

    static appendFolderElementsToDOM = folderElements => folderMenuSidebarFoldersList.appendChild(folderElements);

    static updateCurrentlySelectedFolder = selectedFolderIndex => {
        [...folderMenuSidebarFoldersList.children].forEach(folderElements => {
            folderElements.getAttribute('folder-index') == selectedFolderIndex
            ? folderElements.classList.add('selected-folder')
            : folderElements.classList.remove('selected-folder');
        });
    }

    static openTaskSettings = () => {
        [sidebarBlur, taskSettings].forEach(element => {
            element.setAttribute('style', 'display: flex');
            element.classList.add('visible');
        });
    }

    static closeTaskSettings = () => {
        [sidebarBlur, taskSettings].forEach(element => {
            element.setAttribute('style', 'display: none');
            element.classList.remove('visible');
        });

    }

    static openFoldersSidebar = () => {
        [sidebarBlur, folderMenuSidebar].forEach(element => {
            element.setAttribute('style', 'display: flex');
            element.classList.add('visible');
        });
    }

    static closeFoldersSidebar = () => {
        [sidebarBlur, folderMenuSidebar].forEach(element => {
            element.setAttribute('style', 'display: none');
            element.classList.remove('visible');
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
        taskSettingsTaskIcon.innerHTML = '';

        const taskIcon = document.createElement('i');
        taskIcon.className = `fa-solid fa-2xl ${taskObj.icon}`;
        taskSettingsTaskIcon.appendChild(taskIcon);

        taskIconSelectionContainer.setAttribute('selected-icon', taskObj.icon);

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
        taskInfoContainer.querySelector('.priority-label').className = `priority-label ${taskObj.priority}`;

        taskElements.querySelector('svg:first-child').remove();
        const taskIcon = document.createElement('i');
        taskIcon.classList.add('fa-solid', `${taskObj.icon}`, 'fa-lg', 'task-icon');
        taskElements.insertBefore(taskIcon, taskInfoContainer);
    }

    static initiateDragula = () => {
        const containers = [upcomingTasksContainer, inprogressTasksContainer, completedTasksContainer]
        
        dragula(containers)
        
        // update tasks status when dropped into task container 
        .on('drop', (taskElements, taskContainer) => {
            const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
            const taskObject = folderObj.tasks[taskElements.getAttribute('task-name')];
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

    static showFolderDeletionErrorMsg = () => {
        if (!(folderDeletionMsg.classList.contains('active'))) {
            folderDeletionMsg.classList.add('active');
            setTimeout(() => {
                folderDeletionMsg.classList.remove('active'); 
            }, 2000);
        }
    }
}

// folder name input value changed
folderNameInput.addEventListener('change', e => {
    const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
    const folderElements = folderMenuSidebarFoldersList.querySelector('.selected-folder');
    folderObj.updateFolder(e.target.value, folderElements);
})



document.addEventListener('click', e => {

    // folder sidebar exit button clicked on
    if (e.target.classList.contains('folders-menu-exit-btn')) {
        DOM.closeFoldersSidebar();
    }

    // folder sidebar add folder btn clicked on
    if (e.target == folderMenuSidebarAddFoldersBtn) {
        const folderObj = Folder.createFolder();
        DOM.updateFolderNameInput(folderObj)
    }

    // task folders icon clicked on
    if (e.target.classList.contains('folders-menu-icon')) {
        DOM.openFoldersSidebar();
    }

    // task settings exit button clicked on
    if (e.target.classList.contains('task-settings-exit-btn')) {
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
        const taskObject = folderObj.tasks[taskSettings.getAttribute('selected-task')];
        
        const taskSettingsInfo = DOM.getTaskSettingsInfo();
        
        // update task object
        if (!(folderObj.taskNameAlreadyExists(taskSettingsInfo.taskName, taskSettingsInfo.oldTaskName))) {
            DOM.closeTaskSettings();
            DOM.closeTaskIconSelectionContainer();
            const oldTaskStatus = taskObject.status;
            taskObject.updateTask(folderObj, taskSettingsInfo);
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
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
        const taskObject = folderObj.tasks[taskSettings.getAttribute('selected-task')];

        if (taskSettings.getAttribute('style') == 'display: flex') {
            
            const taskSettingsInfo = DOM.getTaskSettingsInfo();
            
            // update task object
            if (!(folderObj.taskNameAlreadyExists(taskSettingsInfo.taskName, taskSettingsInfo.oldTaskName))) {
                DOM.closeTaskSettings();
                DOM.closeTaskIconSelectionContainer();
                const oldTaskStatus = taskObject.status;
                taskObject.updateTask(folderObj, taskSettingsInfo);
                taskObject.updateTaskTodos(taskSettingsTodoForm);
                const newTaskStatus = taskObject.status;
    
                oldTaskStatus == newTaskStatus
                ? DOM.updateTaskElements(taskObject, taskSettingsInfo.oldTaskName)
                : DOM.recreateTaskElements(taskObject, taskSettingsInfo.oldTaskName);
            } else {
                DOM.showTaskUpdatingErrorMsg();
            }
        }

        if (folderMenuSidebar.getAttribute('style') == 'display: flex') {
            DOM.closeFoldersSidebar();
        } 

        return;
    }

    // task settings sidebar task icon clicked on
    if (e.target == taskSettingsTaskIcon.querySelector('svg')) {
        taskIconSelectionContainer.classList.contains('active')
        ? DOM.closeTaskIconSelectionContainer()
        : DOM.openTaskIconSelectionContainer();
    }

    // task settings sidebar task icons in task icon container being clicked on
    if (e.target.parentNode == taskIconSelectionContainer) {
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
        const taskObject = folderObj.tasks[taskSettings.getAttribute('selected-task')];

        DOM.updateDisplayedSelectedTaskIconInTaskIconSelectionContainer(e, taskObject);
        DOM.updateTaskSettingsTaskIconDisplayed(taskObject);
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
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];

        folderObj.decrementTasksNum();
        const taskElements = e.target.parentNode;
        delete folderObj.tasks[taskElements.getAttribute('task-name')];
        taskElements.remove();
    }

    // add todos to task when todo add btn clicked on
    if (e.target == taskSettingsTodoAddBtn) {
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
        const taskObj = folderObj.tasks[taskSettings.getAttribute('selected-task')];

        const newTodoObj = taskObj.createTodo();
        const todoElements = DOM.createTodoElements(newTodoObj);
        taskSettingsTodoForm.insertBefore(todoElements, taskSettingsTodoAddBtn);
    }

    // delete todos when todo delete icon clicked on
    if (e.target.classList.contains('todo-delete-icon')) {
        const folderObj = allFolders[folderMenuSidebarFoldersList.querySelector('.selected-folder').getAttribute('folder-index')];
        const todoIndex = e.target.parentNode.getAttribute('todo-index');
        taskObj.deleteTodo(todoIndex);
    }
})

DOM.initiateDragula();
Folder.createFolder();

iterateEventOverNodeList(addTaskBtns, 'click', e => {
    allFolders[document.querySelector('.selected-folder').getAttribute('folder-index')].createTask(e);
});

DOM.renderTaskIconSelectionContainer(DOM.getAllTaskIcons());