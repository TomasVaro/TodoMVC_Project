// Run immediately on page load.
(function start() {
    const newTodoForm = document.querySelector("#new-todo-form");
    const textbox = newTodoForm.querySelector("#new-todo");
    const section = document.querySelector("section");
    const checkAll = document.querySelector("#check-all");

    newTodoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // For smaller screens (mobiles incl. in landscape mode). 
        if (window.matchMedia("screen and (max-width: 850px)").matches)
            textbox.scrollIntoView({behavior: 'smooth'});
    });

    // Checks for press on Enter (keyCode = 13) on adding new Todo-textbox.
    // Checks the input for empty string or only white spaces.
    newTodoForm.addEventListener("keydown", (event) => {
        if (event.keyCode === 13 && textbox.value.replace(/\s+/g, '').length != 0) {
            createNewTodo(textbox.value.trim());
            newTodoForm.reset();
            section.classList.remove("hidden");
            checkAll.classList.remove("hidden");

            // Hides new Todo-items if Completed-button is checked.
            if (document.querySelector("#completed").checked === true) {
                onCompletedRadioClick();
            }
            updateLocalStorage();
            updateCheckAllButtonColor();
        }
    });
    
    // For smaller screens (mobiles incl. in landscape mode).
    textbox.addEventListener("focus", () => {        
        if (window.matchMedia("screen and (max-width: 850px)").matches)
            textbox.scrollIntoView({behavior: 'smooth'});
    });

    // Load todos from localStorage and create todo-item elements.
    if(loadTodos() != null){
        loadTodos().forEach(item => {
            const todo = createNewTodo(item.text, item.state);
            updateCheckboxStyle(todo);
            section.classList.remove("hidden");
            checkAll.classList.remove("hidden");
        });
    }

    // Checks or unchecks all checksboxes
    const checkAllButton = document.querySelector("#check-all");
    checkAllButton.addEventListener("mousedown", () => {
        onCheckAllButtonClick();
        updateLocalStorage();
    });

    // Removes all completed Todos on "Clear completed"-button click.
    const checkClearButton = document.querySelector("#clear-button");
    checkClearButton.addEventListener("mousedown", () => {
        onClearButtonClick();
        updateLocalStorage();
    });

    // Change URL on Filter-radiobutton push
    window.addEventListener("hashchange", () => {
        switch (window.location.hash) {
            case "#/all":
                section.querySelector("#filter-buttons input#all").checked = true;
                onAllRadioClick();
                break;
            case "#/active":
                section.querySelector("#filter-buttons input#active").checked = true;
                onActiveRadioClick();
                break;
            case "#/completed":
                section.querySelector("#filter-buttons input#completed").checked = true;
                onCompletedRadioClick();
                break;
        }
    });
    const radios = Array.from(section.querySelectorAll("#filter-buttons li input[type=\"radio\"]"));
    radios.forEach(r => r.addEventListener("change", () => {
        window.location = "#/" + r.value;
    }));

    // Shows Todo-items depending on which filter-button is active
    let filterButtons = document.querySelector("#all");
    filterButtons.addEventListener("click", () => {
        onAllRadioClick();
    });
    filterButtons = document.querySelector("#active");
    filterButtons.addEventListener("click", () => {
        onActiveRadioClick();
    });
    filterButtons = document.querySelector("#completed");
    filterButtons.addEventListener("click", () => {
        onCompletedRadioClick();
    });

    // Checks which filter-button is "active" in Local Storage and assigns that state to the buttons.
    switch (localStorage.getItem("filter")) {
        case "all":
            section.querySelector("input#all").checked = true;
            break;
        case "active":
            section.querySelector("input#active").checked = true;
            break;
        case "completed":
            section.querySelector("input#completed").checked = true;
            break;
        default:
            section.querySelector("input#all").checked = true;
            break;
    }    
    onFilterButtonUppdateTodoItems();
})();

// Creates a new todo list item element.
function createNewTodo(text, state = "active") {
    const todoList = document.querySelector("#todo-list");
    const blueprint = document.querySelector(".todo-item-blueprint").cloneNode(true);

    // Makes element visible.
    blueprint.classList.remove("todo-item-blueprint");

    // Append blueprint to list and return the element that was just created.
    const createdListItem = todoList.appendChild(blueprint);
    const todoButtonRemove = createdListItem.querySelector(".todo-remove-button");

    // Remove Todo-item on remove-button click.
    createdListItem.querySelector(".todo-remove-button").addEventListener("click", () => {
        createdListItem.remove();
        ifToDolistEmpty();
        updateCheckAllButtonColor();
        updateBackground();
        updateNrLeft();
        updateLocalStorage();
    });

    const textbox = createdListItem.querySelector(".todo-textbox");
    const label = createdListItem.querySelector(".todo-label");
    const checkboxRound = createdListItem.querySelector(".checkbox-round");

    // Label and textbox should display value of text.
    label.textContent = text;
    textbox.value = text;

    // Switch label to textbox.
    label.addEventListener("dblclick", () => {
        todoButtonRemove.style.visibility = "hidden";
        label.hidden = true;
        textbox.hidden = false;
        checkboxRound.style.opacity = 0;
        checkboxRound.querySelector("input").disabled = true;

        // Moves cursor to end of text in textbox
        textbox.selectionStart = textbox.selectionEnd = textbox.value.length;
        textbox.focus();
    });

    // Switch textbox to label on blur.
    textbox.addEventListener("blur", () => {
        textboxToLabel(createdListItem);
    });

    // Switch textbox to label on enter.
    textbox.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            textboxToLabel(createdListItem);
        }
    });

    const checkbox = checkboxRound.querySelector("input");
    switch (state) {
        case "completed":
            checkbox.checked = true;
            break;
        case "active":
            checkbox.checked = false;
            break;
    }

    checkbox.addEventListener("change", () => { 
        updateCheckboxStyle(createdListItem);
        updateLocalStorage();
    });    
    updateBackground();
    updateNrLeft();
    // Return element for easier reference.
    return createdListItem;
}

// Loads todos from localStorage and return as objects.
function loadTodos() {
    return JSON.parse(localStorage.getItem("items"));}

// Saves changes to to localStorage. This function "looks" at the GUI and updates localStorage
// based on what it "sees".
function updateLocalStorage(){
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    const todoItemObjects = todoItems.map(ti => new Object({
        text: ti.querySelector(".todo-label").textContent,
        state: ti.querySelector(".checkbox-round input").checked ? "completed" : "active"
    }));
    localStorage.setItem("items", JSON.stringify(todoItemObjects));    
}

// Checks/unchecks all items in Todo-list.
function onCheckAllButtonClick() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    const allChecked = todoItems.every(ti => ti.querySelector(".checkbox-round input").checked === true);

    if (allChecked === true) {
        todoItems.forEach(ti => {
            ti.querySelector(".checkbox-round input").checked = false;
            updateCheckboxStyle(ti);
        });
    } else {
        todoItems.forEach(ti => {
            ti.querySelector(".checkbox-round input").checked = true;
            updateCheckboxStyle(ti);
        });
    }

    updateCheckAllButtonColor();
    onFilterButtonUppdateTodoItems();
    updateNrLeft();
}

// Removes all checked Todo-items.
function onClearButtonClick() {    
    const todoItemsChecked = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"))
        .filter(ti => ti.querySelector(".checkbox-round input").checked === true);

    todoItemsChecked.forEach(ti => ti.remove());
    document.querySelector("#check-all").style.color = "#e6e6e6";
    ifToDolistEmpty();
    updateBackground();
    updateNrLeft();
}

// Removes bottom section and "check-all button" if Todo-list is empty.
function ifToDolistEmpty() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    const section = document.querySelector("section");
    const checkAll = document.querySelector("#check-all");

    if (todoItems.length === 0) {
        section.classList.add("hidden");
        checkAll.classList.add("hidden");
    }
    document.querySelector("body").style = "";
}

// Updates number of "items left" Todo.
function updateNrLeft() {
    const todoItemsUnChecked = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"))
        .filter(ti => ti.querySelector(".checkbox-round input").checked === false);
    const todoItemsChecked = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"))
        .filter(ti => ti.querySelector(".checkbox-round input").checked === true);
    const nrLeft = document.querySelector("#nr-left");
    const itemsLeft = document.querySelector("#items-left");

    // Hide/show "Clear completed" button.
    if (todoItemsChecked.length === 0) {
        const checkClearButton = document.querySelector("#clear-button");
        checkClearButton.style.display = "none";
    }
    else {
        const checkClearButton = document.querySelector("#clear-button");
        checkClearButton.style.display = "flex";
    }

    nrLeft.textContent = todoItemsUnChecked.length;
    if (todoItemsUnChecked.length === 1) {
        itemsLeft.textContent = "item left";
    }
    else {
        itemsLeft.textContent = "items left";
    }
}

// Updates checkbox style.
function updateCheckboxStyle(listItem) {
    // Get child elements.
    const checkbox = listItem.querySelector(".checkbox-round");

    if (checkbox.querySelector("input").checked) {
        checkbox.classList.add("checked");
        listItem.querySelector(".todo-label").classList.add("checked");
    } else {
        checkbox.classList.remove("checked");
        listItem.querySelector(".todo-label").classList.remove("checked");
    }
    onFilterButtonUppdateTodoItems();
    updateCheckAllButtonColor();
    updateNrLeft();
}

// Switches textbox to label.
function textboxToLabel(createdListItem) {
    const textbox = createdListItem.querySelector(".todo-textbox");
    const label = createdListItem.querySelector(".todo-label");
    const checkboxRound = createdListItem.querySelector(".checkbox-round");
    const todoButtonRemove = createdListItem.querySelector(".todo-remove-button");
    label.textContent = textbox.value;
    checkboxRound.style.opacity = 1;

    if (label.textContent === "") {
        createdListItem.remove();
        ifToDolistEmpty();
        updateNrLeft();
    }
    textbox.hidden = true;
    label.hidden = false;

    // Wait a while before setting enabling input, preventing it from
    // checking when user clicks on it while element on editing mode.
    setTimeout(() => {
        checkboxRound.querySelector("input").disabled = false;
    }, 500);

    todoButtonRemove.style.visibility = "visible";        
    updateBackground();
    updateLocalStorage();
}

// Filters todo-items depending on which Filter-button is click.
function onAllRadioClick() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    for (i = 0; i < todoItems.length; i++) {
        todoItems[i].style.display = "flex";
    }
    localStorage.setItem("filter", "all");
}

function onActiveRadioClick() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    for (i = 0; i < todoItems.length; i++) {
        todoItems[i].style.display = "flex";
        if (todoItems[i].querySelector(".checkbox-round input").checked === true) {
            todoItems[i].style.display = "none";
        }
    }
    localStorage.setItem("filter", "active");
}

function onCompletedRadioClick() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    for (i = 0; i < todoItems.length; i++) {
        todoItems[i].style.display = "flex";
        if (todoItems[i].querySelector(".checkbox-round input").checked === false) {
            todoItems[i].style.display = "none";
        }
    }
    localStorage.setItem("filter", "completed");
}

// If filter-button Active or Completed is checked update which Todo-items to see.
function onFilterButtonUppdateTodoItems(){
    if (document.querySelector("#active").checked === true) {
        onActiveRadioClick();
    }
    else if(document.querySelector("#completed").checked === true) {
        onCompletedRadioClick();
    }
}

function updateBackground() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    for (i = 0; i < todoItems.length; i++) {
        if(todoItems[i].textContent.toLowerCase().includes("brad") || todoItems[i].textContent.toLowerCase().includes("pitt")){
            document.querySelector("body").style.backgroundImage = "url(bp.jpg)";
            break;
        }
        else{
            document.querySelector("body").style = "";
        }
    }
}

// Highlights CheckAll-button if all Todo-items are marked "completed".
function updateCheckAllButtonColor(){
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    const todoItemsChecked = todoItems.filter(ti => ti.querySelector(".checkbox-round input").checked === true);
    const checkAll = document.querySelector("#check-all");

    if (todoItems.length === todoItemsChecked.length) {
        checkAll.style.color = "#737373";
    }
    else{
        checkAll.style.color = "#e6e6e6";
    }
}