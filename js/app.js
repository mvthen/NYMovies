$(document).ready(function() {

    // rotton tomatoes 
    // username: uxperts
    // password: uicoms4170
    // 6czc3ebkafxvwceb68dhqnz2
    $('.reload').click(function(){
        location.reload();
    });


    $(".results").hide();

    var user = "";
    var pw = "";
    var rt_apikey = "6czc3ebkafxvwceb68dhqnz2";
    var mongo_api_key = "hPnzcGaD0tgcmoL6KwVPXoNLMXc8d71l";
    var nyt_api_key = "e0dc9ba28e7e7c252c51e01eaf637899:6:61350197";
    var omdb_api_key = "e4cb03fb";

    
    String.format = function() {
        // The string containing the format items (e.g. "{0}")
        // will and always has to be the first argument.
        var theString = arguments[0];
        // start with the second argument (i = 1)
        for (var i = 1; i < arguments.length; i++) {
            // "gm" = RegEx options for Global search (more than one instance)
            // and for Multiline search
            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, arguments[i]);
        } 
        return theString;
    }

    $.ajax({
        'url': 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=' + rt_apikey,
        'type': 'GET',
        'dataType': 'jsonp',
        success: function(data, textStats, XMLHttpRequest) {
            var array = [];
            for (var i = 0; i < 15; i++){
                var title = data["movies"][i]["title"].replace(' ', '+');
                array.push(title);
            }
            carousel_search(array);
        },
        error: function(data, textStatus, errorThrown) {
            console.log("error");
        }

    });

    function carousel_search(array) {
        for (var i = 0; i < 15; i++){
            var query_data=array[i];
            omdb_search(query_data, i)
            
        }
    }

    function omdb_search(query_data, i) {
        $.ajax({
                'url': 'http://www.omdbapi.com/?t='+query_data+'&y=&plot=full&r=json',
                'type': 'GET',
                'dataType': 'jsonp',
                success: function(data, textStats, XMLHttpRequest) {
                    var poster = data["Poster"];
                    console.log(poster);
                    var picture = String.format("<img src='{0} alt='Owl Image'>", poster);
                    $("#owl"+i).append(picture);
                },
                error: function(data, textStatus, errorThrown) {
                    console.log('error');
                }
            });
    }


    $("#results").hide();


    $("#registerBtn").click(function(event) {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (addUser(username, password)) {
            $('#registerModal').modal('hide');
        } else {
            $("#register_valid").append("<p id='#username_used'> Username already in use. </p>");
        }
    });

    $('a#button-checkbox').click(function() {
        $(this).toggleClass("down");
    });

    $("#usernameReg").keydown(function() {
        $("#register_valid").empty();
    });

    $("#username").keydown(function() {
        $("#login_valid").empty();
    });

    $("#password").keydown(function() {
        $("#login_valid").empty();
    });

    $("#loginBtn").click(function(ev) {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (login(username, password)) {
            user = username;
            pw = password;
            $('#loginModal').modal('hide');

        } else {
            $("#registerMessages").append("<p id='#incorrect_login'> Your username/password is incorrect. </p>");
        }
    });

     $("#owl-demo").owlCarousel({
 
      autoPlay: 2000, //Set AutoPlay to 3 seconds
      items : 5,
      itemsDesktop : [1199,3],
      itemsDesktopSmall : [979,3],
      // navigation: true,
      // navigationText: ["<", ">"]
 
  });

    function login(username, password) {
        $.ajax({
            url: "https://api.mongolab.com/api/1/databases/nytimes_movie/collections/login_info?apiKey=" + mongo_api_key,
            type: "GET",
            contentType: "application/json",
            success: function(data) {
                for (var item in data) {
                    console.log(data[item]["username"]);
                    if (username == data[item]["username"] && password == data[item]["password"]) {
                        return true;
                    }
                }
                return false;
            },
            error: function(xhr, status, err) {}
        });
    }


    $("#submitBtn").click(function() {
        var query_text = document.getElementById('query').value;
        var min_date = document.getElementById('mindate').value;
        var reviewer_name = document.getElementById('reviewer_name').value;

        var critic_pick = $('#critic-switch').prop('checked');
        if (critic_pick == true){
            critic_pick = 'Y'
        } else {
            critic_pick = 'N'
        }

        var top_thousand = $('#thous-switch').prop('checked');
        if (top_thousand == true){
            top_thousand = 'Y'
        } else {
            top_thousand = 'N'
        }

        var query_info = {}
        query_text = query_text.replace(' ', '+');
        query_info["query"] = query_text;

        query_info["min_date"] = min_date;

        reviewer_name = reviewer_name.replace(' ', '-');
        reviewer_name = reviewer_name.replace('.-', '.');
        query_info["reviewer_name"] = reviewer_name;

        query_info['critic_pick'] = critic_pick
        query_info['top_thousand'] = top_thousand

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
            url: "https://api.mongolab.com/api/1/databases/nytimes_movie/collections/login_info?apiKey=" + mongo_api_key,
            type: "GET",
            contentType: "application/json",
            success: function(data) {
                for (var item in data) {
                    console.log(data[item]["username"]);
                    if (username = data[item]["username"]) {
                        return false;
                    }
                }
            },
            error: function(xhr, status, err) {}
        });

        $.ajax({
            url: "https://api.mongolab.com/api/1/databases/webdev/collections/hits?apiKey=" + mongo_api_key,
            data: JSON.stringify(obj),
            type: "POST",
            contentType: "application/json",
            success: function(data, textStats, XMLHttpRequest) {
                console.log(data);
            },
            error: function(data, textStatus, errorThrown) {}
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

    $('.lightbox').lightbox();
    $('.lightbox').click(function() {
        $('html').addClass("open-lightbox");
        setTimeout(function() {
            $('html.open-lightbox').css("overflow", "hidden");
        }, 300);
    });

    $('.jquery-lightbox-button-close').click(function() {
        $('html.open-lightbox').css("overflow-y", "scroll");
        setTimeout(function() {
            $('html').removeClass("open-lightbox");
        }, 300);
    });

    function search_filter(query) {

        $(".results").show();
        $(".wrap").hide();

        var search_url = '';
        var resultstring = '';

        //construct query url
        if (query['query']) {
            search_url += 'query=' + query['query'];
            resultstring += query['query'].replace('+',' ');
        }

        if (query['critic_pick'] == 'Y'){
            if (search_url.length != 0) {
                search_url += '&critics-pick=Y';
                resultstring += '; Critic Pick';
            } else {
                search_url += 'critics-pick=Y';
                resultstring += 'Critic Pick';
            }
        }

        if (query['top_thousand'] == 'Y'){
            if (search_url.length != 0) {
                search_url += '&thousand-best=Y';
                resultstring += '; Top Thousand';
            } else {
                search_url += 'thousand-best=Y';
                resultstring += 'Top Thousand';
            }
        }

        if (query['reviewer_name']) {
            if (search_url.length != 0) {
                search_url += '&reviewer=' + query['reviewer_name'];
                resultstring += '; Reviewer: '+query['reviewer_name'].replace('-',' ');
            } else {
                search_url += 'reviewer=' + query['reviewer_name'];
                resultstring += 'Reviewer: '+query['reviewer_name'].replace('-',' ');
            }
        }
        if (query['min_date']) {
            if (search_url != 0) {
                search_url += '&opening_date=' + query['min_date'];
                resultstring += '; Opening Date: ' + query['min_date'];
            } else {
                search_url += 'opening_date=' + query['min_date'];
                resultstring += 'Opening Date: ' + query['min_date'];
            }
        }



        var title = "<div class='col-lg-12'><h2 class='page-header' style='color:#3498db;'>Loading...</h2></div>";
        $("#posters").html(title);

        var message =
            $.ajax({
                'url': "http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?" + search_url + "&api-key=" + nyt_api_key,

                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    $("#posters").empty();
                    if (resultstring==""){
                        var title = "<div class='col-lg-12'><h2 class='page-header' style='color:#3498db;'>Top Movies </h2></div>";
                    }
                    else {
                        var title = String.format("<div class='col-lg-12'><h2 class='page-header' style='color:#3498db;'>Your results for: {0}</h2></div>", resultstring);
                    }
                    $("#posters").html(title);
                    // display_first(data, search_type, arg);
                    //console.log(data);

                    var search_data = data;

                    if (search_data['results'].length == 0){
                        $("#posters").append("<div class='col-lg-12'><h2 class='page-header' style='color:#3498db;'>Sorry, no results were found</h2></div>");
                    }

                    for (var i = 0; i < search_data['results'].length; i++) {
                        //will print first 10 search results
                        var query_data = search_data['results'][i];
                        var movie_title = data['results'][i]['link']['suggested_link_text'];
                        movie_title = movie_title.replace('Read the New York Times Review of', '');
                        query_data["movie_title"] = movie_title;

                        var movie_id = data['results'][i]['nyt_movie_id'];

                        var opening_date = data['results'][i]['opening_date'];
                        query_data["opening_date"] = opening_date;

                        var mpaa_rating = data['results'][i]['mpaa_rating'];
                        query_data["mpaa_rating"] = mpaa_rating;
                        var article_link = data['results'][i]['link']['url'];
                        query_data["article_link"] = article_link;
                        var article_title = data['results'][i]['link']['suggested_link_text'];
                        query_data["article_title"] = article_title;

                        $($('#modal-movie-template').html()).appendTo('#movie-container');
                        var last_movie = $('#movie-container .modal').last();
                        last_movie.attr('id', 'modal-movie-'+movie_id);
                        
                        (function(lockedInIndex) {
                        $.ajax({
                            'url': 'http://www.omdbapi.com/?t='+encodeURIComponent(query_data["movie_title"])+'&y=&plot=short&r=json',
                            'type': 'GET',
                            'dataType': 'jsonp',
                            'movie_id': movie_id,
                            'query_data': query_data,
                            success: function(data, textStats, XMLHttpRequest) {    
                                var poster = data["Poster"];
                                var title = data["Title"];
                                if (poster !== "N/A" && poster !== undefined){
                                    // alert(data["Title"]);
                                    // alert($('#modal-movie-' + movie_id).html());
                                    //alert($('#modal-movie-' + movie_id + ' #modalbox .modal-header .modal-title').html());
                                    //$('.modal-title').text(search_data['results'][i]['display_title']);

                                    //THIS CORRECTLY CHANGES THE TITLE 
                                    $('#modal-movie-' + this.movie_id + ' .modal-header .modal-title').text(title);
                                    $('#modal-movie-' + this.movie_id + ' .modal-body img').attr('src', poster);
                                    $('#modal-movie-' + this.movie_id + ' .modal-body .opening-date').text(this.query_data["opening_date"]);
                                    $('#modal-movie-' + this.movie_id + ' .modal-body .plot').text(data["Plot"]);
                                    //alert($('#modal-movie-' + movie_id + ' #modalbox .modal-header .modal-title').html());

                                    var img = String.format("<img class='img-responsive' src='{0}'><div class='text'>{1}</div>", poster, data["Title"]);
                                    
                                    //BUT THE CORRECT MODAL IS NOT SHOWING UP??
                                    var total = String.format("<div class='col-lg-3 col-md-4 col-xs-6 thumb'><a class='thumbnail' data-toggle='modal' \
                                        href='#modal-movie-"+this.movie_id+"'>{0}</a></div>", img);
                                    $("#posters").append(total);
                                }
                                else {
                                    //console.log(data);
                                }
                            },
                            error: function(data, textStatus, errorThrown) {
                                console.log("error");
                            }
                        });
                    })(search_data);

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
                'url': "http://api.nytimes.com/svc/movies/v2/critics/" + reviewer + ".json?api-key=" + nyt_api_key,
                'type': 'GET',
                'dataType': "jsonp",
                success: function(data, textStats, XMLHttpRequest) {
                    console.log(data);
                },
                error: function(data, textStatus, errorThrown) {
                    console.log("error");
                }
            });
    }

});