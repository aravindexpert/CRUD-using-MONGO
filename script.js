


// Function to fetch data from the server and display it on the home page
async function fetchData() {
  try {
    const response = await fetch('/data');
    const data = await response.json();
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous data

    data.forEach((item) => {
      const row = tableBody.insertRow();
      const nameCell = row.insertCell();
      const emailCell = row.insertCell();
      const dateCell = row.insertCell(); // Add a cell for the date
      const timeCell = row.insertCell();
      const editCell = row.insertCell();
      const deleteCell = row.insertCell();

      nameCell.textContent = item.name;
      emailCell.textContent = item.email;

      const timestamp = new Date(item.timestamp);
      if (timestamp.toString() !== 'Invalid Date') {
        dateCell.textContent = timestamp.toLocaleDateString(); // Display the date in a human-readable format
        timeCell.textContent = timestamp.toLocaleTimeString(); // Display the time in a human-readable format
      } else {
        dateCell.textContent = 'Invalid Date'; // Display 'Invalid Date' if the timestamp is not in a valid format
        timeCell.textContent = 'Invalid Time'; // Display 'Invalid Time' if the timestamp is not in a valid format
      }

      // Edit button
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editData(item._id, item.name, item.email));
      editCell.appendChild(editButton);

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteData(item._id));
      deleteCell.appendChild(deleteButton);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to handle editing a record
async function editData(id, name, email) {
  const newName = prompt('Enter the new name:', name);
  const newEmail = prompt('Enter the new email:', email);

  if (newName && newEmail) {
    try {
      const response = await fetch(`/data/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });

      const updatedData = await response.json();
      console.log('Record updated successfully:', updatedData);
      fetchData(); // Refresh the data on the page after editing
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
}

// Function to handle deleting a record
async function deleteData(id) {
  const confirmation = confirm('Are you sure you want to delete this record?');

  if (confirmation) {
    try {
      await fetch(`/data/${id}`, {
        method: 'DELETE',
      });

      console.log('Record deleted successfully');
      fetchData(); // Refresh the data on the page after deleting
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
}

// Call fetchData to display data when the page loads
fetchData();


// Function to add event listener to the form submission
document.getElementById('data-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  
  // Check if both name and email are not empty before proceeding
  if (!name || !email) {
    alert('Name and email fields cannot be empty.');
    return;
  }

  // Save data to local storage
  const data = {
    name: name,
    email: email,
  };
  saveToLocalStorage(data);

  // Send data to the server (Node.js) for database storage
  sendDataToServer(data);
});

// Function to save data to local storage
function saveToLocalStorage(data) {
  // Check if data exists in local storage
  let existingData = localStorage.getItem('data');
  if (existingData) {
    existingData = JSON.parse(existingData);
    existingData.push(data);
    localStorage.setItem('data', JSON.stringify(existingData));
  } else {
    localStorage.setItem('data', JSON.stringify([data]));
  }
}

// Function to send data to the server (Node.js) for database storage
async function sendDataToServer(data) {
  try {
    const response = await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const newData = await response.json();
    console.log('Server response:', newData);

    // Data is already saved to local storage, no need to update it again
    // Update the table with the new data immediately
    fetchData();
    return newData;
  } catch (error) {
    console.error('Error sending data to the server:', error);
  }
}
