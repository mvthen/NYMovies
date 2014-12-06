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

    $('a#button-checkbox').click(function(){
        $(this).toggleClass("down");
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

   $("[name='switch-state']").bootstrapSwitch();

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

        var query_info = {}
        query_text = query_text.replace(' ','+');
        query_info["query"] = query_text;

        query_info["min_date"] = min_date;

        reviewer_name = reviewer_name.replace(' ','-');
        reviewer_name = reviewer_name.replace('.-','.');
        query_info["reviewer_name"] = reviewer_name;

        search_filter(query_info);
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

        var search_url = ''

        //construct query url
        if (query['query']){
            search_url += 'query='+query['query']
        }
        if (query['reviewer_name']){
            if (search_url.length != 0){
                search_url += '&reviewer=' + query['reviewer_name']
            } else {
                search_url += 'reviewer=' + query['reviewer_name']
            }
        }
        if (query['min_date']){
            if (search_url !=0){
                search_url +='&opening_date=' + query['min_date']
            }else{
                search_url +='opening_date=' + query['min_date']
            }
        }

        //console.log(search_url)

        var message =
            $.ajax({
                'url': "http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?"+search_url+"&api-key=" + nyt_api_key,

                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    // display_first(data, search_type, arg);
                    console.log(data);

                    for (var i = 0; i < data['results'].length; i++){
                        //will print first 10 search results
                        var query_data = [];
                        query_data.push("1");
                        var movie_title = data['results'][i]['link']['suggested_link_text'];
                        movie_title = movie_title.replace('Read the New York Times Review of ','');
                        var opening_date = data['results'][i]['opening_date']
                        var mpaa_rating = data['results'][i]['mpaa_rating']
                        var article_link = data['results'][i]['link']['url']
                        var article_title = data['results'][i]['link']['suggested_link_text']

                    }
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });

            var q = 'star wars';
            q.replace(' ', '+');  
            rt_apikey = '6czc3ebkafxvwceb68dhqnz2'
            //rottentomatoes ajax call for poster
            $.ajax({
                'url': 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='+rt_apikey+'&q='+q,
                'type': 'GET',
                'dataType': 'jsonp',
                success: function(data, textStats, XMLHttpRequest){
                    //console.log(data)

                    var poster_link = data['movies'][0]['posters']['thumbnail']
                        rt_apikey = '6czc3ebkafxvwceb68dhqnz2';
                        (function( lockedInIndex ){
                            console.log(query_data);
                            var q = 'star wars';
                            q.replace(' ', '+');  
                            $.ajax({
                                'url': 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='+rt_apikey+'&q='+q,
                                'type': 'GET',
                                'dataType': 'jsonp',
                                success: function(data, textStats, XMLHttpRequest){
                                    console.log(data);
                                    var poster_link = data['movies'][0]['posters']['thumbnail'];
                                },
                                error: function(data, textStatus, errorThrown) {
                                    console.log("error");
                                }

                            });
                        })
                        (query_data);
                    }
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

    function reviewer_details(reviewer) {


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