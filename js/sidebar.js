const sidebarMenuOnClickHandle = (target) => {
    const caseWord = target.querySelector("span");
    const container = document.querySelector(".container");
    const calendar = document.querySelector(".calendar");
    switch(caseWord.innerHTML) {
        case "Start":
            Routes.getInstance().routeState = "welcome";
            if (container.classList.contains("isCalendarOpen-container")) {
                container.classList.remove("isCalendarOpen-container");
                calendar.classList.remove("isCalendarOpen-calendar");
            }
            break;
        case "ToDoList":
            Routes.getInstance().routeState = "todolist";
            break;
    }
    Routes.getInstance().show();
}