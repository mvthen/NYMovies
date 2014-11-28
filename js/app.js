$(document).ready(function() {

    var api_key = "hPnzcGaD0tgcmoL6KwVPXoNLMXc8d71l";

    $(".register").click(function(event) {
        console.log('awera');
        var username = document.getElementbyID("#username");
        var password = document.getElementbyID("#password");
        addUser(username, password);
    });

    function addUser(username, password ) {

        var message =
            $.ajax({ 
                url: "https://api.mongolab.com/api/1/databases/nytimes_movie/collections/login_info?apiKey="+api_key,
                data: JSON.stringify( { username : password } ),
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