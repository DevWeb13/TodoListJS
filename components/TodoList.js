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
   *
   * @param   {Todo[]}  todos  [todos description]
   */
  constructor(todos) {
    this.#todos = todos
  }

  /**   
   * @param   {HTMLElement}  element  
   *
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

    // @ts-ignore
    this.#listElement = element.querySelector('.list-group')
    for (const todo of this.#todos) {
      const todoListItem = new TodoListItem(todo)
      if (this.#listElement) {
        // @ts-ignore
        this.#listElement.append(todoListItem.element)
      }

    }
    // @ts-ignore
    element.querySelector('form').addEventListener('submit', (e) => this.onSubmit(e))
  }

  /**
   * @param   {SubmitEvent}  e  
   */
  onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    // @ts-ignore
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
    // @ts-ignore
    this.#listElement.prepend(item.element)
    // @ts-ignore
    form.reset()
  }

}

class TodoListItem {

  #element

  /** @type {Todo} */
  constructor(todo) {
    const li = createElement('li', {
      class: 'todo list-group-item d-flex align-items-center'
    })
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

    // @ts-ignore
    deleteButton.addEventListener('click', (e) => this.remove(e))

    this.#element = li
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

}