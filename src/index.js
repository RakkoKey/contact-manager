const urlBase = 'http://cop4331bena.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

/* Function to handle login */
function performLogin(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (validateForm(username, password)) {
        console.log('Logging in with:', username, password);
        // Add your login API request here
    } else {
        alert('Please enter a valid username and password.');
    }
}

/* Function for logout */
function performLogout() {
    console.log('Logging out...');
    userId = 0;
    firstName = "";
    lastName = "";
    // Add more logic to clear user session and redirect
}

/* Function to handle sign-in (account creation) */
function performSignin(event) {
    console.log('Creating new account...');
    // Add sign-in logic here
}

/* Function to verify if the user is logged in */
function isLoggedIn() {
    return userId !== 0;
}

/* Function to load contacts */
function loadContacts() {
    console.log('Loading contacts...');
    // Get contacts from API and display them
}

/* Function to search contacts */
function searchContact(event) {
    event.preventDefault();
    
     
    let searchQuery = document.getElementById('searchInput').value;
    console.log('Searching for:', searchQuery);
    // Add search logic
}

/* Function to validate login form */
function validateForm(username, password) {
    return username !== '' && password !== '';
}

/* Function to add a contact */
function addContact() {
    console.log('Adding contact...');
    // Add logic to handle adding a contact
}

/* Function to remove a contact */
function removeContact() {
    console.log('Removing contact...');
    // Add logic to handle removing a contact
}

/* Function to edit a contact */
function editContact() {
    console.log('Editing contact...');
    // Add logic to handle editing a contact
}

/* Attaching event listeners to buttons */
document.getElementById('loginButton').addEventListener('click', performLogin);
document.getElementById('signupButton').addEventListener('click', performSignin);
document.getElementById('searchButton').addEventListener('click', searchContact);
document.getElementById('addContactButton').addEventListener('click', addContact);
document.getElementById('removeContactButton').addEventListener('click', removeContact);
document.getElementById('editContactButton').addEventListener('click', editContact);
