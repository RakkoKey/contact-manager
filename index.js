const urlBase = 'http://cop4331bena.xyz/API';
const extension = 'php';

var userID = 0;
var firstName = "";
var lastName = "";


const loginButton = document.getElementById('loginForm');
const signupButton = document.getElementById('signupButton');
const searchButton = document.getElementById('searchButton');
const addContactButton = document.getElementById('addButton');
const removeContactButton = document.getElementById('removeButton');
const editContactButton = document.getElementById('editButton');

//forms
const addForm = document.getElementById("addContact");




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

function performSignup(){
    window.location.href = "signup.html";
}

function verifySignUp(username, password){
    let data = {
        login: username,
        password: password,
    }


    let url = urlBase + "/SignUpContMang." + extension;
	console.log(data);
    
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

                saveCookie();

		        window.location.href = "contact.html";
		
                console.log("Login Verified!");
                console.log(document.cookie);
			}
		};
		xhr.send(payload);
	}
	catch(err)
	{
		console.log(err.message);
	}
    
}

//save userID
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userID + ";expires=" + date.toGMTString();
    console.log(document.cookie);
}
function readCookie()
{
	userID = -1;
	let data = document.cookie;
    console.log(document.cookie);
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userID = parseInt( tokens[1].trim() );
		}
	}
	
	if( userID < 0 )
	{
		window.location.href = "index.html";
	}
}

/* Wrapper function for displayContacts() to load contacts */
function loadContacts() {
    console.log('Loading contacts...');
    // Get contacts from API and display them
   
    let url = urlBase + "/GetContact." + extension; // Adjust this endpoint to match API

    let data = { userID: userID };
    let payload = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                
                if(response.results){
                    displayContacts(response.results);
                }else {
                    console.log(response);
                    console.log('No contacts found.');
                    contacts = [];
                    displayContacts([]);
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
        emptyData.colSpan = 4;
        emptyData.textContent = "No contacts to be displayed.";
        emptyMessage.appendChild(emptyData);
        contactsTable.appendChild(emptyMessage);
        return;
    }
    
    //for loop that loops through array
    for(let i = 0; i < contacts.length; i++){
        let contact = contacts[i];

        //new row for each contact
        let newContactRow = document.createElement("tr");
        
        //create the table data
        let name = document.createElement("td");
        let address = document.createElement("td");
        let email = document.createElement("td");
        let phoneNumber = document.createElement("td");
        let buttons = document.createElement("td");

        let editButton = document.createElement("button");
        editButton.innerHTML = "Edit";

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        buttons.append(editButton, deleteButton);
       // let addButton = document.createElement("addButton");

        //editButton.textContent = 'Edit Contact';
        //deleteButton.textContent = 'Delete Contact';
        //addButton.textContent = 'Add Contact';
        
        editButton.addEventListener('click', function edit() {
            //add input fields under respective boxes
            let newName = document.createElement("input");
            newName.setAttribute("type","text");
            name.appendChild(newName);
            

            let newAddress = document.createElement("input");
            newAddress.setAttribute("type","text");
            address.appendChild(newAddress);

            let newEmail = document.createElement("input");
            newEmail.setAttribute("type","text");
            email.appendChild(newEmail);


            let newPhone = document.createElement("input");
            newPhone.setAttribute("type","text");
            phoneNumber.appendChild(newPhone);

            let submitButton = document.createElement("button");
            submitButton.innerHTML = "Submit";
            submitButton.addEventListener('click', function(){
                console.log("test");
                editButton.disabled = false;
                
                editContact(newName.value, newAddress.value, newEmail.value, newPhone.value);
                //remove everything

                newName.remove();
                newAddress.remove()
                newEmail.remove();
                newPhone.remove();
                submitButton.remove();
            })
            editButton.disabled = true;


            buttons.append(submitButton)


            
        });
        
        deleteButton.addEventListener('click',function del() {
            //remove contact from database
            //removeContact(contacts[i]);
            //TODO: finish this
            //delete contact from DOM
            removeContact(contact);
        });

    

        let nameString = contact.firstName + " " + contact.lastName;
        name.innerHTML = nameString;
        address.innerHTML = contact.address;
        email.innerHTML = contact.email;
        phoneNumber.innerHTML = contact.phoneNumber;

        //newContactRow.append(name, address, email, phoneNumber, editButton, deleteButton);
        newContactRow.append(name, address, email, phoneNumber, buttons);
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
    let url = urlBase + "/SearchContact." + extension;
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
                lastName = userJSON.lastName;
                saveCookie();
                
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
    let contactFirstName = data.get("firstName");
    let contactLastName = data.get("lastName");
    let contactEmail = data.get("email");
    let contactPhone = data.get("phone");
    let contactAddress = data.get("address");
    
    
    if(!contactFirstName || !contactLastName || !contactAddress || !contactPhone || !contactEmail) {
        alert('Please enter all contact details.');
        
        return;
    }
    console.log(contactFirstName + contactLastName + contactEmail + contactPhone + contactAddress);
    let contactData = {
        firstName: contactFirstName,
        lastName: contactLastName,
        email: contactEmail,
        phoneNumber: contactPhone,
        address: contactAddress,
        userID: userID,
    }

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
function removeContact(contact) {

    if(!contact) {
        alert("Contact not found.");
        return;
    }
        
    console.log("Removing contact: ", contact);
        

    let contactData = {
        userID: userID,
        email: contact.email,
        address: contact.address,
        phoneNumber: contact.phoneNumber,
        firstName: contact.firstName,
        lastName: contact.lastName,
    }


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

/* Function to edit a contact */
function editContact(newName, newAddress, newEmail, newPhone) {
    // Add logic to handle editing a contact
    

    //Update all previous contact info:
    //TODO: Determine if we want to implement unique ID for a contact,
    //if so then we should update that also.
    //let contactId = document.getElementById('contactId').value; 
    

    let updatedContactData = {
        name: newName,
        address: newAddress,
        email: newEmail,
        phone: newPhone,
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
    let payload = JSON.stringify(updatedContactData);
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

document.addEventListener('DOMContentLoaded', function(){
    if(loginButton){
        loginButton.addEventListener('submit', performLogin)
    }
    if(searchButton){
        searchButton.addEventListener('submit', searchContact);
    }
    if(signupButton){
        signupButton.addEventListener('click', performSignup);
    }
    if(addContactButton){
        addContactButton.addEventListener('click', function(){
            addForm.classList.remove("hidden");
            addForm.addEventListener('submit', function openForm(e){
                addContact(e);
                addForm.removeEventListener('submit', openForm);
                addForm.classList.add('hidden');
            });
        });
    }
    readCookie();
    if(userID > 0){
        loadContacts();
    }
})


