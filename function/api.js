/**
 * CustomError is a custom error class that allows storing the cause of the error.
 */
class CustomError extends Error {
  /**
   * The cause of the error
   * @type {unknown}
   */
  cause;

  /**
   * Creates an instance of CustomError.
   * @param {string} message - The error message.
   * @param {unknown} cause - The cause of the error.
   */
  constructor(message, cause) {
    super(message);
    this.cause = cause;
  }
}

/**
 * This function allows to retrieve JSON data from a given url
 * @param {string} url - The url from which data should be retrieved
 * @param {Object} options - The options of the request
 */
export async function fetchJSON(url, options = {}) {
  const headers = { Accept: 'application/json', ...options.headers }
  const r = await fetch(url, { ...options, headers })
  if (r.ok) {
    return r.json()
  }
  throw new CustomError('Server Error', r);
}


