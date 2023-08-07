class Routes {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null){
            this.#instance = new Routes();
        }
        return this.#instance;
    }

    routeState = "welcome";

    show() {
        this.clear();
        const startMenu = document.querySelector(".start-menu");
        const todolistMenu = document.querySelector(".todolist-menu");
        switch(this.routeState) {
            case "welcome":
                const todolistMenu = document.querySelector(".todolist-menu");
                todolistMenu.classList.remove("isMenuSelected");

                const welcomePage = document.querySelector(".welcome-page-container");
                welcomePage.classList.remove("invisible");
                break;
            case "todolist":
                const startMenu = document.querySelector(".start-menu");
                startMenu.classList.remove("isMenuSelected");
                
                const todolistPage = document.querySelector(".todolist-page-container");
                todolistPage.classList.remove("invisible");
                break;
        }
    }

    clear() {
        const pages = document.querySelectorAll(".main-container > div");
        const sidebarMenuItems = document.querySelectorAll(".sidebar-menu-list > .menu-items")
        pages.forEach(page => {
            page.classList.add("invisible");
        });
        sidebarMenuItems.forEach(menu => {
            menu.classList.add("isMenuSelected");
        });
    }
}