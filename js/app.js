$(document).ready(function() {


    var api_key = "hPnzcGaD0tgcmoL6KwVPXoNLMXc8d71l";

    $("#registerBtn").click(function(event) {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        addUser(username, password);
        //return $('#register').validate().form();
        $('#registerModal').modal('hide');
    });


   $("#loginBtn").click(function (ev) {
    //return $('#login').validate().form();
    $('#loginModal').modal('hide');
    });


    function addUser(username, password) {
        var obj = {};

        
        obj[username] = password;
        $.ajax({ 
            url: "https://api.mongolab.com/api/1/databases/nytimes_movie/collections/login_info?apiKey=hPnzcGaD0tgcmoL6KwVPXoNLMXc8d71l",
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                for (var item in data){
                    console.log(data[item]);
                }
            },
            error: function (xhr, status, err) {
            }
        });

        $.ajax({
                url: "https://api.mongolab.com/api/1/databases/webdev/collections/hits?apiKey=" + api_key,
                data: JSON.stringify(obj),
                type: "POST",
                contentType: "application/json",
                success: function(data, textStats, XMLHttpRequest) {
                    console.log(data);    
                },
                error: function(data, textStatus, errorThrown) {
                }
        });
    }

    $('#register').bootstrapValidator({
        container: '#registerMessages',
        fields: {
            username: {
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
                    }

                }
            },
            password: {
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

    $('#login').bootstrapValidator({
        container: '#messages',
        fields: {
            username: {
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
                    } 

                }
            },
            password: {
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