const form = document.querySelector("form");
const name = document.querySelector("#name");
const cost = document.querySelector("#cost");
const error = document.querySelector("#error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validations
  if (name.value && cost.value && /^\d+$/.test(cost.value)) {
    const item = {
      name: name.value,
      cost: parseInt(cost.value),
    };

    // Inserting a new document in the firestore database
    db.collection("budget-planner")
      .add(item)
      .then((res) => {
        name.value = "";
        cost.value = "";
      });

    error.textContent = "";
  } else {
    error.textContent = "Please enter the above values";
  }
});
