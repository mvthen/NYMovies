

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





});