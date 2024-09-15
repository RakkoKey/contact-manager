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
    window.location.href = "index.html";
}

/* Function to handle sign-up (account creation) */
function performSignup(event) {
    console.log('Creating new account...');
    // Add sign-in logic here
    window.location.href = "signup.html";
    
    
    /*
    const data = new FormData(event.target);
    let username = data.get("username");
    let password = data.get("password");

    if(validateForm(username, password)){
        console.log('Signing up with:', username, password);
        verifySignUp(username, password);
    }
    else {
        alert('Please enter valid user sign-in credentials.')
    }
    */
}

function verifySignUp(username, password){
    let data = {
        login: username,
        password: password,
    }


    let url = urlBase + "/SignUpContMang." + extension;
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

/* Function to verify if the user is logged in */
function isLoggedIn() {
    return userId !== 0;
}

/* Wrapper function for displayContacts() to load contacts */
function loadContacts() {
    console.log('Loading contacts...');
    // Get contacts from API and display them
    /*const storedContacts = localStorage.getItem("contacts");
    if(storedContacts) {
        contacts = JSON.parse(storedContacts);
    }
    return displayContacts(storedContacts);
    */
    let url = urlBase + "/GetContacts." + extension; // Adjust this endpoint to match API

    let data = { userId: userID };
    let payload = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.contacts) {
                    displayContacts(response.contacts);
                } else {
                    console.log('No contacts found.');
                }
            }
        };
        xhr.send(payload);
    } catch (err) {
        console.log(err.message);
    }
}

/* Will be a function to display the contact table */
function displayContacts(contacts) { //the contacts to display

    //we want to get the element that holds all the contacts
    const contactsTable = document.getElementById('contactTable');

    // clear placeholders
    contactsTable.innerHTML = '';
    
    if (!contacts || contacts.length === 0){
        let emptyMessage = document.createElement('tr');
        let emptyData = document.createElement('td');
        emptyData.colSpan = 5;
        emptyData.textContent = "No contacts to be displayed.";
        emptyMessage.appendChild(emptyData);
        contactsTable.appendChild(emptyMessage);
        return;
    }
    
    //for loop that loops through array
    for(let i = 0; i < contacts.length; i++){
        //var newContactRow = document.createElement("tr");
        let contact = contacts[i];

        //new row for each contact
        let newContactRow = document.createElement("tr");
        
        //create the table data
        let name = document.createElement("td");
        let address = document.createElement("td");
        let email = document.createElement("td");
        let phoneNumber = document.createElement("td");

        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");
        let addButton = document.createElement("button");

        editButton.textContent = 'Edit Contact';
        deleteButton.textContent = 'Delete Contact';
        addButton.textContent = 'Add Contact';

        editButton.addEventListener('click', function edit() {
            //add logic for editing contact
            
            editContact(contact);
        });
        
        deleteButton.addEventListener('click',function del() {
            //remove contact from database
            //removeContact(contacts[i]);
            //TODO: finish this
            //delete contact from DOM
            removeContact(contact);
        });

        addButton.addEventListener('click', function add() {

            addContact(contact);

        });

        /*
        //combining the first and last name into one string
        let nameString = contacts[i].firstName + " " + contacts[i].lastName;
        //populate the table data
        name.innerHTML = nameString;
        address.innerHTML = contacts[i].address;
        email.innerHTML = contacts[i].email;
        phoneNumber.innerHTML = contacts[i].phoneNumber;

        //put the new data onto the website
        newContactRow.append(name, address, email, phoneNumber, deleteButton);
        contactsTable.appendChild(newContactRow);
        */
        let nameString = contact.firstName + " " + contact.lastName;
        name.innerHTML = nameString;
        address.innerHTML = contact.address;
        email.innerHTML = contact.email;
        phoneNumber.innerHTML = contact.phoneNumber;

        newContactRow.append(name, address, email, phoneNumber, editButton, deleteButton);
        contactsTable.appendChild(newContactRow);

    }
}

/* Function to search contacts */
function searchContact(event) {
    event.preventDefault();
    
     
    let searchQuery = document.getElementById('searchForm').value;

    if(!searchQuery) {
        alert('Please enter valid search.');
        return;
    }
    console.log('Searching for:', searchQuery);
    // Add search logic
    let url = urlBase + "/SearchContacts." + extension;
    let data = {query: searchQuery};
    let payload = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200){
                let response = JSON.parse(xhr.responseText);

                if(response.contacts) {
                    displayContacts(response.contacts);
                }
                else {
                    alert('Contact not found.');
                }
            }
        };
        xhr.send(payload);
    } 
    catch (err) {
        console.log(err.message);
    }

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
function addContact(event) {
    console.log('Adding contact...');
    // Add logic to handle adding a contact
    event.preventDefault();
    const data = new FormData(event.target);

    let contactName = data.get("name");
    let contactAddress = data.get("address");
    let contactEmail = data.get("email");
    let contactPhone = data.get("phone");

    if(!contactName || !contactAddress || !contactPhone || !contactEmail) {
        alert('Please enter all contact details.');
        return;
    }

    let contactData = {
        name: contactName,
        address: contactAddress,
        email: contactEmail,
        phone: contactPhone
    };

    //Sending payload to PHP 
    let url = urlBase + "/AddContact." + extension;
    let payload = JSON.stringify(contactData);

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
                loadContacts();
			}
		};
		xhr.send(payload);
	}
	catch(err)
	{
		console.log(err.message);
	}
    
}

/* Function to remove a contact */
function removeContact() {
    
    // Add logic to handle removing a contact
    //let contactId = documentById('contactId').value;
    let contactPhone = documentById('contactPhone').value;
    let contactFirstName = documentById('contactFirstName').value;
    let contactLastName = documentById('contactLastName').value;

    if (confirm("Are you sure you want to delete ${contact.firstName} ${contact.lastName}? ")) {
        
        console.log('Removing contact...');

        let contactData = {
        firstName: contactFirstName,
        lastName: contactLastName,
        phone: contactPhone
        
        };


        //Sending payload to PHP 
        let url = urlBase + "/DeleteContact." + extension;
        let payload = JSON.stringify(contactData);
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
                    loadContacts();
			    }
		    };
		    xhr.send(payload);
	    }
	    catch(err)
	    {
		    console.log(err.message);
	    }

    
    }   
    

}

/* Function to edit a contact */
function editContact() {
    // Add logic to handle editing a contact
    

    //Update all previous contact info:
    //TODO: Determine if we want to implement unique ID for a contact,
    //if so then we should update that also.
    //let contactId = document.getElementById('contactId').value; 
    

    //let updatedName = document.getElementById('updatedName').value;
    //let updatedAddress = document.getElementById('updatedAddress').value;
    //let updatedEmail = document.getElementById('updatedEmail').value;
    //let updatedPhone = document.getElementById('updatedPhone').value;


    let updatedName = prompt("Enter a new name:", contact.firstName + " " + contact.lastName);
    let updatedAddress = prompt("Enter a new addres", contact.address);
    let updatedEmail = prompt("Enter a new email", contact.email);
    let updatedPhone = prompt("Enter a new phone number", contact.phoneNumber);
    

    let updatedContactData = {
        name: updatedName || (contact.firstName + " " + contact.lastName),
        address: updatedAddress || contact.address,
        email: updatedEmail || contact.email,
        phone: updatedPhone || contact.phoneNumber
    }
    
    //Process if data fields are empty, 
    //if so then enable user to add to the data object.
    /*if(updatedName) {
        contactData.name = updatedName;
    }

    if(updatedAddress) {
        contactData.address = updatedAddress;
    }

    if(updatedEmail) {
        contactData.email = updatedEmail;
    }
    if(updatedPhone) {
        contactData.phone = updatedPhone;
    }
    */



    //Sending payload to PHP 
    let url = urlBase + "/EditContact." + extension;
    let payload = JSON.stringify(updatedContactDatadata);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
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
        xhr.send(payload); 
    }
    catch(err)
    {
        console.log('Error trying to edit contact:', err.message);
    }
    
    
}

/*Figure out logic behind redirecting user if they press return to login button */

/* Attaching event listeners to buttons */
loginButton.addEventListener('submit', performLogin);
signupButton.addEventListener('click', performSignup);
searchButton.addEventListener('click', searchContacts);
addContactButton.addEventListener('click', addContact);
//removeContactButton.addEventListener('click', removeContact);
//editContactButton.addEventListener('click', editContact);
/*
searchButton.addEventListener('click', searchContact);
addContactButton.addEventListener('click', addContact);
removeContactButton.addEventListener('click', removeContact);
editContactButton.addEventListener('click', editContact);
*/