// todo 추가 모달
const addNewBtnOnClickHandle = () => {
    addModal();
    openModal();
}

// todo 수정 모달
const editBtnOnClickHandle = (target) => {
    editModal(TodoListService.getInstance().getTodoById(target.value));
    openModal();
}

// checkbox onchange 이벤트
const checkedOnChangeHandle = (target) => {
    TodoListService.getInstance().setCompleteStatus(target.value, target.checked);
}

// todo 삭제 버튼 클릭 이벤트
const deleteBtnOnClickHandle = (target) => {
    TodoListService.getInstance().removeTodo(target.value);
}

// todo 객체 생성 함수
const generateTodoObj = () => {
    const todoContent = document.querySelector(".modal-main .text-input").value;
    if(!todoContent){   // input 내용이 비었을 시 return
        return;
    }
    const todoObj = {
        id: 0,
        todoContent: todoContent,
        deadlineDate: DateUtils.toStringByFormatting(new Date()),
        completeStatus: false
    };

    TodoListService.getInstance().addTodo(todoObj);
}

class TodoListService {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null) {
            this.#instance = new TodoListService();
        }
        return this.#instance;
    }

    todoList = null;
    todoIndex = 1;

    constructor() {
        this.loadTodoList();
    }

    loadTodoList() {
        this.todoList = !!localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : new Array();
        this.todoIndex = !!this.todoList[this.todoList.length - 1]?.id ? this.todoList[this.todoList.length - 1].id + 1 : 1;
    }

    saveLocalStorage() {
        // 객체를 제이슨 문자열로 바꿔서 로컬 스토리지에 저장
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }

    getTodoById(id) {
        //filter로 해당 id인 것의 todo 리스트를 받아옴 -> 1개니까 0번 index를 받아오면 됨.
        return this.todoList.filter(todo => todo.id === parseInt(id))[0];
    }

    addTodo(todoObj) {
        const todo = {
            ...todoObj,         // ... : 객체 안에 있는 key:value를 그대로 복사해줌 (깊은 복사)
            id : this.todoIndex // id 값을 마지막 인덱스 값 + 1으로 바꿔 줌 (추가할 때 id: 0 으로 생성)
        }
        this.todoList.push(todo);
        this.saveLocalStorage();
        this.todoIndex++;
        this.updateTodoList();
    }

    // completeStatus 변경 사항 저장 메소드
    setCompleteStatus(id, status) {
        this.todoList.forEach((todo, index) => {
            if(todo.id === parseInt(id)) {
                this.todoList[index].completeStatus = status;
            }
        });
        this.saveLocalStorage();
        this.updateTodoList();
    }

    setTodo(todoObj) {
        // 수정할 todo에 덮어씌워줌
        for(let i = 0; i < this.todoList.length; i++){
            if(this.todoList[i].id === todoObj.id){
                this.todoList[i] = todoObj;
                break;
            }
        }
        this.saveLocalStorage();
        this.updateTodoList();
    }

    removeTodo(id) {
        // todoList에서 삭제할 id와 다른 것만 리스트에 담고 저장
        this.todoList = this.todoList.filter(todo => {
            return todo.id !== parseInt(id);
        });
        this.saveLocalStorage();
        this.updateTodoList();
    }

    updateTodoList() {
        const todolistUlContainer = document.querySelector(".todolist-ul-container");
        const completeTodoList = new Array();
        const incompleteTodoList = new Array();
        this.todoList.forEach(todo => {
            const todoli = `
                <li class="todolist-items">
                    <div class="todolist-top">
                        <div class="item-left">
                            <input type="checkbox" id="complete-chkbox${todo.id}" 
                                class="complete-chkbox" ${todo.completeStatus ? "checked" : ""} 
                                value="${todo.id}" onchange="checkedOnChangeHandle(this)">
                            <label for="complete-chkbox${todo.id}"></label>
                        </div>
                        <div class="item-center">
                            <pre class="todolist-content ${todo.completeStatus ? "complete" : ""}" value="${todo.id}">${todo.todoContent}</pre>
                        </div>
                        <div class="item-right">
                            <p class="todolist-deadline">${todo.deadlineDate}</p>
                        </div>
                    </div>
                    <div class="todolist-item-buttons">
                        <button class="btn btn-edit" value="${todo.id}" onclick="editBtnOnClickHandle(this);"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-remove" value="${todo.id}" onclick="deleteBtnOnClickHandle(this);"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </li>
            `;
            if(todo.completeStatus) {
                completeTodoList.push(todoli);
            } else {
                incompleteTodoList.push(todoli);
            }
            
        });

        todolistUlContainer.innerHTML = incompleteTodoList.join("");
        todolistUlContainer.innerHTML += completeTodoList.join("");
        // map : 새로운 list로 만들어 줌.
        // join("")으로 , 로 이어진 리스트들을 , 없이 이어줌

        // todo 개수 업데이트
        const totalTask = document.querySelector(".total-task");
        totalTask.innerHTML = this.todoList.length;
    }
}