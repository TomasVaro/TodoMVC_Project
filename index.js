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

    const textbox = createdListItem.querySelector(".todo-textbox");
    const label = createdListItem.querySelector(".todo-label");
    label.textContent = text;
    // Textbox should not be editable to begin with.
    // textbox.readOnly = true;
    textbox.value = text;
    // Makes textbox editable on double click.

    textbox.addEventListener("dblclick", () => {
         textbox.readOnly = false;
         textbox.setSelectionRange(textbox.selectionEnd, textbox.selectionEnd);
        });
        
        label.addEventListener("dblclick", () => {
            label.hidden = true;
            textbox.hidden = false;
            // textbox.readOnly = false;
            textbox.focus();
    })
    // Textbox should not be editable when it loses focus.
    textbox.addEventListener("blur", () => { 
        // textbox.readOnly = true;
        textbox.hidden = true;
        label.hidden = false;
     });
    // Textbox should not be editable on "enter" key click.
    textbox.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) {
            // textbox.readOnly = true;
            // textbox.setSelectionRange(textbox.selectionEnd, textbox.selectionEnd);
            textbox.hidden = true;
            label.hidden = false;
        }
    });
}
