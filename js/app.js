$(document).ready(function() {

    // rotton tomatoes 
    // username: uxperts
    // password: uicoms4170
    // 6czc3ebkafxvwceb68dhqnz2

    var user = "";
    var pw = "";



    $("#results").hide();
    
    var mongo_api_key = "hPnzcGaD0tgcmoL6KwVPXoNLMXc8d71l";
    var nyt_api_key = "e0dc9ba28e7e7c252c51e01eaf637899:6:61350197";



    $("#registerBtn").click(function(event) {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (addUser(username, password)){
            $('#registerModal').modal('hide');
        }
        else {
            $("#register_valid").append("<p id='#username_used'> Username already in use. </p>");
        }
    });

    $( "#usernameReg").keydown(function() {
        $("#register_valid").empty();
    });

    $( "#username").keydown(function() {
        $("#login_valid").empty();
    });

    $( "#password").keydown(function() {
        $("#login_valid").empty();
    });

   $("#loginBtn").click(function (ev) {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (login(username, password)){
            user = username;
            pw = password;
            $('#loginModal').modal('hide');

        }
        else {
            $("#registerMessages").append("<p id='#incorrect_login'> Your username/password is incorrect. </p>");
        }
    });


   function login(username, password) {
        $.ajax({ 
            url: "https://api.mongolab.com/api/1/databases/nytimes_movie/collections/login_info?apiKey="+mongo_api_key,
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                for (var item in data){
                    console.log(data[item]["username"]);
                    if (username == data[item]["username"] && password == data[item]["password"]){
                        return true;
                    }
                }
                return false;
            },
            error: function (xhr, status, err) {
            }
        });   
   }

   $("#submitBtn").click(function(){
        var query_text = document.getElementById('query').value;
        var min_date = document.getElementById('mindate').value;
        var reviewer_name = document.getElementById('reviewer_name').value;

        var query = {}
        query_info["query"] = query_text;
        query_info["min_date"] = min_date;
        query_info["reviewer_name"] = reviewer_name;

        search_filter(query);
   });

   $('.form_date').datetimepicker({
        format: "mm/dd/yyyy",
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        endDate: "-1d",
        startDate: "2004-01-01"
    });

    function addUser(username, password) {
        var obj = {};
        obj["username"] = username;
        obj["password"] = password;
        $.ajax({ 
            url: "https://api.mongolab.com/api/1/databases/nytimes_movie/collections/login_info?apiKey="+mongo_api_key,
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                for (var item in data){
                    console.log(data[item]["username"]);
                    if (username = data[item]["username"]){
                        return false;
                    }
                }
            },
            error: function (xhr, status, err) {
            }
        });

        $.ajax({
                url: "https://api.mongolab.com/api/1/databases/webdev/collections/hits?apiKey=" + mongo_api_key,
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

    function search_filter(query) {
        var queries = query[0];
        var reviewer = query[1];
        var opening_date = query[2];
        var pub_date = query[3];
        var dvd = query[4];
        var thousand_best = query[5];
        var critic_pick = query[6];
        
        for (var i = 0; i<query.length; i++) {
            if (query[i] = "") {

            }
        }
        
        // if (search_type == "critic_pick") {
        //     search_url = "reviews/all";
        //     arg = "";
        // }
        // if (search_type == "reviewer") {
        //     search_url = "reviewer/";
        //     arg = query;
        // }
        // if (search_type == "") {
        //     arg = query;
        //     query = query.replace("://", "%3A%2F%2F").replace("/", "%2F");
        //     search_url = "url/exact-match.jsonp?url=" + query + "&api-key=";
        // }


        var message =
            $.ajax({
                'url': "http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?"+search_url+arg"&api-key=" + nyt_api_key,

                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    // display_first(data, search_type, arg);
                    console.log(data);

                    for (var i = 0; i <10; i++){
                        //will print first 10 search results

                        var movie_title = data['results'][i]['link']['suggested_link_text'];
                        movie_title = movie_title.replace('Read the New York Times Review of ','');
                        var opening_date = data['results'][i]['opening_date']
                        var mpaa_rating = data['results'][i]['mpaa_rating']


                    }
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

    function reviewer_details(reviewer) {
        reviewer = reviewer.replace(' ','-');
        reviewer = reviewer.replace('.-','.');

        var message =
            $.ajax({
                'url': "http://api.nytimes.com/svc/movies/v2/critics/"+reviewer+".json?api-key="+ nyt_api_key,

                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    // display_first(data, search_type, arg);
                    console.log(data);
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

});