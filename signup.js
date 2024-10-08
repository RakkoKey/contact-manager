const urlBase = "http://cop4331bena.xyz/API";
const extension = "php";
const signupButton = document.getElementById("signupForm");
const returnToLogin = document.getElementById("returnToLogin");
function signup(event){
    event.preventDefault();
    const data = new FormData(event.target);
    let firstName = data.get("firstName");
    let lastName = data.get("lastName");
    let username = data.get("username");
    let password = data.get("password");
    console.log(firstName);

    if(!firstName || !lastName || !username || !password){
        console.log("Invalid Fields");
        return; 
    }

   var signupdata = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: password,
    }




    //Send stuff to php
    let url = urlBase + "/CreateAccount." + extension;
    let payload = JSON.stringify(signupdata);
    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


    try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log("added to database");
                //go back to login
                window.location.href = "index.html";

			}
		};
		xhr.send(payload);
	}
	catch(err)
	{
		console.log(err.message);
	}

}
signupButton.addEventListener('submit', signup);
returnToLogin.addEventListener('click', function(){
    window.location.href = "index.html"; 
})