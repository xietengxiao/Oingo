
$(document).ready(function(){
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
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            var hour = date.getHours();
            if (hour>= 1 && hour<= 9)
                hour = "0"+ hour;
            var minute = date.getMinutes();
            if (minute >= 1 && minute<= 9)
                minute = "0"+minute;

            var currenttime=
                hour   + seperator2 + minute
                + seperator2 + "00";
            alert("Got your current location and time");

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
    $.ajax({
        url:"http://localhost:3000/users/get",
        type:'get',
        success:function(data){
            if (data.code > 0){

                $("#stateName").val(data.state);
            }
            else
                alert("Fail to get Tags" );
        }


    });
    $("#logout").click(function () {


        $.ajax({
            url:"http://localhost:3000/users/logout",
            type:'get',
            success:function(data){
                if (data.code > 0){

                    window.location.href="http://localhost:3000";
                }
                else
                    alert("Fail");
            }


        });
    });
    $("#change").click(function () {
        navigator.geolocation.getCurrentPosition(function (position) {

            var lati = position.coords.latitude;
            var longi = position.coords.longitude;
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            var hour = date.getHours();
            if (hour>= 1 && hour<= 9)
                hour = "0"+ hour;
            var minute = date.getMinutes();
            if (minute >= 1 && minute<= 9)
                minute = "0"+minute;

            var currenttime=
                hour   + seperator2 + minute
                + seperator2 + "00";
            var timestamp = currentdate+ " "+ currenttime;

            $.ajax({
                url:"http://localhost:3000/users/action",
                type:'post',
                data: 'longi='+ longi+'&'+ 'lati='+lati+'&'+ 'datetime='+timestamp,

                success:function(data){
                    if (data.code < 0){
                        alert("Fail to send location and time to action");

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

        var state = $("#stateName").val();
        if (state==""){
            alert("all things should not be null");
            return;
        }
        $.ajax({
            url:"http://localhost:3000/users/change",
            type:'post',
            data: 'state='+ state,

            success:function(data){
                if (data.code > 0){

                    alert("Your state is successfully changed");
                }
                else
                    alert("Fail to change");
            }

        });
    });
});