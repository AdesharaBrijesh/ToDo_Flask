function todoApp() {
    return {
        todos: [],
        newTodo: '',
        editingIndex: null,
        init() {
            this.fetchTodos();
        },
        fetchTodos() {
            fetch('/api/todos')
                .then(response => response.json())
                .then(data => {
                    this.todos = data;
                });
        },
        addTodo() {
            if (this.newTodo.trim() === '') return;
            fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ todo: this.newTodo }),
            })
            .then(response => response.json())
            .then(data => {
                this.todos.push(data);
                this.newTodo = '';
            });
        },
        toggleTodo(index) {
            fetch(`/api/check/${index}`, { method: 'POST' })
                .then(() => {
                    this.todos[index].done = !this.todos[index].done;
                });
        },
        deleteTodo(index) {
            fetch(`/api/delete/${index}`, { method: 'POST' })
                .then(() => {
                    this.todos.splice(index, 1);
                });
        },
        editTodo(index) {
            this.editingIndex = index;
            document.getElementById('editInput').value = this.todos[index].todo;
            document.getElementById('editModal').style.display = 'block';
        },
        updateTodo(event) {
            event.preventDefault();
            const updatedTodo = document.getElementById('editInput').value;
            fetch(`/api/edit/${this.editingIndex}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ todo: updatedTodo }),
            })
            .then(() => {
                this.todos[this.editingIndex].todo = updatedTodo;
                document.getElementById('editModal').style.display = 'none';
            });
        },
        formatDate(date) {
            return moment(date).fromNow();
        }
    }
}

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('editModal').style.display = 'none';
});

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.querySelector('[x-data]').__x.$data.updateTodo(event);
});