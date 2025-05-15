function  validateForm(event){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(!username || !password){
        event.preventDefault();
        alert('All fields are required. Please fill in all fields.');
        return;
    }
    
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const validChars = /^[a-zA-Z0-9]{4,}$/;
    const hasLetter = /[a-zA-Z]/;
    const hasDigit = /\d/;

    if (!usernameRegex.test(username)){
        event.preventDefault();
        alert('Username can only contain letters and digits. Try again.');
        return;
    }

    if (!validChars.test(password) || !hasLetter.test(password) || !hasDigit.test(password)){
        event.preventDefault();
        alert('Password rules were not followed. Try again.');
        return;
    }
}