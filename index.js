// Run immediately on page load.
(function startup() {
    const newTodoForm = document.querySelector("#new-todo-form");
    const textbox = newTodoForm.querySelector("#new-todo");
    const section = document.querySelector("section");
    const checkAll = document.querySelector("#check-all");

    newTodoForm.onsubmit = event => event.preventDefault();

    // Checks for press on enter on adding new Todo-textbox.
    newTodoForm.addEventListener("keydown", (event) => {
        // "Enter = 13"
        if (event.keyCode === 13) {
            // Checks the input for empty string or only white spaces.
            if (textbox.value.replace(/\s/g, '').length) {
                createNewTodo(textbox.value.trim());
                newTodoForm.reset();
                section.classList.remove("hidden");
                checkAll.classList.remove("hidden");

                // Checks if Completed-button is checked and if Todo-items are checked - then hide new Todo-items
                if(document.querySelector("#completed").checked === true){
                    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
                    for (let i = 0; i < todoItems.length; i++) {
                        if (todoItems[i].querySelector(".checkbox-round input").checked === true) {
                            onCompletedButtonClick();
                        }
                    }
                }                
            }
        }
    });

    // Checks or unchecks all checksboxes
    const checkAllButton = document.querySelector("#check-all");
    checkAllButton.addEventListener("mousedown", () => {
        onCheckAllButtonClick();


        // if(document.querySelector("#completed").checked === true){
        //     const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
        //     for (let i = 0; i < todoItems.length; i++) {
        //         if (todoItems[i].querySelector(".checkbox-round input").checked === false) {
        //             todoItems[i].querySelector(".checkbox-round input").checked = true;
        //             updateCheckboxStyle(todoItems[i]);
        //         }
        //     }
        // }
    });

    // Removes Todo-item
    const checkClearButton = document.querySelector("#clear-button");
    checkClearButton.addEventListener("mousedown", () => {
        onClearButtonClick();
    });

    // Shows Todo-items depending on which filter-button is active
    let filterButton = document.querySelector("#all");
    filterButton.addEventListener("click", () => {
        onAllButtonClick();
    });
    filterButton = document.querySelector("#active");
    filterButton.addEventListener("click", () => {
        onActiveButtonClick();
    });
    filterButton = document.querySelector("#completed");
    filterButton.addEventListener("click", () => {
        onCompletedButtonClick();
    });
})();

// Creates a new todo list item element.
function createNewTodo(text) {
    const todoList = document.querySelector("#todo-list");
    const blueprint = document.querySelector(".todo-item-blueprint").cloneNode(true);

    // Makes element visible.
    blueprint.classList.remove("todo-item-blueprint");

    // Append blueprint to list and return the element that was just created.
    const createdListItem = todoList.appendChild(blueprint);

    // Remove Todo-item on remove-button click.
    createdListItem.querySelector(".todo-button-remove")
        .addEventListener("click", () => {
            createdListItem.remove();
            ifToDolistEmpty();
            updateNrLeft();
        });

    const textbox = createdListItem.querySelector(".todo-textbox");
    const label = createdListItem.querySelector(".todo-label");
    const checkboxRound = createdListItem.querySelector(".checkbox-round");

    // Label and textbox should display value of text.
    label.textContent = text;
    textbox.value = text;

    // Switch label to textbox.
    label.addEventListener("dblclick", () => {
        label.hidden = true;
        textbox.hidden = false;
        checkboxRound.style.opacity = 0;
        textbox.focus();
    })

    // Switch textbox to label on blur.
    textbox.addEventListener("blur", () => {
        textbox.hidden = true;
        label.hidden = false;
        checkboxRound.style.opacity = 1;
    });

    // Switch textbox to label on enter.
    textbox.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            textbox.hidden = true;
            label.hidden = false;
            label.textContent = textbox.value;
            checkboxRound.style.opacity = 1;
            if (label.textContent === "") {
                createdListItem.remove();
                ifToDolistEmpty();
                updateNrLeft();
            }
            // localStorage.setItem("labelContent", "label.textContent");
        }
    });

    // onAllButtonClick();
    // onCompletedButtonClick();
    const checkbox = checkboxRound.querySelector("input");
    checkbox.addEventListener("change", () => { updateCheckboxStyle(createdListItem); });
    updateNrLeft();
}

// Checks/unchecks all items in Todo-list
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
    updateNrLeft();
}

// Removes all checked Todo-items
function onClearButtonClick() {
    const todoItemsChecked = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"))
        .filter(ti => ti.querySelector(".checkbox-round input").checked === true);
    todoItemsChecked.forEach(ti => ti.remove());
    ifToDolistEmpty();
    updateNrLeft();
}

// Removes bottom section and "check-all button".
function ifToDolistEmpty() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    // const todoItemsChecked = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"))
    //     .filter(ti => ti.querySelector(".checkbox-round input").checked === true);
    const section = document.querySelector("section");
    const checkAll = document.querySelector("#check-all");

    if (todoItems.length === 0) {
        section.classList.add("hidden");
        checkAll.classList.add("hidden");
    }
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

// Update checkbox style
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
    updateNrLeft();
}

// On "Filter-buttons click"
function onAllButtonClick() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));

    for (i = 0; i < todoItems.length; i++) {
        todoItems[i].style.display = "flex";
    }
}
function onActiveButtonClick() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    onAllButtonClick()

    for (i = 0; i < todoItems.length; i++) {
        if (todoItems[i].querySelector(".checkbox-round input").checked === true) {
            todoItems[i].style.display = "none";
        }
    }
}
function onCompletedButtonClick() {
    const todoItems = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint)"));
    onAllButtonClick()

    for (i = 0; i < todoItems.length; i++) {
        if (todoItems[i].querySelector(".checkbox-round input").checked === false) {
            todoItems[i].style.display = "none";
        }
    }
}




// Check browser support for WebStorage
// if (typeof(Storage) !== "undefined") {
//     // Store
//     localStorage.setItem("lastname", "Smith");
//     // Retrieve
//     document.getElementById("result").innerHTML = localStorage.getItem("lastname");
// } else {
//     document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
// }