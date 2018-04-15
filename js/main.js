function redirectRegisterPage(event){
    event.preventDefault()
    history.pushState({
        id: 'homepage'
    }, 'Home | My App', 'http://localhost:9000/views/register.html');
}

function validateLoginForm(){
    var x = document.forms["loginForm"]
    if (x == "") {
        alert("Name must be filled out");
        return false;
    }
}