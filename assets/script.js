// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;//Incrementa el ID y lo devuelve

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $("<div>").addClass("task-card").attr("id" , "task-"+task.id); // Crea un nuevo elemento en la tarjeta
    card.draggable({ zindex: 10000});// esto es lo que la hace arrastable y se vea por enfrente de las columnas
    card.html(`<h3>${task.title}</h3><p>${task.description}</p><p>Deadline: ${task.deadline}</p>`);//Se agrega el contenido a la tarjeta
    const today = dayjs();
    const deadline = dayjs(task.deadline);
    const daysUntildeadline = deadline.diff(today, "days");
    if (daysUntildeadline <= 0 && task.status !== "done"){
        card.css("background-color", "red");
    } else if (daysUntildeadline === 1 && task.status !== "done"){
        card.css("background-color", "yellow");

    } else if (daysUntildeadline > 2 || task.status === "done"){
        card.css("background-color","white");
    } else {
        card.css("background-color","white");
    }

    const deleteButton = $("<button>").addClass("btn btn-danger btn-sm delete-btn").html('<i class="fas fa-trash"></i>');//se crea el boton
    deleteButton.click(function(){
        handleDeleteTask(task.id);
    });//Esto asocia al eliminar la tarjeta
    card.append(deleteButton);
    return card;// regresa la card

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (taskList) {
    $(".lane .task-card").remove();//Elimina las tarjetas existentes
    taskList.forEach(task => {//para cada tarjeta
        const lane = $("#" + task.status);//Encuentra el container de la columna correspondiente
        const card = createTaskCard(task);//Crea una tarjeta para la tarea
        lane.find(".card-body").append(card);//Agrega la tarjeta al contenedor de la columna de estado
    });

}

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();//Evita que se reinicie el formulario de forma standar
    const title = $("#title").val();//Obtiene el titulo desde el formulario
    const description = $("#description").val();//Obtiene la descripcion desde el formulario
    const deadline = dayjs($("#deadline").val()).format("YYYY-MM-DD");//Aqui entra DAYJS
    const id = generateTaskId();//Le da un id a la tarea
    const task = {id,title,description,deadline, status:"to-do"};//crea un objeto en la tarea dandole un status
    taskList.push(task);//Empuja la tarea en la lista
    localStorage.setItem("tasks",JSON.stringify(taskList));//Guardamos la tarea en el localstorage
    localStorage.setItem("nextId",nextId);//Guarda el proximo ID en el localstorage
    renderTaskList();//Borra la lista de tareas
    $("#formModal").modal("hide");//Cierra el modal
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId){
    console.log("Deleting task with ID:",taskId);
    const index = taskList.findIndex(task => task.id === parseInt(taskId));//Encuentra el indice de la tarea en la lista
    taskList.splice(index,1);//Elimina la tarjeta de la lista
    localStorage.setItem("tasks", JSON.stringify(taskList));//Guarda la lista actualizada de tareas en el local storage
    renderTaskList();//Actualiza la lista de tarea

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskID = ui.draggable.attr("id");//Obtiene el ID de la tarea que se arrastrara
    const status = $(event.target).closest(".lane").attr("id");//Obtiene el status de la columna donde se esta soltando la tarea

    console.log("Drop event triggered");
    console.log("Status", status);
    console.log("Task ID", taskID);

    const task = taskList.find(task => task.id === parseInt(taskID.split("-")[1]));//Encuentra la tarea en la lista
    console.log("Status:", status);
    console.log("Task:", task);

    task.status = status; //Actualiza el estado de la tarea

    if(status === "done"){
        console.log("changing color");
        $("#"+taskID).removeClass("task-card-yellow");
        $("#"+taskID).removeClass("task-card-red");
        $("#"+taskID).css("background-color", "white");
        
        console.log("Selected card:",$("#"+taskID));
    }

    localStorage.setItem("tasks",JSON.stringify(taskList));//Guarda lo actualizado en el localstorage
    renderTaskList();//Actualiza la lista de tarea
}




// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();// Cuando se carga la pagina se actualiza

    $("#taskForm").submit(handleAddTask);//Agrega el listener para el envio de la tarea
    $(".lane").droppable({drop: handleDrop});//Hace las columnas para que puedas droppear
    console.log("Drop listener added");
    $("#saveTask").click(handleAddTask);// Agrega el listener para guardar la tarea
    $(".datepicker").datepicker();//Hace que cuando seleccionen la fecha, se seleccione

});
