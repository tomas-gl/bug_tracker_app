const URL_API = "http://greenvelvet.alwaysdata.net/bugTracker/api"
var userToken = sessionStorage.getItem("userToken");
var userId = sessionStorage.getItem("userId");

fetch(`${URL_API}/ping`)
    .then((res) => res.json())
    .then(function (response) {
        console.log(response);
    })
    .catch((error) => console.error(error));



$('#register').on('click', function(){
    var user = {
        user_name: $("#input_username").val(),
        password: $("#input_password").val()
    };

    $.ajax({
        type: 'GET',
        url: `${URL_API}/signup/${user.user_name}/${user.password}`,
        data: user,
        dataType: "json",
        success: function(data){
            console.log('success', data);
            window.location.href="index.html"
        },
        error: function(error){
            console.log('error saving user', error);
        }
    })
})

// Login user
function login(){
    var user = {
        user_name: $("#input_username").val(),
        password: $("#input_password").val()
    };

    $.ajax({
        type: 'GET',
        url: `${URL_API}/login/${user.user_name}/${user.password}`,
        data: user,
        dataType: "json",
        success: function(data){
            console.log('success', data.result);
            sessionStorage.setItem("userToken", data.result.token);
            sessionStorage.setItem("userId", data.result.id);
            window.location.href="index.html"
        },
        error: function(error){
            console.log('error login user', error);
        }
    })
}

// Logout user
function logout(){
    $.ajax({
        type: 'GET',
        url: `${URL_API}/logout/${userToken}`,
        data: userToken,
        dataType: "json",
        success: function(data){
            console.log('success', data.result);
            sessionStorage.setItem("userToken", null);
            window.location.href="login.html"
        },
        error: function(error){
            console.log('error loggin-out user', error);
        }
    }) 
}

// Get all bugs list
function getAllBugs(){
    $.ajax({
        type: 'GET',
        url: `${URL_API}/list/${userToken}/0`,
        data: {userToken, userId},
        dataType: "json",
        success: function(data){
            console.log('success', 'all bugs list: ', data.result.bug);
            data.result.bug.forEach(el => {
                $('#bugsList')
                .append(
                    '<tr>'+
                        '<th scope="row">'+
                            `<span class="d-block">${el.title}</span>`+
                            `<small>${el.description}</small>`+
                        '</th>'+
                        `<th class="text-center">${el.timestamp}</th>`+
                        `<th class="text-center">${el.user_id}</th>`+
                        '<th class="text-center">'+
                        '<select class="form-select mx-auto" style="width: 150px;">'+
                            `<option ${el.state == 0 ? 'selected' : ''} value="0">Non traité</option>`+
                            `<option ${el.state == 1 ? 'selected' : ''} value="0">Non traité</option>`+
                            `<option ${el.state == 2 ? 'selected' : ''} value="0">Non traité</option>`+
                        '</select>'+
                        '</th>'+
                        '<th class="text-center">Supprimer</th>'+
                    '</tr>'
                );
            });
        },
        error: function(error){
            console.log('error saving user', error);
        }
    })
}

// Get user bugs list
function getUserBugs(){
    $.ajax({
        type: 'GET',
        url: `${URL_API}/list/${userToken}/${userId}`,
        data: {userToken, userId},
        dataType: "json",
        success: function(data){
            console.log('success', 'user bugs list: ', data.result.bug);
        },
        error: function(error){
            console.log('error saving user', error);
        }
    })
}


// $(function (){

//     $.ajax({
//         type: 'GET',
//         url: `${URL_API}/ping`,
//         success: function(data){
//             console.log('success', data);
//         }
//     })
// })