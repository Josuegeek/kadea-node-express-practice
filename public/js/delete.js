const deleteButton = document.getElementById("delete");

deleteButton.addEventListener("click", async (event) => {
  const confirmation = confirm("Voulez-vous supprimer cet article");

  if (confirmation) {
    
    const slug = event.target.name;
    

    try {
      const response = await fetch(`/articles/${slug}`, { method: "DELETE" });
      if (response.ok) {
        window.location.href = "/articles";
      } else {
        console.error("erreur de la suppression");
      }
    } catch (error) {
      console.error("erreur reseaux:", error);
    }
  }
});
