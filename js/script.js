fetch("http://greenvelvet.alwaysdata.net/bugTracker/api/ping")
    .then((res) => res.json())
    .then(function (response) {
        console.log(response);
    })
    .catch((error) => console.error(error));


localStorage.setItem("keyName", "test");