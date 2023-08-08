const openModal = () => {
    const modal = document.querySelector(".modal");
    modal.classList.remove("invisible");
    // 모달창 open시 input에 자동으로 focus 가도록
    const modalInput = document.querySelector(".modal-main .text-input");
    const value = modalInput.value;

    modalInput.focus();
    modalInput.value = "";
    modalInput.value = value;   //value를 비워줬다 채워야 focus가 value 맨 뒤로 감
}

const closeModal = () => {
    const modal = document.querySelector(".modal");
    modal.classList.add("invisible");
    modal.innerHTML = "";
}

const addConfirmBtnOnClickHandle = () => {
    generateTodoObj();
}

const addConfirmOnKeyUpHandle = (event) => {
    if(event.keyCode === 13) {  //input에서 엔터 쳤을 때
        generateTodoObj();
        closeModal();
    }
}

const editConfirmBtnOnClickHandle = (id) => {
    editTodo(id);
}

const editConfirmOnKeyUpHandle = (event, target) => {
    if(event.keyCode === 13) {  //input에서 엔터 쳤을 때
        editTodo(target.id);
        closeModal();
    }
}

const editTodo = (id) => {
    const newTodoContent = document.querySelector(".modal-main .text-input").value;
    const todo = TodoListService.getInstance().getTodoById(id);
    if(todo.todoContent === newTodoContent || !newTodoContent){ //기존 내용과 같거나 공백이면 return
        return;
    } 
    const todoObj = {
        ...todo,
        todoContent: newTodoContent
    }
    TodoListService.getInstance().setTodo(todoObj);
}

const addModal = () => {
    createModal("Add Todo", "Todo를 작성하세요.", "add", null);
}

const editModal = (todo) => {
    createModal("Edit todo", "Todo를 수정하세요.", "edit", todo)
}

const createModal = (title, message, event, todo) => {
    const modal = document.querySelector(".modal");
    modal.innerHTML = `
        <div class="modal-container">
            <header class="modal-header">
                <h1 class="modal-title">
                    ${title}
                </h1>
            </header>
            <main class="modal-main">
                <p class="modal-message">
                    ${message}
                </p>
                <input type="text" class="text-input w-f" onkeyup="${event}ConfirmOnKeyUpHandle(event, this);" value="${!!todo?.id? todo.todoContent : ""}" id=${!!todo?.id? todo.id : ""}>
            </main>
            <footer class="modal-footer">
                <button class="btn" onclick="${event}ConfirmBtnOnClickHandle(${!!todo?.id? todo.id : ""}); closeModal();">확인</button>
                <button class="btn" onclick="closeModal();">닫기</button>
            </footer>
        </div>
    `;
}
