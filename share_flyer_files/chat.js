$(function() {
    var platform = navigator.platform,
        iOs = platform === 'iPod' || platform === 'iPhone';

    if (iOs) {
        console.log('window scroll at ipod and iphone level');

    } else {
        var lastScrollTop = 0;
        $(window).scroll(function(event) {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                $('.chat-button').addClass('chat-button-stacked');
            } else {
                $('.chat-button').removeClass('chat-button-stacked');
            }
            $.fn.scrollEnd = function(callback, timeout) {
                $(this).scroll(function() {
                    var $this = $(this);
                    if ($this.data('scrollTimeout')) {
                        clearTimeout($this.data('scrollTimeout'));
                    }
                    $this.data('scrollTimeout', setTimeout(callback, timeout));
                });
            };
            $(window).scrollEnd(function() {

                $('.p-chat').removeClass('p-opacity-visible').addClass('p-opacity-hidden');
            }, 1000);
            var st = $(this).scrollTop();
            if (st > lastScrollTop) {
                // downscroll code
                $('.p-chat').removeClass('p-opacity-hidden');
                $('.p-chat').addClass('p-opacity-visible');
            } else {
                $('.p-chat').addClass('p-opacity-visible');
                $('.p-chat').removeClass('p-opacity-hidden');

            }
            lastScrollTop = st;
        });
        $('.chat-circle').on('mouseenter', function() {
            $(this).parent().find('.p-chat').removeClass('p-opacity-hidden').addClass('p-opacity-visible');
        }).on('mouseleave', function() {
            $(this).parent().find('.p-chat').removeClass('p-opacity-visible').addClass('p-opacity-hidden');
        });
        $(".close").on('click', function() {
            var formAgent = $('#NoAgentAvailable');
            formAgent.validate().resetForm(); // clear out the validation errors
            formAgent[0].reset();
            var formSnapE = $('#SnapEChap');
            formSnapE[0].reset();
            $('input[type="text"]').val('');
            $('textarea').val('');
            $('label.error').remove();
            $('#no_one_available').hide();

        })
    }

    if ($().validate) {
        console.log("chained");
    } else {
        console.log("nope");
    };
    $.validator.addMethod(
        "withTwoStrings",
        function(value, element) {
            howManyWords = value.trim();
            howManyWords = howManyWords.replace(/\s{2,}/g, ' '); //remove extra spaces
            howManyWords = howManyWords.split(' ');

            if (howManyWords.length == 2) {
                return true;
            } else {
                return false;
            }
            e.preventDefault();
        },
        "Please Include First and Last Name"
    );
    $.validator.addMethod("phoneUS", function(phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
    }, "Please specify a valid phone number");

    $('#NoAgentAvailable').validate({
        onkeyup: function(element) { $(element).valid() },
        rules: {
            'full_name': {
                withTwoStrings: true,
            },
            'visitor_email': {
                required: true,
                email: true
            },
            'phone_number': {
                required: true,
                phoneUS: true
            },
            'message': {
                required: true,
                minlength: 8,
                maxlength: 300,
            }
        },
        messages: {

            'visitor_email': {
                required: "Please enter an email address",
            },
            'message': {

                maxlength: "Please only 300 characters",
            }
        }
    });


    var show_chat = '';
    var agent = '';
    var chat_availability = '';
    var array = '';
    var agentarray = '';
    var available_agent = '';
    var widgetId = '';

    var active_chat_hours = '';

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    function currentTime() {
        var d = new Date();
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        var s = addZero(d.getSeconds());
        var currentTime = h + ":" + m + ":" + s;
        var available_chat_start_time = '06:30:00'; //set chat availability hours
        var available_chat_end_time = '17:00:00'; //set chat availability hours
        if (available_chat_start_time < currentTime && available_chat_end_time > currentTime) {
            //alert(currentTime);
            active_chat_hours = '1';
        } else {
            //alert(currentTime);
            //alert('not active');
            active_chat_hours = '0';
        }
        return active_chat_hours;
    }

    currentTime();
    /*
    var dt = new Date();
    var currentTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    */

    //$(function() {
    $('.close').on('click', function() {
        //console.log('clicked');
        var formAgent = $('#NoAgentAvailable');
        formAgent.validate().resetForm(); // clear out the validation errors
        formAgent[0].reset();
        var formSnapE = $('#SnapEChap');
        formSnapE[0].reset();
        $('input[type="text"]').val('');
        $('textarea').val('');
        $('label.error').remove();
        // $('#no_one_available').hide();
        $('#SnapEngageChat').hide();
        $('.SnapABug_Button').show();
        $('.chat-button').show();


    });
    //});

    //$(document).ready(function(){
    //$('#SnapABug_Button').hide();
    setTimeout(function() {
        $('#SnapABug_Button').show();
    }, 3000); //show the button after 2 secs
    $.ajax({
        type: "POST",
        url: "AJAX.php?controller=addon_Peachjar&action=check_agent_availability",
        data: show_chat,
        dataType: 'json',
        cache: false,
        //contentType: false,
        //processData: false,
        success: function(data) {
            //access database after zipcode has been entered
            if (active_chat_hours === '0') {
                chat_availability = '0';
            } else {
                chat_availability = data['show_chat'];
            }
            //alert(chat_availability);
            /*
             * make sure to pass agent as an array to know which agents are available
             */
            //agent = data.agent;
            agent = data['agent'];
            //alert(agent);
            console.log(agent);
            if (agentarray === null || agentarray === '') {
                //console.log('Agent Not Available');
                agentarray = agent.split(",");
                //console.log(agentarray);
            } else {
                agentarray = '';
            }

            //alert(agent);
            $('#SnapABug_Button').show();
            //$('#SnapABug_bImg').show();
            if (chat_availability === '1') {
                $('#for_questionaire').show();
                $('#while_loading').hide();
                setTimeout(function() {
                    if ($('.zip_code').val()) {
                        //
                    } else {
                        //$('#no_one_available').hide();

                    }
                    //$('#SnapABug_Button').hide();
                }, 10000); //show the form (or button) after 10 secs
            } else {
                $('#no_one_available').hide();
                //$('#for_questionaire').hide();
                $('#SnapEngageChat').hide();
                //$('#while_loading').hide();
                $('#User_Type').hide();
                //$('#no_one_available').show();

            }
        },
        error: function() {
            //more than likely on a local machine and curl is complaining
            //alert("error");
            console.log("error in curl")
        }
    });
    //});

    (function() {
        var se = document.createElement('script');
        se.type = 'text/javascript';
        se.async = true;
        se.src = '//storage.googleapis.com/code.snapengage.com/js/b477d2c1-a963-47ad-ad85-c4cd39c0acff.js';
        var done = false;
        se.onload = se.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;
                /* Place your SnapEngage JS API code below */
                /* SnapEngage.allowChatSound(true); Example JS API: Enable sounds for Visitors. */
                // start showButtonTimeout
                //var secondsToWait = 5; // How many seconds to wait until reveal.
                //var name = "James Malin";
                var name = "";
                //SnapEngage.hideButton(); // Hide the button immediately.
                //setTimeout( 'SnapEngage.showButton()', secondsToWait*1000 ); // .showButton() after a timeout.
                // end showButtonTimeout
                // SnapEngage.setUserEmail('{/literal}{$user.user_data.email}{literal}', true);
                // SnapEngage.setUserName(name);
                //SnapABug.openProactiveChat(true, false, 'Hello, can I help you with our setup process?');
            }
        };
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(se, s);
    })();
    //might need access to the Visitor Chat API so we can make 
    //a call to check the availability of the widget (aka if agents are available)
    var User_Type = '';
    var Chat_Reason = '';
    var School_Volume = '';
    var Posts_Per_Year = '';
    var Chat_Agent = '';
    var zip_code = '';
    var owner = '';
    var snapMessage = '';
    var owner_available = '';
    var VAL = '';
    var SV = '';
    var PPY = '';
    var chat_inquiry = [];
    var data_to_send = '';
    var idk = '';
    var do_not_submit = '';
    var agent_is_available = '';
    var selected_type = ''; //may show as unused, but this is actually used to send into SnapEngage dashboard
    var vval = '';
    var pval = '';
    var mval = '';
    var fval = '';

    $('#SnapABug_Button').show();

    $('#SnapEngageChat').hide(); //hide the form (or button)

    //$(document).ready(function(){
    $(".chat-button").click(function(e) { //if user clicks chat image
        e.preventDefault();
        $('#SnapABug_Button').hide();
        $('.chat-button').hide();


        if (chat_availability === '1') {
            $('#SnapEngageChat').show();
            $('#SnapEngageChat').addClass('animated slideInRight');
        } else {
            $('#no_one_available').show();
            $('#no_one_available').addClass('animated slideInRight');
        }

    });
    //});

    ////////////////////////////
    // Form; No-one available //
    ////////////////////////////

    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test($email);
    }

    $("#submit_form").click(function() {

        //check if fields are filled out
        //if not filled out or invalid, display a message

        if ($('#full_name').val() === '') {
            $('#full_name_help').show();
            $('#full_name_help').text('Please provide your full name.');
            fval = 0;
        } else {
            //passes check
            $('#full_name_help').hide();
            fval = 1;
        }
        if ($('#visitor_email').val() === '') {
            $('#visitor_email_help').show();
            $('#visitor_email_help').text('Please provide your email address.');
        } else {
            if (validateEmail($('#visitor_email').val())) {
                //passes check
                $('#visitor_email_help').hide();
                vval = 1;
            } else {
                $('#visitor_email_help').show();
                $('#visitor_email_help').text('Please provide a valid email address.');
                vval = 0;
            }
        }
        if ($('#phone_number').val() === '') {
            $('#phone_number_help').show();
            $('#phone_number_help').text('Please provide your phone number.');
            pval = 0;
        } else {
            //passes check
            $('#phone_number_help').hide();
            pval = 1;
        }
        if ($('textarea#message').val() === '') {
            $('#message_help').show();
            $('#message_help').text('Please provide a brief message.');
            mval = 0;
        } else {
            //passes check
            $('#message_help').hide();
            mval = 1;
        }

        //if passes all checks and email appears valid submit
        if (fval === 1 && vval === 1 && pval === 1 && mval === 1) {
            //only do below if all of the above are set and not null

            //build our chat_inquiry array after verification to avoid pushing a value twice
            chat_inquiry.push($('#full_name').val());
            chat_inquiry.push($('#visitor_email').val());
            chat_inquiry.push($('#phone_number').val());
            chat_inquiry.push($('textarea#message').val());

            $.ajax({
                type: "POST",
                url: "AJAX.php?controller=addon_Peachjar&action=chat_email_inquiry",
                data: [
                    chat_inquiry
                ],
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    console.log('Thank you for your inquiry.');
                    //alert(data['chunks']);
                    $('#no_one_available').hide();
                    //show thank you message and then fade out
                },
                error: function() {
                    //uncomment for testing
                    //alert("error");
                    console.log('Thank you for your inquiry.');
                    //alert(data['chunks']);
                    $('#no_one_available').hide();
                    //show thank you message and then fade out
                }
            });
        }

    });

    ////////////////////////////////
    // END Form; No-one available //
    ////////////////////////////////

    //$('.User_Type').change(function () { //todo when User Type selected
    $('input[type=radio][name=User_Type]').change(function() {
        User_Type = $('input[type=radio][name=User_Type]:checked').val();
        if (User_Type === '4') {
            //continue to question 2
            $('#Chat_Reason').show();
            $('#User_Type').hide();
            $('.Chat_Reason').change(function() { //todo when Chat Reason selected
                Chat_Reason = $('.Chat_Reason').val();
                if (Chat_Reason === '1') {
                    $('#School_Volume').show();
                    $('#Chat_Reason').hide();
                    $('.School_Volume').change(function() { //todo when School Volume selected 
                        School_Volume = $('.School_Volume').val();
                    });
                    $('.Posts_Per_Year').change(function() { //todo when School Volume selected 
                        Posts_Per_Year = $('.Posts_Per_Year').val();
                    });
                    $('.zip_code').on("input", function() {
                        if ($(this).val().length === 5 && School_Volume === '' && Posts_Per_Year === '') {
                            console.log('School Volume and Posts Per Year not set.');
                        } else if ($(this).val().length === 5 && School_Volume !== '' && Posts_Per_Year !== '') {
                            //alert(School_Volume);
                            //alert(Posts_Per_Year);
                            zip_code = $('.zip_code').val(); //set by user input
                            //
                            if (School_Volume === '1') {
                                SV = '3';
                            } else if (School_Volume === '2') {
                                SV = '8';
                            } else if (School_Volume === '3') {
                                SV = '11';
                            } else {
                                SV = '1'; //something went wrong. set this so it doesn't break calculation.
                            }
                            if (Posts_Per_Year === '1') {
                                PPY = '2';
                            } else if (Posts_Per_Year === '2') {
                                PPY = '5';
                            } else if (Posts_Per_Year === '3') {
                                PPY = '7';
                            } else {
                                PPY = '1'; //something went wrong. set this so it doesn't break calculation.
                            }

                            VAL = SV * PPY * 25;
                            //alert(VAL);
                            if (VAL < '350') {
                                $('#School_Volume').hide();
                                Chat_Agent = 'Allison';
                                widgetId = 'b477d2c1-a963-47ad-ad85-c4cd39c0acff'; //set the widgetId
                                SnapEngage.setWidgetId(widgetId);
                                SnapEngage.openProactiveChat(true, false, 'Welcome to Peachjar! How can I help you today?');
                                SnapEngage.setProactiveAutocloseDelay(0); // in minutes, 0 does not close
                                SnapEngage.setCallback('Close', function(type, status) {
                                    $('.chat-button').show();
                                    $('#SnapABug_Button').show();
                                    $('#User_Type').show();
                                    $('#Chat_Reason').hide();
                                    $('#School_Volume').hide();
                                    $('#SnapEChap').trigger('reset');
                                    //location.reload();
                                });
                                $('#SnapEngageChat').hide();
                                $(function() {
                                    //$('#myModal').modal('toggle'); //close modal window
                                });
                            } else {

                                $.ajax({
                                    type: "POST",
                                    url: "AJAX.php?controller=addon_Peachjar&action=chat_agent_routing",
                                    data: zip_code,
                                    dataType: 'json',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    success: function(data) {
                                        //access database after zipcode has been entered
                                        //alert(data['zip_code']);
                                        console.log(data);
                                        owner = data['zip_code'];
                                        Chat_Agent = owner; //necessary? Can be combined or needs to be separate?

                                        $.each(agentarray, function(i, l) {
                                            console.log(i);
                                            console.log(l);
                                            l = l.replace(/\"/g, '');
                                            if (owner === l) { //if owner available
                                                owner_available = '1';
                                            }
                                        });

                                        //DO A CHECK TO MAKE SURE AGENT IS AVAILABLE
                                        //IF NOT ROUTE TO AN AVAILABLE AGENT
                                        if (owner_available === '1') {
                                            //agent is available; continue on
                                            //alert('agent for target zip code is available.');
                                            //alert(owner);
                                            available_agent = owner;
                                            if (available_agent === 'Allison') { //District Success Team
                                                widgetId = 'b477d2c1-a963-47ad-ad85-c4cd39c0acff'; //set the widgetId
                                                selected_type = 'ECO';
                                            } else if (available_agent === 'Chris') {
                                                widgetId = '1e6c75dc-7d3b-4b77-9d76-30943cd7eb14'; //set the widgetId
                                            } else if (available_agent === 'Jillian') {
                                                widgetId = '700e4506-06ce-446a-9388-b03fa7865d56'; //set the widgetId
                                            } else if (available_agent === 'Mike') {
                                                widgetId = 'a1d008f0-f58b-4bc3-b994-e6162f41f537'; //set the widgetId
                                            }
                                            SnapEngage.setWidgetId(widgetId);
                                            $('#SnapEngageChat').hide();
                                            snapMessage = 'Welcome to Peachjar! My name is ' + owner + '. How can I help you today?';
                                            SnapEngage.openProactiveChat(true, false, snapMessage);
                                            SnapEngage.setProactiveAutocloseDelay(0); // in minutes, 0 does not close
                                            SnapEngage.setCallback('Close', function(type, status) {
                                                $('.chat-button').show();
                                                $('#SnapABug_Button').show();
                                                $('#User_Type').show();
                                                $('#Chat_Reason').hide();
                                                $('#School_Volume').hide();
                                                $('#SnapEChap').trigger('reset');
                                                //location.reload();
                                            });
                                            $(function() {
                                                //$('#myModal').modal('toggle'); //close modal window
                                            });
                                        } else {
                                            //agent is not available
                                            //find another agent that is available
                                            //reset the widgetId to available agent
                                            //if no other sales agent available
                                            //route to District Success Team
                                            //alert('agent for target zip is not available.');
                                            var available_agents = [];
                                            $.each(agentarray, function(i, l) {
                                                l = l.replace(/\"/g, '');
                                                if (l !== 'example' && l !== 'Allison' && l !== 'Rick' && l !== 'Jenna' && l !== 'Emily' && l !== 'Kellie') {
                                                    available_agents[i] = l; // DO NOT INCLUDE DISTRICT SUCCESS TEAM
                                                }
                                            });

                                            $.each(available_agents, function(i, l) {
                                                console.log(l);
                                            });

                                            //round robin through the agents
                                            $.ajax({
                                                type: "POST",
                                                url: "AJAX.php?controller=addon_Peachjar&action=round_robin",
                                                data: available_agents,
                                                dataType: 'json',
                                                cache: false,
                                                contentType: false,
                                                processData: false,
                                                success: function(data) {
                                                    owner = data['round_robin_agent'];
                                                    //alert(data['round_robin_agent']);
                                                    available_agent = data['round_robin_agent'];
                                                    if (available_agent === 'Allison') { //District Success Team
                                                        widgetId = 'b477d2c1-a963-47ad-ad85-c4cd39c0acff'; //set the widgetId
                                                    } else if (available_agent === 'Chris') {
                                                        widgetId = '1e6c75dc-7d3b-4b77-9d76-30943cd7eb14'; //set the widgetId
                                                    } else if (available_agent === 'Jillian') {
                                                        widgetId = '700e4506-06ce-446a-9388-b03fa7865d56'; //set the widgetId
                                                    } else if (available_agent === 'Mike') {
                                                        widgetId = 'a1d008f0-f58b-4bc3-b994-e6162f41f537'; //set the widgetId
                                                    }
                                                    SnapEngage.setWidgetId(widgetId);
                                                    $('#SnapEngageChat').hide();
                                                    snapMessage = 'Hello my name is ' + owner + ', can I help you with our setup process?';
                                                    SnapEngage.openProactiveChat(true, false, snapMessage);
                                                    SnapEngage.setProactiveAutocloseDelay(0); // in minutes, 0 does not close
                                                    SnapEngage.setCallback('Close', function(type, status) {
                                                        $('.chat-button').show();
                                                        $('#SnapABug_Button').show();
                                                        $('#User_Type').show();
                                                        $('#Chat_Reason').hide();
                                                        $('#School_Volume').hide();
                                                        $('#SnapEChap').trigger('reset');
                                                        //location.reload();
                                                    });
                                                    $(function() {
                                                        //$('#myModal').modal('toggle'); //close modal window
                                                    });
                                                    //alert(available_agent);
                                                    //alert(widgetId);
                                                },
                                                error: function() {
                                                    console.log("error");
                                                }
                                            });
                                        }
                                    },
                                    error: function() {
                                        console.log("error");
                                    }
                                });
                            }
                        }
                    });
                } else {
                    //submit form and route to District Success Team
                    $('#School_Volume').hide();
                    School_Volume = '';
                    Chat_Agent = 'Allison';
                    widgetId = 'b477d2c1-a963-47ad-ad85-c4cd39c0acff'; //set the widgetId
                    SnapEngage.setWidgetId(widgetId);
                    SnapEngage.openProactiveChat(true, false, 'Welcome to Peachjar! How can I help you today?');
                    SnapEngage.setProactiveAutocloseDelay(0); // in minutes, 0 does not close
                    $('#SnapEngageChat').hide();
                    SnapEngage.setCallback('Close', function(type, status) {
                        $('.chat-button').show();
                        $('#SnapABug_Button').show();
                        $('#User_Type').show();
                        $('#Chat_Reason').hide();
                        $('#SnapEChap').trigger('reset');
                        //location.reload();
                    });
                    $(function() {
                        //$('#myModal').modal('toggle'); //close modal window
                    });
                    setTimeout(function() {
                        //Check that chat actually made it to the agent
                        if ($('.SnapABug_transcriptLine').length) {
                            //Chat sent to District Success Team succesfully
                            //alert('yas');
                        } else {
                            //Chat did not successfully make it to District Success Team
                            //More than likely no users are available from ^
                            $.each(agentarray, function(i, l) {
                                l = l.replace(/\"/g, '');
                                //alert( l ); //alert available agent
                                if (l === Chat_Agent) {
                                    agent_is_available = '1';
                                }
                            });
                            if (agent_is_available === '1') {
                                //Agent is available - should not end up here
                                //This failed for another reason
                            } else {
                                //alert('NO ONE HOME');
                                $('#no_one_available').show();
                                $('#no_one_available').addClass('animated');
                                $('#no_one_available').addClass('slideInRight');
                            }
                        }
                    }, 500);
                }
            });
        } else {
            //submit form and route to District Success Team
            $('#Chat_Reason').hide();
            Chat_Reason = '';
            School_Volume = '';
            Chat_Agent = 'Allison'; //set the agent
            widgetId = 'b477d2c1-a963-47ad-ad85-c4cd39c0acff'; //set the widgetId
            SnapEngage.setWidgetId(widgetId);
            SnapEngage.openProactiveChat(true, false, 'Welcome to Peachjar! How can I help you today?');
            SnapEngage.setProactiveAutocloseDelay(0); // in minutes, 0 does not close
            if (User_Type === '1') {
                selected_type = 'Parent';
            } else if (User_Type === '2') {
                selected_type = 'District';
            } else if (User_Type === '3') {
                selected_type = 'School';
            } else if (User_Type === '4') {
                selected_type = 'ECO';
            }
            SnapEngage.setCallback('Close', function(type, status) {
                $('.chat-button').show();
                $('#SnapABug_Button').show();
                $('#User_Type').show();
                $('#Chat_Reason').hide();
                $('#SnapEChap').trigger('reset');
                //location.reload();
            });
            $('#SnapEngageChat').hide();
            $(function() {
                //$('#myModal').modal('toggle'); //close modal window
            });

            setTimeout(function() {
                //Check that chat actually made it to the agent
                if ($('.SnapABug_transcriptLine').length) {
                    console.log("sent succesfully")
                        //Chat sent to District Success Team succesfully
                        //alert('yas');
                } else {
                    //Chat did not successfully make it to District Success Team
                    //More than likely no users are available from ^
                    $.each(agentarray, function(i, l) {
                        l = l.replace(/\"/g, '');
                        //alert(l);
                        if (l === Chat_Agent) {
                            agent_is_available = '1';
                        }
                    });
                    if (agent_is_available === '1') {
                        //Agent is available - should not end up here
                        //This failed for another reason
                    } else {
                        alert('NO ONE HOME');
                        $('#no_one_available').show();
                        $('#no_one_available').addClass('animated');
                        $('#no_one_available').addClass('slideInRight');
                    }
                }
            }, 500);

        }
    });
});
