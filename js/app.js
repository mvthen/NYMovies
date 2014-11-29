$(document).ready(function() {


	var api_key = "hPnzcGaD0tgcmoL6KwVPXoNLMXc8d71l";

    $(".register").click(function(event) {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        addUser(username, password);
    });

    function addUser(username, password ) {

        var obj = {};
        obj[username] = password;

        var message =
            $.ajax({ 
                url: "https://api.mongolab.com/api/1/databases/nytimes_movie/collections/login_info?apiKey="+api_key,
                data: JSON.stringify(obj),
                type: "POST",
                contentType: "application/json", 
                success: function(data, textStats, XMLHttpRequest) {
                    console.log("success");
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }
    
 $('#login').bootstrapValidator({
message: 'This value is not valid',
fields: {
username: {
message: 'The username is not valid',
validators: {
notEmpty: {
message: 'The username is required and can\'t be empty'
},
stringLength: {
min: 6,
max: 30,
message: 'The username must be more than 6 and less than 30 characters long'
},
regexp: {
regexp: /^[a-zA-Z0-9_\.]+$/,
message: 'The username can only consist of alphabetical, number, dot and underscore'
},
different: {
field: 'password',
message: 'The username and password can\'t be the same as each other'
},
notEmpty: {
field: 'password',
message: 'The password is required and can\'t be empty'
}

}
},
password: {
    message: "The password is not valid",
    validators: {
        notEmpty: {
            message: "Password must not be empty"
        },
        stringLength: {
            min: 4,
            max: 30,
            message: 'The password must be more than 3 and less than 30 characters long'

        }
    }
}

}
});



});