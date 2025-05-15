function validateForm(event) {
    console.log("Validating form...");
    const petType = document.querySelector('input[name="petType"]:checked');
    const breedOption = document.getElementById('breedOption').value;
    const breed = document.getElementById('breed').value.trim();
    const petAge = document.getElementById('age').value; 
    const gender = document.querySelector('input[name="gender"]:checked');
    
    const otherDogs = document.getElementById('otherDogs').checked;
    const otherCats = document.getElementById('otherCats').checked;
    const smallKids = document.getElementById('smallKids').checked;
    const none = document.getElementById('none').checked;
    const atLeastOneChecked = otherDogs || otherCats || smallKids || none;

    let errorMessage = "";

    if(none && (otherDogs || otherCats || smallKids)){
        errorMessage += "You cannot select 'None' and any other option at the same time.\n";
    }

    if (!petType) {
        errorMessage += "Please select a pet type (Dog or Cat).\n";
    }

    if (breed === "" && breedOption === 'specify') {
        errorMessage += "Please specify a breed.\n";
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
    } else {
        alert("Form submitted successfully!");
    }
}

function toggleBreedInput() {
    const breedOption = document.getElementById('breedOption').value;
    const breedLabel = document.getElementById('breedLabel');
    if (breedOption === 'specify') {
        breedLabel.style.display = 'block';
    } else {
        breedLabel.style.display = 'none';
        document.getElementById('breed').value = ''; // Clear the input if hidden
    }
}