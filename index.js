const urlBase = 'http://cop4331bena.xyz/API';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";

const loginButton = document.getElementById('loginForm');
const signupButton = document.getElementById('signupButton');
const searchButton = document.getElementById('searchButton');
const addContactButton = document.getElementById('addContactButton');
const removeContactButton = document.getElementById('removeContactButton');
const editContactButton = document.getElementById('editContactButton');




/* Function to handle login */
function performLogin(event) {
    event.preventDefault(); // Prevent form from submitting the default way
    const data = new FormData(event.target);



    let username = data.get("username")
    let password = data.get("password");

    if (validateForm(username, password)) {
        console.log('Logging in with:', username, password);
        // Add your login API request here
        verifyLogin(username,password);

        
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

/* Function to handle sign-up (account creation) */
function performSignup(event) {
    console.log('Creating new account...');
    // Add sign-in logic here
}

/* Function to verify if the user is logged in */
function isLoggedIn() {
    return userId !== 0;
}

/* Wrapper function for displayContacts() to load contacts */
function loadContacts() {
    console.log('Loading contacts...');
    // Get contacts from API and display them
}

/* Will be a function to display the contact table */
function displayContacts() {
    
}

/* Function to search contacts */
function searchContact(event) {
    event.preventDefault();
    
     
    let searchQuery = document.getElementById('searchForm').value;
    console.log('Searching for:', searchQuery);
    // Add search logic
}

function verifyLogin(username, password){
    let data = {
        login: username,
        password: password,
    }


    let url = urlBase + "/LoginContMang." + extension;
	console.log(data);
    // above is not finished
    //sending payload to php
    let payload = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
                //GET THE DATA
			    let userJSON = JSON.parse(xhr.responseText);
                if(userJSON.id == 0){
                    console.log(userID);
                    console.log("Invalid Login");
                    return;
                }
                //populate data
                userID = userJSON.id;
                firstName = userJSON.firstName;
                lastName = userJSON.firstName;
		        window.location.href = "contact.html";
		
                console.log("Login Verified!");
			}
		};
		xhr.send(payload);
	}
	catch(err)
	{
		console.log(err.message);
	}
    
}


/* Function to validate login form */
function validateForm(username, password) {
    return username !== '' && password !== '';
}

/*Function to clear a form */
function clearForm() {

}

/* Function to add a contact */
function addContact() {
    console.log('Adding contact...');
    // Add logic to handle adding a contact

    //Sending payload to PHP 
    let url = urlBase + "/AddContact." + extension;
    let payload = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("Contact Added");
			}
		};
		xhr.send(payload);
	}
	catch(err)
	{
		console.log(err.message);
	}
    loadContacts();
}

/* Function to remove a contact */
function removeContact() {
    
    // Add logic to handle removing a contact
    let contactId = documentById('contactId').value;

    console.log('Removing contact...');

    if(!contactId) {
        alert("Please provide a valid ContactID to remove.");
        return;
    }


    //Sending payload to PHP 
    let url = urlBase + "/DeleteContact." + extension;
    let payload = JSON.stringify(data);
    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("Contact Deleted");
			}
		};
		xhr.send(payload);
	}
	catch(err)
	{
		console.log(err.message);
	}

    loadContacts();
}

/* Function to edit a contact */
function editContact() {
    console.log('Editing contact...');
    // Add logic to handle editing a contact
    

    //Update all previous contact info:
    //TODO: Determine if we want to implement unique ID for a contact,
    //if so then we should update that also.
    let contactId = document.getElementById('contactId').value; 
    
    let updatedName = document.getElementById('updatedName').value;
    let updatedCompany = document.getElementById('updatedCompany').value;
    let updatedEmail = document.getElementById('updatedEmail').value;
    let updatedPhone = document.getElementById('updatedPhone').value;

    console.log("Editing contact info");

    //Make sure user input is valid:
    if(!contactId || !updatedName || !updatedCompany || !updatedEmail || !updatedPhone){
        alert('Please fill in all required fields.')
    }

    //Store all new data:
    let userData = {
        id: contactId,
        name: updatedName,
        company: updatedCompany,
        email: updatedEmail,
        phone: updatedPhone
    };


    //Sending payload to PHP 
    let url = urlBase + "/EditContact." + extension;
    let payload = JSON.stringify(data);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", urk, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                console.log("Contact Edited");
                loadContacts(); 
            }    
        };
        xhr.send(JSON.stringify(data)); 
    }
    catch(err)
    {
        console.log('Error trying to contact:', err.message);
    }
    
    
}

/*Figure out logic behind redirecting user if they press return to login button */

/* Attaching event listeners to buttons */
loginButton.addEventListener('submit', performLogin);
/*
signupButton.addEventListener('click', performSignup);
searchButton.addEventListener('click', searchContact);
addContactButton.addEventListener('click', addContact);
removeContactButton.addEventListener('click', removeContact);
editContactButton.addEventListener('click', editContact);
*/
