window.onload = () => {
    TodoListService.getInstance().updateTodoList();
    buildCalendar();
}