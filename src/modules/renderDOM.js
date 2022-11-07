export default class renderDOM {

  renderFolder = (folder) => {
    const upcomingTasksContainer = document.querySelector(".tasks-container.upcoming-tasks");
    const inprogressTasksContainer = document.querySelector(".tasks-container.inprogress-tasks");
    const completedTasksContainer = document.querySelector(".tasks-container.completed-tasks");
    
    for (const task of folder.tasks) {
      if (task.status == "Upcoming") {
        
      } else if (task.status == "In Progress") {

      } else if (task.status == "Completed") {

      }
    }
  }

  renderTask = (task) => {

  }
}