const form = document.querySelector("form");

const cloudName = "dzcuoxidd";
const presetName = "mxvteo84";

// https://api.cloudinary.com/v1_1/<CLOUD_NAME>/image/upload

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

async function addArticle(article){
  try {
    const response = await fetch("/articles", {
      method: "POST", 
      body:JSON.stringify(article),
      headers: {
        "Content-Type": "application/json"
      }
    })
    
    console.log(response);
  } catch (error) {
    
  }
}
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const btnSubmit = event.target.querySelector("#btn-submit");
  btnSubmit.disabled = true;

  const formData = new FormData(event.target);
  const urlToImage = await uploadImage(formData.get("img"));

  const data = Object.fromEntries(formData.entries());
  data.urlToImage = urlToImage;
  delete data.img;
  addArticle(data);
  btnSubmit.disabled = false;
  event.target.reset();
});
