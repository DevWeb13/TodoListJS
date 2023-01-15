import { fetchJSON } from "./function/api.js";
import { createElement } from "./function/dom.js";

try {
  const todos = await fetchJSON('https://jsonplaceholder.typicode.com/todos?_limit=5')
}
catch (e) {
  const alertElement = createElement('div', {
    class: 'alert alert-danger m-2',
    role: 'alert'
  })
  alertElement.innerText = 'Unable to retrieve the elements'
  document.body.prepend(alertElement)
}