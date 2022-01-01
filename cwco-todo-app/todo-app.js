const {WebComponent, ContextProviderComponent} = window;

class Button extends WebComponent {
  static observedAttributes = ['label', 'disabled', 'aria-label', 'type'];
  type = 'button';
  
  get template() {
    return `
      <button
        class="action-button"
        type="{type}"
        attr.aria-label="{ariaLabel}, ariaLabel"
        attr.disabled="disabled"
        >
        <slot>{label}</slot>
      </button>
    `;
  }
  
  get stylesheet() {
    return `
    <style>
        :host {
          display: inline-block;
        }
        
        :host([disabled]) {
          pointer-events: none;
          cursor: not-allowed;
        }
        
        :host([disabled]) .action-button {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        :host .action-button {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background: #fff;
            border: none;
            border-radius: 3px;
            color: #222;
            cursor: pointer;
            padding: 8px 10px;
            text-transform: capitalize;
            letter-spacing: 0.05rem;
        }
    </style>
  `;
  }
}

class PrimaryButton extends Button {
  get stylesheet() {
    return `
      ${super.stylesheet}
      <style>
          :host .action-button {
              background: #222;
              color: #fff;
          }
      </style>
    `
  }
}

class CTAButton extends Button {
  get stylesheet() {
    return `
      ${super.stylesheet}
      <style>
          :host .action-button {
              background: #0596bf;
              color: #fff;
              font-weight: 500;
          }
      </style>
    `
  }
}

class SearchField extends WebComponent {
  static observedAttributes = ['label', 'placeholder', 'aria-label', 'value'];
  
  template = `
    <label attr.aria-label="{ariaLabel}, ariaLabel">
        <span if="label">{label}</span>
        <input
            type="search"
            placeholder="{placeholder}"
            value="{value}"
            oninput="handleInput($event)"
            onchange="handleChange($event)"
            >
    </label>
  `;
  
  get stylesheet() {
    return `
      <style>
          :host {
            display: inline-block;
          }
          
          :host label span {
            margin-bottom: 5px;
          }
          
          :host input {
            border: none;
            border-radius: 3px;
            box-shadow: 0 0 0 1px #ccc;
            font-size: 1rem;
            padding: 0.5rem 1rem;
            width: 100%;
          }
      </style>
    `
  }
  
  handleInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(new Event('input', {
      detail: event.target.value,
    }));
  }
  
  handleChange(event) {
    this.value = event.target.value;
    this.dispatchEvent(new Event('change', {
      detail: event.target.value,
    }));
  }
  
}

class OutlinedButton extends Button {
  get stylesheet() {
    return `
      ${super.stylesheet}
      <style>
          :host .action-button {
              background: #fff;
              color: #222;
              border: 1px solid #222;
          }
      </style>
    `
  }
}

class TodoItem extends WebComponent {
  static observedAttributes = ['title', 'id', 'completed', 'description'];
  title = 'untitled';
  completed = false;
  
  template = `
    <div class="todo-item">
        <h2>{title}</h2>
        <p class="description">{description}</p>
        <div class="details">
          <p class="status"><strong>Status:</strong>&nbsp;{completed ? 'Done' : 'In Progress'}</p>
          <div class="controls">
              <primary-button onclick="onAction('statuschange', !this.completed)">{completed ? 'move to progress' : 'complete'}</primary-button>
              <outlined-button onclick="onAction('remove')">delete</outlined-button>
              <outlined-button onclick="onAction('edit')">edit</outlined-button>
          </div>
        </div>
    </div>
  `;
  
  get stylesheet() {
    return `
      <style>
        :host {
            display: block;
            background: #f2f2f2;
            padding: 10px;
            border-radius: 3px;
        }
        
        .description {
            border-bottom: 2px solid #fff;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        
        .status {
            margin: 0;
            flex: 1;
            display: flex;
            align-items: center;
        }
        
        .details {
            display: flex;
            width: 100%;
        }
        
        .controls {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            gap: 10px;
        }
       
      </style>
    `
  }
  
  onAction(action, status = null) {
    this.dispatchEvent(new CustomEvent(action, {
      detail: {
        id: this.id,
        completed: status ?? this.completed,
      }
    }));
  }
}

class TodoStore extends ContextProviderComponent {
  static initialContext = {
    todos: [],
    loading: true,
    errorMessage: '',
  };
  
  onMount() {
    const todos = JSON.parse(localStorage.getItem('__todos__'));
    
    if (todos) {
      this.updateContext({
        todos: todos,
        loading: false,
      });
    } else {
      fetch('./todos.json')
        .then(response => response.json())
        .then(res => {
          localStorage.setItem('__todos__', JSON.stringify(res.todos));
          this.updateContext({
            todos: res.todos,
            loading: false,
          });
        })
        .catch(err => {
          localStorage.setItem('__todos__', '[]');
          this.updateContext({
            todos: [],
            loading: false,
            errorMessage: err.message,
          });
        });
    }
  }
  
  updateTodos({detail}) {
    localStorage.setItem('__todos__', JSON.stringify(detail));
    this.updateContext({
      todos: detail,
    });
  }
}

class TodoApp extends WebComponent {
  app = {
    title: 'Todo New App',
    searchTerm: ''
  }
  
  get searchFilteredList() {
    const term = this.app.searchTerm.trim().toLowerCase();
    
    return term.length >= 3
      ? this.$context.todos.filter(todo => todo.title.toLowerCase().includes(term))
      : this.$context.todos;
  }
  
  template = `
    <h1>{app.title}</h1>
    <div class="controls">
      <search-field placeholder="Search..." value="{app.searchTerm}" oninput="onSearchInput($event)"></search-field>
      <cta-button onclick="createTodo()">create todo</cta-button>
    </div>
    <todo-item
      repeat="this.searchFilteredList as $todo"
      id="{$todo.id}"
      title="{$todo.title}"
      description="{$todo.description}"
      completed="{$todo.completed}"
      onstatuschange="updateTodoStatus($event)"
      onremove="removeTodo($event)"
      onedit="editTodo($event)"
      >
    </todo-item>
  `
  
  stylesheet = '<link rel="stylesheet" href="todo-app.css">';
  
  updateTodoStatus(event) {
    this.dispatchEvent(new CustomEvent('updatestore', {
      detail: this.$context.todos.map(t => {
        if (t.id === event.detail.id) {
          t.completed = event.detail.completed;
        }
  
        return t
      })
    }, {
      bubbles: true,
    }));
  }
  
  removeTodo(event) {
    this.dispatchEvent(new CustomEvent('updatestore', {
      detail: this.$context.todos.filter(t => {
        return t.id !== event.detail.id
      })
    }));
  }
  
  editTodo(event) {
    this.dispatchEvent(new CustomEvent('updatestore', {
      detail: this.$context.todos.map(t => {
        if (t.id === event.detail.id) {
          t.title = window.prompt('Enter new title', t.title);
          t.description = window.prompt('Enter new description', t.description);
        }
  
        return t
      })
    }));
  }
  
  createTodo(event) {
    this.dispatchEvent(new CustomEvent('updatestore', {
      detail: [
        ...this.$context.todos,
        {
          id: Math.floor(Math.random() * 100),
          title: window.prompt('Enter new title', 'Default title'),
          description: window.prompt('Enter description', ''),
          completed: false
        }
      ]
    }));
  }
  
  onSearchInput(event) {
    this.app.searchTerm = event.target.value;
  }
  
}

TodoStore.register();
TodoApp.register();
PrimaryButton.register();
CTAButton.register();
OutlinedButton.register();
SearchField.register();
TodoItem.register();