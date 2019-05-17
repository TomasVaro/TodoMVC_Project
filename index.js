// Run immediately on page load.
(function startup() {
    const newTodoForm = document.querySelector("#new-todo-form");
    const textbox = newTodoForm.querySelector("#new-todo");

    newTodoForm.onsubmit = event => event.preventDefault();
    newTodoForm.addEventListener("keydown", (event) => {
        // "Enter = 13"
        if (event.keyCode === 13) {
            if (textbox.value != "") {
                createNewTodo(textbox.value);
                newTodoForm.reset();
            }
        }
    });

    // Checks or unchecks checksboxes
    const checkAllButton = document.querySelector("#check-all");
    checkAllButton.addEventListener("mousedown", () => {
        onCheckAllButtonClick();
    });
})();

function onCheckAllButtonClick(){
    const checkBoxes = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint) .checkbox-round input"))
    const allChecked = checkBoxes.every(cb => cb.checked === true);

    if (allChecked === true) {
        checkBoxes.forEach(cb => cb.checked = false);
    }
    else{
        checkBoxes.forEach(cb => cb.checked = true);
    }
}

function onClearButtonClick(){
    const checkBoxes = Array.from(document.querySelectorAll(".todo-item:not(.todo-item-blueprint) .checkbox-round input"))

    const checkBoxesChecked = checkBoxes.filter(cb => cb.checked === true);
    for(let i = 0; i < checkboxesChecked.length; i++ ){
        if(checkBoxesChecked[i] === true){

        }
    }
}

function onCheckboxChange(listItem) {
    // Get child elements.
    const label = listItem.querySelector(".todo-label");
    const checkbox = listItem.querySelector(".checkbox-round");

    if (checkbox.querySelector("input").checked) {
        checkbox.style.borderColor = "#5dc2af";
        label.style.textDecoration = "line-through";
        label.style.color = "rgba(0, 0, 0, 0.1)";
    } else {
        checkbox.style.borderColor = "#e6e6e6";
        label.style.textDecoration = "none";
        label.style.color = "#4d4d4d";
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


// Creates a new todo list item element.
function createNewTodo(text) {
    const todoList = document.querySelector("#todo-list");
    const blueprint = document.querySelector(".todo-item-blueprint").cloneNode(true);

    // Makes element visible.
    blueprint.classList.remove("todo-item-blueprint");

    // Append blueprint to list and return the element that was just created.
    const createdListItem = todoList.appendChild(blueprint);

    // Remove self on click.
    createdListItem.querySelector(".todo-button-remove")
        .addEventListener("click", () => { createdListItem.remove(); });

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
            // localStorage.setItem("labelContent", "label.textContent");
        }
    });

    const checkbox = checkboxRound.querySelector("input");
    checkbox.addEventListener("change", () => { onCheckboxChange(createdListItem); });
}
