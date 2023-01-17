import { cloneTemplate } from "../function/dom.js";

/**
 * @typedef {Object} Todo
 * @property {string} title
 * @property {boolean} completed
 * @property {number} id
 */

export class TodoList {
  /**
   * @type {Todo[]}
   */
  #todos = []

  /**
   * @type {HTMLUListElement[]}
   */
  #listElement = []



  /**
   *
   * @param   {Todo[]}  todos  [todos description]
   */
  constructor(todos) {
    this.#todos = todos
  }

  /**   
   * @param   {HTMLElement}  element  
   */
  appendTo(element) {
    element.append(
      cloneTemplate('todoTemplate')
    )


    this.#listElement = element.querySelector('.list-group')
    for (const todo of this.#todos) {
      const todoListItem = new TodoListItem(todo)
      if (this.#listElement) {
        this.#listElement.append(todoListItem.element)
      }
    }
    element.querySelector('form').addEventListener('submit', (e) => this.#onSubmit(e))
    element.querySelectorAll('.btn-group button').forEach(button => {
      button.addEventListener('click', (e) => this.#toggleFilter(e))
    })

    this.#listElement.addEventListener('delete', ({ detail: todo }) => {
      this.#todos = this.#todos.filter(t => t !== todo)
      this.#onUpdate()
    });

    this.#listElement.addEventListener('toggle', ({ detail: todo }) => {
      todo.completed = !todo.completed
      this.#onUpdate()
    });
  }

  /**
   * @param   {SubmitEvent}  e
   */
  #onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget

    const title = new FormData(form).get('title')?.toString()
    if (title === '') {
      return
    }
    const todo = {
      title,
      completed: false,
      id: Date.now()
    }
    const item = new TodoListItem(todo)
    this.#listElement.prepend(item.element)
    this.#todos.push(todo)
    this.#onUpdate()
    form.reset()
  }

  #onUpdate() {
    localStorage.setItem('todos', JSON.stringify(this.#todos))
  }

  /** @param {Event} e */
  #toggleFilter(e) {
    e.preventDefault()
    const filter = e.currentTarget?.getAttribute('data-filter')
    e.currentTarget?.parentElement.querySelectorAll('button').forEach(button => {
      button.classList.remove('active')
    })
    e.currentTarget?.classList.add('active')
    if (filter === 'todo') {
      this.#listElement.classList.add('hide-completed')
      this.#listElement.classList.remove('hide-todo')
    } else if (filter === 'done') {
      this.#listElement.classList.add('hide-todo')
      this.#listElement.classList.remove('hide-completed')
    }
    else {
      this.#listElement.classList.remove('hide-todo')
      this.#listElement.classList.remove('hide-completed')
    }

  }
}

class TodoListItem {

  #element
  #todo

  /** @type {Todo} */
  constructor(todo) {
    this.#todo = todo
    const id = `todo-${todo.id}`
    const li = cloneTemplate('todoItem').firstElementChild

    this.#element = li
    const checkbox = li.querySelector('input')
    checkbox.setAttribute('id', id)
    if (todo.completed) {
      checkbox.setAttribute('checked', '')
    }
    const label = li.querySelector('.form-check-label')
    label.setAttribute('for', id)
    label.innerText = todo.title
    const deleteButton = li.querySelector('.btn-danger')

    this.toggle(checkbox)
    deleteButton.addEventListener('click', (e) => this.remove(e))
    checkbox.addEventListener('change', (e) => this.toggle(e.currentTarget))

    this.#element.addEventListener('delete', (e) => {
      this.#element.remove()
    })


  }

  /**
   * @return  {HTMLElement}    
   */
  get element() {
    return this.#element
  }

  /**
   *
   * @param   {PointerEvent}  e  [e description]
   */
  remove(e) {
    e.preventDefault()
    const event = new CustomEvent('delete',
      {
        detail: this.#todo,
        bubbles: true,
        cancelable: true
      })
    this.#element.dispatchEvent(event)
    if (event.defaultPrevented) {
      return
    }
    this.#element.remove()
  }

  /** 
   *  Change the state of the todo
   * @param {HTMLInputElement} checkbox
   * 
   */
  toggle(checkbox) {
    if (checkbox.checked) {
      this.#element.classList.add('is-completed')
    } else {
      this.#element.classList.remove('is-completed')
    }
    const event = new CustomEvent('toggle',
      {
        detail: this.#todo,
        bubbles: true
      })
    this.#element.dispatchEvent(event)
  }
}