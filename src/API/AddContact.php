<?php
    $inData = getRequestInfo();

    $firstName = $inData["first_name"];
    $lastName = $inData["last_name"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $address = $inData["address"];
    $userId =  $inData["userId"];

    $conn = new mysqli("localhost???", "ContactMangerUser", "ContactManagerPassword", "ContactManager");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (UserId, FirstName, LastName, Email, Phone, HomeAddress) VALUES(?,?,?,?,?,?)");
        $stmt->bind_param("ssssss", $userId, $firstName, $lastName, $email, $phone, $address);
        $stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
    }


    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>