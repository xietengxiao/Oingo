
$(document).ready(function () {
    function htmlspecialchars(str) {
        if (typeof(str) == "string") {
            str = str.replace(/&/g, "&amp;");
            /* must do &amp; first */
            str = str.replace(/"/g, "&quot;");
            str = str.replace(/'/g, "&#039;");
            str = str.replace(/</g, "&lt;");
            str = str.replace(/>/g, "&gt;");
        }
        return str;
    }
    //your code here
    var globalusername ="";
    $.ajax({
        url:"http://localhost:3000/users/get",
        type:'get',
        success:function(data){
            if (data.code > 0){

                globalusername = htmlspecialchars(data.username);
            }
            else
                alert("Fail to get username");
        }


    });

    function getLocationAndTime() {
        var result = new Array();
        navigator.geolocation.getCurrentPosition(function (position) {

            var lati = position.coords.latitude;
            var longi = position.coords.longitude;
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 0 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            var hour = date.getHours();
            if (hour>= 0 && hour<= 9)
                hour = "0"+ hour;
            var minute = date.getMinutes();
            if (minute >= 0 && minute<= 9)
                minute = "0"+minute;

            var currenttime=
                hour   + seperator2 + minute
                + seperator2 + "00";
            alert("Got your current location and time");
            $("#lati").html(lati);
            $("#longi").html(longi);
            $("#date").val(currentdate);
            $("#time").val(currenttime);

            var timestamp = currentdate+ " "+ currenttime;
            $.ajax({
                url:"http://localhost:3000/users/action",
                type:'post',
                data: 'longi='+ longi+'&'+ 'lati='+lati+'&'+ 'datetime='+timestamp,

                success:function(data){
                    if (data.code < 0){
                        alert("Fail to send location and time to action" );

                    }

                }

            });





        }, function (error) {
            alert("Can't get user's Location and time because of insecurity");
        }, {
            enableHighAcuracy: true,
            timeout: 10000,
            maximumAge: 10000
        });

    }
    getLocationAndTime();
    setInterval(getLocationAndTime, 1000*60*5);
    $("#search").click(function () {
        $("li").remove();
        navigator.geolocation.getCurrentPosition(function (position) {

            var lati = position.coords.latitude;
            var longi = position.coords.longitude;
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 0 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            var hour = date.getHours();
            if (hour>= 0 && hour<= 9)
                hour = "0"+ hour;
            var minute = date.getMinutes();
            if (minute >= 0 && minute<= 9)
                minute = "0"+minute;

            var currenttime=
                hour   + seperator2 + minute
                + seperator2 + "00";
            var timestamp = currentdate+ " "+ currenttime;

            $.ajax({
                url: "http://localhost:3000/users/action",
                type: 'post',
                data: 'longi=' + longi + '&' + 'lati=' + lati + '&' + 'datetime=' + timestamp,

                success: function (data) {
                    if (data.code < 0){
                        alert("Fail to send location and time to action" );
                    }





            }

            });

        }, function (error) {
            alert("Can't send user's Location and time because of insecurity");
        }, {
            enableHighAcuracy: true,
            timeout: 10000,
            maximumAge: 10000
        });

        var longi = $("#longi").html();
        var lati = $("#lati").html();
        var time = $("#time").val();
        var date = $("#date").val();
        if (time== ""||date==""||longi==""||lati==""){
            alert("all things should not be null");
            return;
        }
        var words = "";
        $( ".words" ).each(function( index ) {

           if ($(this).val()!= "")
            words+=  $(this).val() +",";

        });









        var data= {longi:longi,
           lati:lati,longi,time:time,date:date,words:words};


        $.post("http://localhost:3000/users/searchNotes",data,function (response) {
            var notesstring = "";

            $.each(response,function(key,value){
                //循环遍历后台传过来的json数据
                $.ajax({
                    url: "http://localhost:3000/tag",
                    type: 'post',
                    data: 'nid=' + value.nid,

                    success: function (data) {
                        var tags = htmlspecialchars(data.tags);
                        notesstring +=   "<li><div class='notetext'>"+htmlspecialchars(value.text)+"</div><div><span>place_name:"+htmlspecialchars(value.name)+"</span><span>address:"+ htmlspecialchars(value.address)+"</span><span>author:"+htmlspecialchars(value.username)+"</span><span>tags:"+ tags+"</span></div><button class='clickComment'>Show Comments</button><button class='createComment'>Create Comment</button><div class='nid'>"+htmlspecialchars(value.nid)+"</div><div class ='comment'></div></li>";
                        $("ul").html(notesstring);
                    }

                });

            });



        });
    });
    $("#keywords").click(function () {
        $(this).after("<input class ='words'>");

    });

    $("ul").on("click",'.clickComment',function () {
        var nid = $(this).next().next().html();
        var comments = $(this).next().next().next();
        if ($(this).html() == "Show Comments") {
            $(this).html("Hide Comments");
            $(this).next().css("visibility","visible");

            $.ajax({
                url: "http://localhost:3000/users/getComment",
                type: 'post',
                data: 'nid='+nid,

                success: function (data) {
                    var comment="";
                    $.each(data, function (key, value) {  //循环遍历后台传过来的json数据
                        comment += "<div>"+htmlspecialchars(value.username)+":"+htmlspecialchars(value.text) + "</div>";
                    });
                    comments.html(comment);

                }

            });


            $(this).html("Hide Comments");
        }
        else{
            comments.html("");
            $(this).html("Show Comments");
            $(this).next().css("visibility","hidden");
        }
    });
    $("ul").on("click",'.createComment',function () {
        if ($(this).html()=="Create Comment" && $("#newComment").length == 0) {

            var nid = $(this).next().html();
            var comments = $(this).next().next();
            $(this).html("submit Comment");
            var previousComment = comments.html();
            comments.html(previousComment + "<div id ='newComment'><input type='text' ></div>");
        }
        else
        {
            var text = $("#newComment input").val();

            if (text == ""){
                alert("comment should not be null");
                return;
            }
            $(this).html("Create Comment");
            var nid = $(this).next().html();

            var comments = $(this).next().next();
            $.ajax({
                url: "http://localhost:3000/users/addComment",
                type: 'post',
                data: 'nid='+nid+'&'+'text='+text,

                success: function (data) {
                    if (data.code > 0){
                        $("#newComment").remove();
                        comments.html(comments.html()+  "<div>"+globalusername+":"+text + "</div>");
                    }


                }

            });
        }
    });
});