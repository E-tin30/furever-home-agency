function validateForm(event) {

    const petName = document.getElementById("petName").value.trim();
    const petType = document.querySelector('input[name="petType"]:checked');
    const breed = document.querySelector('input[name="breed"]:checked');
    const pureName = document.getElementById("pureName").value.trim();
    const mixedName = document.getElementById("mixName").value.trim();
    const age = document.getElementById("age").value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');

    const otherDogs = document.getElementById('other-dogs').checked;
    const otherCats = document.getElementById('other-cats').checked;
    const smallKids = document.getElementById('small-kids').checked;
    const none = document.getElementById('none').checked;
    const atLeastOneChecked = otherDogs || otherCats || smallKids || none;

    const additionalInfo = document.getElementById("additional-info").value.trim();
   
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;

    let errorMessage = "";

    if(petName === ""){
        errorMessage += "Please enter your pet's name.\n";
    }
    if (!petType) {
        errorMessage += "Please select a pet type.\n";
    }
    if (!breed) {
        errorMessage += "Please enter the breed of the pet.\n";
    }
    else if(breed.value === "pure"){
        if(pureName == ""){
            errorMessage += "Please specify the name of the breed of your pet.\n";
        }
        if(mixedName !== ""){
            errorMessage += "You selected pure breed but specified the name of the breed in the mixed breed section. You must fill in the box that correlates to the option you selected.";
        }
    }
    else if(breed.value === "mixed"){
        if(mixedName === ""){
            errorMessage += "Please specify the name of the breed of your pet.\n";
        }
        if(pureName !== ""){
            errorMessage += "You selected mixed breed but specified the name of the breed in the pure breed section. You must fill in the box that correlates to the option you selected.";
        }
    }
    if (age === "Select an age") {
        errorMessage += "Please select the age of your pet.\n";
    }
    if(!gender){
        errorMessage += "Please select gender of your pet.\n";
    }
    if(!atLeastOneChecked){
        errorMessage += "Please select at least one option for gets along with.\n";
    }
    if (additionalInfo === "") {
        errorMessage += "Please provide a description of the pet.\n";
    }
    if (firstName === "") {
        errorMessage += "Please enter your first name.\n";
    }
    if(lastName === ""){
        errorMessage += "Please enter your last name.\n";
    }
    if (!emailPattern.test(email)) {
        errorMessage += "Please enter a valid email address.\n";
    }
    
    if (errorMessage) {
        event.preventDefault();
        alert(errorMessage);
    } 
    else {
        alert("Form submitted successfully!"); 
    }
}