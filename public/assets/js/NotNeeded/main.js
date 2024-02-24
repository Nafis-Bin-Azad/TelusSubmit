document
  .getElementById("telus-data")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = {};

    // Iterate over all form elements
    for (let element of form.elements) {
      if (element.name) {
        formData[element.name] = element.value;
      }
    }

    try {
      // Sending data to Firestore
      const docRef = await addDoc(collection(db, "orders"), formData);

      form.reset();

      alert("Data submitted successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to submit data. Please try again.");
    }
  });

const loadDataBtn = document.getElementById("load-data-btn");
const tableContainer = document.getElementById("data-table-container");

loadDataBtn.addEventListener("click", async () => {
  const querySnapshot = await getDocs(collection(db, "orders"));

  // Clear previous table if any
  tableContainer.innerHTML = "";

  // Create a table element
  const table = document.createElement("table");
  table.className = "table"; // If using Bootstrap or similar

  // Create header row
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
                       </tr>`;
  thead.innerHTML = headerRow;
  table.appendChild(thead);

  // Create body of the table
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
  tableContainer.appendChild(table);
});

async function deleteDocument(docId) {
  try {
    await deleteDoc(doc(db, "orders", docId));
    alert("Document successfully deleted");
    // Optionally, refresh your table here to reflect the deletion
  } catch (e) {
    console.error("Error deleting document: ", e);
    alert("Failed to delete the document.");
  }
}

// Add event listeners to delete buttons after the table is generated
document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const docId = this.getAttribute("data-id");
    deleteDocument(docId);
  });
});

document
  .getElementById("telus-data")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const docId = document.getElementById("doc-id").value;
    const formData = {};

    // Iterate over all form elements
    for (let element of form.elements) {
      if (element.name) {
        formData[element.name] = element.value;
      }
    }

    try {
      if (docId) {
        // Update existing document
        const docRef = doc(db, "orders", docId);
        await updateDoc(docRef, formData);
        alert("Data updated successfully!");
      } else {
        // Add new document
        await addDoc(collection(db, "orders"), formData);
        alert("Data submitted successfully!");
      }

      form.reset();
      document.getElementById("doc-id").value = ""; // Reset hidden docId
      // Optional: Refresh your main table data here...
    } catch (e) {
      console.error("Error with document operation: ", e);
      alert("Failed to submit data. Please try again.");
    }
  });

function populateFormForEdit(data, docId) {
  // Iterate over the data object
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      // Find the form field with the same ID as the key
      let field = document.getElementById(key);
      if (field) {
        field.value = data[key];
      }
    }
  }

  // Set the hidden document ID
  document.getElementById("doc-id").value = docId;
}

// Add event listeners to edit buttons in your table
document.querySelectorAll(".edit-btn").forEach((button) => {
  button.addEventListener("click", async function () {
    const docId = this.getAttribute("data-id");
    // Fetch the existing document data
    const docRef = doc(db, "orders", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      populateFormForEdit(docSnap.data(), docId);
    } else {
      console.log("No such document!");
    }
  });
});
