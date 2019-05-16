// Run immediately on page load.
(function startup() {
    const newTodoForm = document.querySelector("#new-todo-form");
    const textbox = newTodoForm.querySelector("#new-todo");

    newTodoForm.onsubmit = event => event.preventDefault();
    newTodoForm.addEventListener("keydown", (event) => {
        // "Enter"
        if (event.keyCode === 13) {
            if(textbox.value != ""){
                createNewTodo(textbox.value);
                newTodoForm.reset();
            }
        }
    });
})();


// Check browser support for WebStorage
if (typeof(Storage) !== "undefined") {
    // Store
    localStorage.setItem("lastname", "Smith");
    // Retrieve
    document.getElementById("result").innerHTML = localStorage.getItem("lastname");
} else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
}



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
}
