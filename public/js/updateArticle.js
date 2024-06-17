const inputImage = document.getElementById("img");
const previewImage = document.getElementById("previewImage");
const form = document.querySelector("form");

const cloudName = "dzcuoxidd";
const presetName = "mxvteo84";

function showImage(image) {
  previewImage.src = image;
}
inputImage.addEventListener("change", (event) => {
  const selectedImage = event.target.files[0];
  const readerFile = new FileReader();

  readerFile.addEventListener("load", (e) => {
    showImage(e.target.result);
  });

  readerFile.readAsDataURL(selectedImage);
});

async function uploadImage(image) {
  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", presetName);
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return data.secure_url;
  } catch (error) {
    alert("Le chargement de l'image a echoue");
  }
}

async function updateArticle(article) {
  try {
    const response = await fetch(`/articles/${article.slug}`, {
      method: "POST",
      body: JSON.stringify(article),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.location.href = "/articles";
    }

    console.log(response);
  } catch (error) {}
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const btnSubmit = event.target.querySelector("#btn-submit");
  btnSubmit.disabled = true;

  const formData = new FormData(event.target);

  let urlToImage;
  if (formData.get("img")) {
    urlToImage = await uploadImage(formData.get("img"));
  } else {
    urlToImage = previewImage.src;
  }

  const data = Object.fromEntries(formData.entries());
  data.urlToImage = urlToImage;
  data.slug = btnSubmit.getAttribute(`data-slug`);

  delete data.img;
  updateArticle(data);
  btnSubmit.disabled = false;
  event.target.reset();
});
