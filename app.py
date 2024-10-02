from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

todos = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/todos')
def get_todos():
    return jsonify(todos)

@app.route('/api/add', methods=['POST'])
def add_todo():
    todo = request.json['todo']
    new_todo = {'todo': todo, 'done': False, 'date': datetime.now().isoformat()}
    todos.append(new_todo)
    return jsonify(new_todo)

@app.route('/api/check/<int:index>', methods=['POST'])
def check_todo(index):
    todos[index]['done'] = not todos[index]['done']
    return '', 204

@app.route('/api/edit/<int:index>', methods=['POST'])
def edit_todo(index):
    todos[index]['todo'] = request.json['todo']
    return '', 204

@app.route('/api/delete/<int:index>', methods=['POST'])
def delete_todo(index):
    todos.pop(index)
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)