import { createElement } from "../function/dom.js";

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
   * @type {Function} onSubmit
   * @param   {SubmitEvent}  e
   */
  #onSubmit = (e) => {
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
    form.reset()
  }

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
    element.innerHTML = `<form class="d-flex pb-4">
    <input required="" class="form-control" type="text" placeholder="Acheter des patates..." name="title"
      data-com.bitwarden.browser.user-edited="yes">
    <button class="btn btn-primary">Ajouter</button>
  </form>
  <main>
    <div class="btn-group mb-4" role="group">
      <button type="button" class=" btn btn-outline-primary active" data-filter="all">Toutes</button>
      <button type="button" class=" btn btn-outline-primary" data-filter="todo">A faire</button>
      <button type="button" class=" btn btn-outline-primary" data-filter="done">Faites</button>
    </div>

    <ul class="list-group">
    </ul>
  </main>`

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

  /** @type {Todo} */
  constructor(todo) {
    const id = `todo-${todo.id}`
    const li = createElement('li', {
      class: 'todo list-group-item d-flex align-items-center'
    })
    this.#element = li
    const checkbox = createElement('input', {
      class: 'form-check-input',
      type: 'checkbox',
      id: `todo-${todo.id}`,
      checked: todo.completed ? '' : null
    })
    const label = createElement('label', {
      class: 'ms-2 form-check-label',
      for: `todo-${todo.id}`
    })
    label.innerText = todo.title
    const deleteButton = createElement('label', {
      class: 'ms-auto btn btn-danger btn-sm'
    })
    const deleteIcon = createElement('i', {
      class: 'bi-trash'
    })
    deleteButton.append(deleteIcon)
    li.append(checkbox, label, deleteButton)
    this.toggle(checkbox)
    deleteButton.addEventListener('click', (e) => this.remove(e))
    checkbox.addEventListener('change', (e) => this.toggle(e.currentTarget))
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
  }
}