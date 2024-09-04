// These variables will eventually come from your JavaScript logic
const variableNombre = "John Doe";
const variableMail = "johndoe@example.com";
const variableFoto = "https://example.com/profile.jpg";

// Function to send data to the PHP file and display the result
function displayData() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "display.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if (this.status === 200) {
            document.getElementById("result").innerHTML = this.responseText;
        }
    };

    const data = `nombre=${encodeURIComponent(variableNombre)}&mail=${encodeURIComponent(variableMail)}&foto=${encodeURIComponent(variableFoto)}`;
    xhr.send(data);
}

// Call the function to display the data
displayData();
