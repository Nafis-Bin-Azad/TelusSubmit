import {
  onGetOrders,
  saveOrder,
  deleteOrder,
  getOrder,
  updateOrder,
} from "./firebase.js";

const orderForm = document.getElementById("order-form");
const ordersContainer = document.getElementById("orders-container");

let editStatus = false;
let id = "";

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetOrders((querySnapshot) => {
    ordersContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const order = doc.data();
      ordersContainer.innerHTML += `
          <div class="card card-body mt-2 border-primary">
            <h3 class="h5">${order.title}</h3>
            <p>${order.description}</p>
            <div>
              <button class="btn btn-primary btn-delete" data-id="${doc.id}">
                🗑 Delete
              </button>
              <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
                🖉 Edit
              </button>
            </div>
          </div>`;
    });

    const btnsDelete = ordersContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        try {
          await deleteOrder(dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = ordersContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getOrder(e.target.dataset.id);
          const order = doc.data();
          orderForm["order-title"].value = order.title;
          orderForm["order-description"].value = order.description;

          editStatus = true;
          id = doc.id;
          orderForm["btn-order-form"].innerText = "Update";
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = orderForm["order-title"];
  const description = orderForm["order-description"];

  try {
    if (!editStatus) {
      await saveOrder(title.value, description.value);
    } else {
      await updateOrder(id, {
        title: title.value,
        description: description.value,
      });

      editStatus = false;
      id = "";
      orderForm["btn-order-form"].innerText = "Save";
    }

    orderForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});
