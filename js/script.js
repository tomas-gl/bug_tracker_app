const URL_API = "http://greenvelvet.alwaysdata.net/bugTracker/api"
let userToken = sessionStorage.getItem("userToken");
let userId = sessionStorage.getItem("userId");
let userList = [];

let userListButton = document.getElementById("user_bug_list");
let completeListButton = document.getElementById("complete_list");


// Register user
function register(){
    let user = {
        user_name: $("#input_username").val(),
        password: $("#input_password").val()
    };
        if ($('#input_password').val() == $('#confirm_password').val()) {
        $.ajax({
            type: 'GET',
            url: `${URL_API}/signup/${user.user_name}/${user.password}`,
            data: user,
            dataType: "json",
            success: function(data){
                console.log('success', data);
                sessionStorage.setItem("userToken", data.result.token);
                sessionStorage.setItem("userId", data.result.id);
                window.location.href="index.html"
            },
            error: function(error){
                console.log('error saving user', error);
                $("#register-error2").removeClass("d-none");
                $("#register-error2").addClass("d-block");
                $("#register-error1").addClass("d-none");
                $("#register-error1").removeClass("d-block");
            }
        })
        } else 
        $("#register-error1").removeClass("d-none");
        $("#register-error1").addClass("d-block");
        $("#register-error2").addClass("d-none");
        $("#register-error2").removeClass("d-block");
}

// Login user
function login(){
    let user = {
        user_name: $("#input_username").val(),
        password: $("#input_password").val()
    };

    $.ajax({
        type: 'GET',
        url: `${URL_API}/login/${user.user_name}/${user.password}`,
        data: user,
        dataType: "json",
        success: function(data){
            console.log('success', data.result.status);
            sessionStorage.setItem("userToken", data.result.token);
            sessionStorage.setItem("userId", data.result.id);
            if(data.result.status == "failure"){
                $("#login-error1").removeClass("d-none");
                $("#login-error1").addClass("d-block");
                $("#login-error2").addClass("d-none");
                $("#login-error2").removeClass("d-block");
            }
            else if(data.result.status == "done"){
                window.location.href="index.html"
            }
        },
        error: function(error){
            console.log('error login user', error);
            $("#login-error2").removeClass("d-none");
            $("#login-error2").addClass("d-block");
            $("#login-error1").addClass("d-none");
            $("#login-error1").removeClass("d-block");
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
    completeListButton.classList.add("bg-dark");
    userListButton.classList.remove("bg-dark");
    bugsCount = 0;
    bugsInProcess = 0;
    bugsFixed = 0;

    $.ajax({
        type: 'GET',
        url: `${URL_API}/list/${userToken}/0`,
        data: {userToken, userId},
        dataType: "json",
        success: function(data){
            console.log('success', 'all bugs list: ', data.result.bug);
            $('#bugsList').html('');
            data.result.bug.forEach(el => {
                bugsCount++;
                if(el.state == 1){
                    bugsInProcess++;
                }
                else if(el.state == 2){
                    bugsFixed++;
                }
                var d = new Date(parseInt(el.timestamp)*1000);
                el.timestamp = d.toLocaleString('fr-FR');

                for (let key in userList){
                    if( el.user_id == key){
                        el.user_id = userList[key]
                    }
                }

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
                        `<select class="form-select mx-auto" style="width: 150px;" name="${el.id}" onchange="editState()">`+
                            `<option ${el.state == 0 ? 'selected' : ''} value="0">Non traité</option>`+
                            `<option ${el.state == 1 ? 'selected' : ''} value="0">En cours</option>`+
                            `<option ${el.state == 2 ? 'selected' : ''} value="0">Traité</option>`+
                        '</select>'+
                        '</th>'+
                        `<th class="text-center" onclick="openModal()"><button class="btn btn-danger" name="${el.id}">Supprimer</button></th>`+
                    '</tr>'
                );
            });
            $('#bugStats').html('');
            $('#bugStats').append(`${bugsCount} bugs ${bugsInProcess > 0 ? `, ${bugsInProcess} en cours` : ''} ${bugsFixed > 0 ? `, ${bugsFixed} traités` : ''} `);
            
        },
        error: function(error){
            console.log('error saving user', error);
        }
    })
}

// Get user bugs list
function getUserBugs(){
    userListButton.classList.add("bg-dark");
    completeListButton.classList.remove("bg-dark");
    bugsCount = 0;
    bugsInProcess = 0;
    bugsFixed = 0;

    $.ajax({
        type: 'GET',
        url: `${URL_API}/list/${userToken}/${userId}`,
        data: {userToken, userId},
        dataType: "json",
        success: function(data){
            console.log('success', 'user bugs list: ', data.result.bug);
             $('#bugsList').html('');
            data.result.bug.forEach(el => {
                bugsCount++;
                if(el.state == 1){
                    bugsInProcess++;
                }
                else if(el.state == 2){
                    bugsFixed++;
                }
                var d = new Date(parseInt(el.timestamp)*1000);
                el.timestamp = d.toLocaleString('fr-FR');

                for (let key in userList){
                    if( el.user_id == key){
                        el.user_id = userList[key]
                    }
                }

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
                        `<select class="form-select mx-auto" style="width: 150px;" name="${el.id}" onchange="editState()">`+
                            `<option ${el.state == 0 ? 'selected' : ''} value="0">Non traité</option>`+
                            `<option ${el.state == 1 ? 'selected' : ''} value="0">En cours</option>`+
                            `<option ${el.state == 2 ? 'selected' : ''} value="0">Traité</option>`+
                        '</select>'+
                        '</th>'+
                        `<th class="text-center" onclick="openModal()"><button class="btn btn-danger" name="${el.id}">Supprimer</button></th>`+
                    '</tr>'
                );
            });
            $('#bugStats').html('');
            $('#bugStats').append(`${bugsCount} bugs ${bugsInProcess > 0 ? `, ${bugsInProcess} en cours` : ''} ${bugsFixed > 0 ? `, ${bugsFixed} traités` : ''} `);
        },
        error: function(error){
            console.log('error saving user', error);
        }
    })
}

// Save a bug
function saveBug(){

    let bugData = {
        title: $("#input_titre").val(),
        description: $("#input_description").val()
    };

    $.ajax({
        type: 'POST',
        url: `${URL_API}/add/${userToken}/${userId}`,
        data: JSON.stringify( { "title": bugData.title, "description": bugData.description }),
        dataType: "json",
        success: function(data){
            console.log('success', data.result.status);
            if(data.result.status == "failure"){
                alert("Error saving bug");
            }
            else if(data.result.status == "done"){
                window.location.href="index.html"
            }
        },
        error: function(error){
            console.log('error saving bug', error);
        }
    })
}

// Edit a bug
function editState(){
    let select = this.event.target;
    $.ajax({
        type: 'GET',
        url: `${URL_API}/state/${userToken}/${select.name}/${select.selectedIndex}`,
        data: { "bug_id": select.name, "new state": select.selectedIndex },
        dataType: "json",
        success: function(data){
            console.log('success', data.result);
            if(completeListButton.classList.contains("bg-dark")){
                getAllBugs();
            }
            else{
                getUserBugs();
            }
        },
        error: function(error){
            console.log('error editing bug', error);
        }
    })
}

// Open confirmation modal
function openModal(){
    let button = this.event.target;
    let bugId = button.name;
    let confirmModal = $('#confirm_modal');
    confirmModal.modal('show');
    let confirmButton = confirmModal.find("#confirm_delete")[0];
    confirmButton.setAttribute("name", bugId);
}

// Delete a bug
function deleteBug(){
    let bugId = this.event.target.name;
    $.ajax({
        type: 'GET',
        url: `${URL_API}/delete/${userToken}/${bugId}`,
        data: bugId,
        dataType: "json",
        success: function(data){
            console.log('success', data.result);
            window.location.reload();
        },
        error: function(error){
            console.log('error deleting bug', error);
        }
    })
}