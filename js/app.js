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
    
    $('#login-form').bootstrapValidator({
                feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: 'The username is not valid',
                validators: {
                    remote: {
                message: 'Please enter a valid 7 or 8-digit NYT userID. Note that this differs from Username.',
                validators: {
                    stringLength: {
                        min: 7,
                        max: 8
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                    }
                }
                    }
                }
            },
            password: {
                message: 'The email address is not valid',
                validators: {
                    remote: {
                        message: 'Please enter a valid password',
                        data: {
                            type: 'password'
                        }
                    }
                }
            }
        }
    });




});