const sidebarMenuOnClickHandle = (target) => {
    const caseWord = target.querySelector("span");
    switch(caseWord.innerHTML) {
        case "Start":
            Routes.getInstance().routeState = "welcome";
            break;
        case "ToDoList":
            Routes.getInstance().routeState = "todolist";
            break;
    }
    Routes.getInstance().show();
}