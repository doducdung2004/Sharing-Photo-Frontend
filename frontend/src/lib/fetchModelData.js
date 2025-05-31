/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url - The URL to issue the GET request.
 * @returns {Promise<any>} - A promise that resolves to the JSON data from the server.
 */
async function fetchModel(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch model:", error);
    throw error;
  }
}

export default fetchModel;
