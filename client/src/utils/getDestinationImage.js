const imageCache = {}; // cache so same destination doesn't re-fetch

export const getDestinationImage = async (destination) => {
  if (imageCache[destination]) return imageCache[destination];

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=56011955-6045dc6be1052d19a3b9a07a2&q=${encodeURIComponent(destination)}&image_type=photo&category=travel&per_page=3&safesearch=true`
    );
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      const url = data.hits[0].webformatURL;
      imageCache[destination] = url; // cache it
      return url;
    }
  } catch (err) {
    console.error("Image fetch failed:", err);
  }

  // Fallback if API fails
  return `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`;
};