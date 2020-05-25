import React from 'react';
import './App.css';
import './todo.css';


class TodosApp extends React.Component {
  state = {
    todos: this.props.initialData.todos,
    filterLabel: 'All',
  };

  addNewTodo = newTodoBody =>
    this.setState(prevState => ({
      todos: {
        ...prevState.todos,
        [uniqueId()]: {
          body: newTodoBody,
          done: false,
        },
      },
    }));

  toggleTodoDone = (todoId, newDoneValue) =>
    this.setState(prevState => ({
      todos: {
        ...prevState.todos,
        [todoId]: {
          ...prevState.todos[todoId],
          done: newDoneValue,
        },
      },
    }));

  deleteTodo = todoId =>
    this.setState(prevState => {
      const { [todoId]:_ , ...todos } = prevState.todos;
      return { todos };
    });

  deleteAllDoneTodos = () =>
    this.setState(prevState => ({
      todos: Object.entries(prevState.todos).reduce(
        (acc, [todoId, todo]) => {
          if (!todo.done) {
            acc[todoId] = todo;
          }
          return acc;
        },
        {}
      ),
    }));

  setFilter = newFilterLabel =>
    this.setState({ filterLabel: newFilterLabel });

  shouldShowTodo = todo => {
    const { filterLabel } = this.state;
    return (
      filterLabel === 'All' ||
      (filterLabel === 'Active' && !todo.done) ||
      (filterLabel === 'Completed' && todo.done)
    );
  };

  render() {
    return (
      <>
        <header>TODO List</header>
        <ul>
          {Object.entries(this.state.todos).map(
            ([todoId, todo]) =>
              this.shouldShowTodo(todo) && (
                <TodoItem
                  key={todoId}
                  id={todoId}
                  todo={todo}
                  toggleTodoDone={this.toggleTodoDone}
                  deleteTodo={this.deleteTodo}
                />
              )
          )}
        </ul>
        <AddTodoForm onSubmit={this.addNewTodo} />
        <div className="actions">
          Show:{' '}
          <FilterButton
            label="All"
            onClick={this.setFilter}
            active={this.state.filterLabel === 'All'}
          />
          <FilterButton
            label="Active"
            onClick={this.setFilter}
            active={this.state.filterLabel === 'Active'}
          />
          <FilterButton
            label="Completed"
            onClick={this.setFilter}
            active={this.state.filterLabel === 'Completed'}
          />
        </div>
        <div className="actions">
          <button onClick={this.deleteAllDoneTodos}>
            Delete All Completed
          </button>
        </div>
        <footer>
          <TodosLeft todos={this.state.todos} />
        </footer>
      </>
    );
  }
}

class TodoItem extends React.PureComponent {
  handleCheckboxChange = event => {
    const newDone = event.target.checked;
    this.props.toggleTodoDone(this.props.id, newDone);
  };

  handleXClick = () => this.props.deleteTodo(this.props.id);

  render() {
    console.count('TodoItem renders');
    const { todo } = this.props;
    const todoStyle = {
      textDecoration: todo.done ? 'line-through' : 'none',
    };
    return (
      <li>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={this.handleCheckboxChange}
        />
        <span style={todoStyle}>{todo.body}</span>
        <span role="link" onClick={this.handleXClick}>
          X
        </span>
      </li>
    );
  }
}

class AddTodoForm extends React.PureComponent {
  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(event.target.todoBody.value);
    event.target.todoBody.value = '';
  };

  render() {
    console.count('AddTodoForm renders');
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="todoBody"
          placeholder="What TODO?"
        />
        <button type="submit">Add TODO</button>
      </form>
    );
  }
}

class FilterButton extends React.PureComponent {
  handleClick = () => this.props.onClick(this.props.label);
  render() {
    console.count('FilterButton renders');
    const buttonStyle = {
      fontWeight: this.props.active ? 'bold' : 'normal',
    };
    return (
      <button onClick={this.handleClick} style={buttonStyle}>
        {this.props.label}
      </button>
    );
  }
}

class TodosLeft extends React.PureComponent {
  activeTodosCount = () =>
    Object.values(this.props.todos).filter(todo => !todo.done)
      .length;

  componentDidMount() {
    document.title = `Active TODOs: ${this.activeTodosCount()}`;
  }

  componentDidUpdate() {
    document.title = `Active TODOs: ${this.activeTodosCount()}`;
  }

  render() {
    console.count('TodosLeft renders');
    return <div>TODOs left: {this.activeTodosCount()}</div>;
  }
}

const initialData = {
  todos: {
    A: {
      body: 'Learn React Fundamentals',
      done: true,
    },
    B: {
      body: 'Build a TODOs App',
      done: false,
    },
    C: {
      body: 'Build a Game',
      done: false,
    },
  },
};

class App extends React.Component{
  render(){
    return(
      <TodosApp initialData={initialData} />
    )
  }
}

const uniqueId = () =>
  Date.now().toString(36) + Math.random().toString(36);

export default App;
