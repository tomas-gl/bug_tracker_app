const URL_API = "http://greenvelvet.alwaysdata.net/bugTracker/api"

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
    // console.log(user.user_name);

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


// $(function (){

//     $.ajax({
//         type: 'GET',
//         url: `${URL_API}/ping`,
//         success: function(data){
//             console.log('success', data);
//         }
//     })
// })