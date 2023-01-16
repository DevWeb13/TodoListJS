/**
 * It takes a tag name and an object of attributes, and returns a DOM element with those attributes
 * @param {string}tagName - The name of the tag to create.
 * @param {object} attributes - An object containing the attributes to set on the element.
 * @returns {HTMLElement} A function that takes two arguments, tagName and attributes.
 */
export function createElement(tagName, attributes) {
  const element = document.createElement(tagName);
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== null && value !== undefined) {
      element.setAttribute(key, value);
    }
  }
  return element;
}

/** *
 * @param   {string}  templateId  [templateId description]
 *
 * @return  {DocumentFragment}     
 */
export function cloneTemplate(templateId) {
  return document.getElementById(templateId).content.cloneNode(true);
}