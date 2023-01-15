/**
 * It takes a tag name and an object of attributes, and returns a DOM element with those attributes
 * @param {string}tagName - The name of the tag to create.
 * @param {object} attributes - An object containing the attributes to set on the element.
 * @returns {HTMLElement} A function that takes two arguments, tagName and attributes.
 */
export function createElement(tagName, attributes) {
  const element = document.createElement(tagName);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}