import axios from "axios";

const API_KEY = "49140173-4874def0c004e38bcbb22fb6b";
const BASE_URL = "https://pixabay.com/api/";

export async function fetchImages(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  try {
    const response = await axios.get(url);

    if (response.data.hits.length === 0) {
      return Promise.reject(new Error("No images found."));
    }

    return { images: response.data.hits, totalHits: response.data.totalHits };
  } catch (error) {
    throw new Error("Failed to fetch images.");
  }
}