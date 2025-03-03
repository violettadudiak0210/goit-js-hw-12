import { fetchImages } from "./js/pixabay-api.js";
import { renderImages, clearGallery } from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("#search-form");
const loader = document.querySelector(".loader");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector("#load-more");

let query = "";
let page = 1;
const PER_PAGE = 40;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  query = event.target.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.error({ title: "Error", message: "Please enter a search query!" });
    return;
  }

  clearGallery();
  page = 1;
  loader.style.display = "block";
  loadMoreBtn.style.display = "none"; 

  try {
    const { images, totalHits } = await fetchImages(query, page);

    if (images.length > 0) {
      renderImages(images);
      iziToast.success({ title: "Success", message: "Images loaded!" });

      if (totalHits > PER_PAGE) {
        loadMoreBtn.style.display = "block";
      }
    } else {
      iziToast.error({ title: "Error", message: "No images found." });
    }
  } catch (error) {
    iziToast.error({ title: "Error", message: error.message });
  } finally {
    loader.style.display = "none";
    form.reset();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  loader.style.display = "block";

  try {
    const { images, totalHits } = await fetchImages(query, page);

    if (images.length > 0) {
      renderImages(images);
      smoothScroll(); 
    }

    if (page * PER_PAGE >= totalHits) {
      loadMoreBtn.style.display = "none";
      iziToast.info({ title: "Info", message: "No more images to load." });
    }
  } catch (error) {
    iziToast.error({ title: "Error", message: error.message });
  } finally {
    loader.style.display = "none";
  }
});

function smoothScroll() {
  const galleryCard = document.querySelector(".gallery-item");
  if (galleryCard) {
    const cardHeight = galleryCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
}

function showSuccessToast(message) {
  iziToast.success({
    title: "Hi!",
    message: message,
    position: "topRight",
    timeout: 3000,
    transitionIn: "fadeInUp",
    transitionOut: "fadeOutDown",
    close: false,
  });
}

function showErrorToast(message) {
  iziToast.error({
    title: "Oops!",
    message: message,
    position: "topRight",
    timeout: 3000,
    transitionIn: "bounceInLeft",
    transitionOut: "swirlOut",
    close: false,
  });
}

showSuccessToast("Welcome to the cutest gallery ever! 💖");
