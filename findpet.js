function validateForm(event){

    const petType = document.querySelector('input[name="petType"]:checked');
    const breed = document.getElementById('breed').value;
    const petAge = document.getElementById('pet-age').value;
    const gender = document.querySelector('input[name="preferred-gender"]:checked');
    
    const otherDogs = document.getElementById('other-dogs').checked;
    const otherCats = document.getElementById('other-cats').checked;
    const smallKids = document.getElementById('small-kids').checked;
    const none = document.getElementById('none').checked;
    const atLeastOneChecked = otherDogs || otherCats || smallKids || none;

    let errorMessage = "";

    if (!petType) {
        errorMessage += "Please select a pet type.\n";
    }
    if (breed.trim() === "") {
        errorMessage += "Please enter a breed.\n";
    }
    if (petAge === "Doesn't matter") {
        errorMessage += "Please select a preferred age.\n";
    }
    if (!gender) {
        errorMessage += "Please select a preferred gender.\n";
    }
    if (!atLeastOneChecked) {
        errorMessage += "Please select at least one option for getting along with.\n";
    }

    if (errorMessage) {
        event.preventDefault();
        alert(errorMessage);
    } 
    else {
        alert("Form submitted successfully!");
    }
}