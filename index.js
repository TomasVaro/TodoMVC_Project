// Run immediately on page load.
(function startup() {
    const newTodoForm = document.querySelector("#new-todo-form");
    const textbox = newTodoForm.querySelector("#new-todo");

    newTodoForm.onsubmit = event => event.preventDefault();
    newTodoForm.addEventListener("keydown", (event) => {
        // "Enter"
        if (event.keyCode === 13) {
            createNewTodo(textbox.value);
            newTodoForm.reset();
        }
    });
})();

// Creates a new todo list item element.
function createNewTodo(text) {
    const todoList = document.querySelector("#todo-list");
    const blueprint = document.querySelector(".todo-item-blueprint").cloneNode(true);

    blueprint.classList.remove("todo-item-blueprint");
    // Append blueprint to list and return the element that was just created.
    const createdListItem = todoList.appendChild(blueprint);

    // Remove self on click.
    createdListItem.querySelector(".todo-button-remove")
        .addEventListener("click", () => { createdListItem.remove(); });

    const label = createdListItem.querySelector(".todo-label");
    // Textbox should not be editable to begin with.
    label.readOnly = true;
    label.value = text;
    // Makes textbox editable on double click.
    label.addEventListener("dblclick", () => {
         label.readOnly = false;
         label.setSelectionRange(label.selectionEnd, label.selectionEnd);
    });
    // Textbox should not be editable when it loses focus.
    label.addEventListener("blur", () => { label.readOnly = true; });
    // Textbox should not be editable on "enter" key click.
    label.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            label.readOnly = true;
            label.setSelectionRange(label.selectionEnd, label.selectionEnd);
        }
    });
}
