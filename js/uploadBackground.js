const input = document.getElementById("loadBackground");
const img = document.getElementById("refImage");

input.addEventListener("change", () => {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    img.src = e.target.result; // Base64 Data URL
  };
  reader.readAsDataURL(file);
});
