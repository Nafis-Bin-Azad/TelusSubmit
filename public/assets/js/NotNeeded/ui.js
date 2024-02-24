// Form submission event listener
document
  .getElementById("telus-data")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const form = event.target;
    const docId = document.getElementById("doc-id").value;
    const formData = extractFormData(form);

    if (docId) {
      updateDocument("orders", docId, formData);
    } else {
      addDocument("orders", formData);
    }

    form.reset();
    document.getElementById("doc-id").value = "";
  });

// Function to extract form data
function extractFormData(form) {
  const formData = {};
  for (let element of form.elements) {
    if (element.name) {
      formData[element.name] = element.value;
    }
  }
  return formData;
}

// Load data button event listener
loadDataBtn.addEventListener("click", async () => {
  const querySnapshot = await fetchAllDocuments("orders");
  createDataTable(querySnapshot, tableContainer);
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

// Function to bind event listeners to delete and edit buttons
function bindDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const docId = this.getAttribute("data-id");
      deleteDocument("orders", docId);
    });
  });
}

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
