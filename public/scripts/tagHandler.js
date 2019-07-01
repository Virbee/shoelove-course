const tagAPI = axios.create({ baseURL: "/" });

document.getElementById("new-tag-form").onsubmit = function(evt) {
  evt.preventDefault();
  const label = document.querySelector("#new-tag-form input[name=label]").value;
  console.log(label);
  tagAPI
    .post("/api/tag", { label })
    .then(() => {
      const tagList = document.getElementById("secondary_category");
      tagList.innerHTML =
        `<option value="` + label + `">` + label + `</option>`;
    })
    .catch(err => {
      console.log(err);
    });
};
