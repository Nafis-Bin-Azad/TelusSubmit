// Assuming you have a similar structure in firebase.js for orders
import {
  saveOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  onGetOrders,
} from "./firebase.js";

const orderForm = document.getElementById("order-form");
const ordersContainer = document.getElementById("orders-container");

let editStatus = false;
let id = "";

window.addEventListener("DOMContentLoaded", async () => {
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

// Function to create and append the data table
function createDataTable(querySnapshot, container) {
  // Clear any existing content
  container.innerHTML = "";

  // Create a table element
  const table = document.createElement("table");
  table.className = "table"; // Bootstrap class for styling

  // Create the header row
  const thead = document.createElement("thead");
  let headerRow = `<tr>
                       <th>Representative</th>
                       <th>Date</th>
                       <th>Product</th>
                       <th>Order Number</th>
                       <th>Customer Name</th>
                       <th>Cell No</th>
                       <th>Address</th>
                       <th>Processed Account</th>
                       <th>Date of Installation</th>
                       <th>Actions</th>
                     </tr>`;
  thead.innerHTML = headerRow;
  table.appendChild(thead);

  // Create the table body
  const tbody = document.createElement("tbody");

  querySnapshot.forEach((doc) => {
    let data = doc.data();
    let row = `<tr>
                   <td>${data.representative}</td>
                   <td>${data.date}</td>
                   <td>${data.product}</td>
                   <td>${data.orderNumber}</td>
                   <td>${data.customerName}</td>
                   <td>${data.cellNo}</td>
                   <td>${data.address}</td>
                   <td>${data.processedAccount}</td>
                   <td>${data.dateOfInstallation}</td>
                   <td>
                     <button class="btn btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                     <button class="btn btn-primary edit-btn" data-id="${doc.id}">Edit</button>
                   </td>
                 </tr>`;
    tbody.innerHTML += row;
  });

  table.appendChild(tbody);
  container.appendChild(table);

  // Bind event listeners to the new buttons
  bindDeleteButtons();
  bindEditButtons();
}

// Function to bind event listeners to delete buttons
function bindDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const docId = this.getAttribute("data-id");
      deleteDocument("orders", docId);
    });
  });
}

// Function to bind event listeners to edit buttons
function bindEditButtons() {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      const docId = this.getAttribute("data-id");
      const docSnap = await getDoc(doc(db, "orders", docId));
      if (docSnap.exists()) {
        populateFormForEdit(docSnap.data(), docId);
      } else {
        console.log("No such document!");
      }
    });
  });
}

// Other existing functions like deleteDocument, populateFormForEdit, etc.
