
    $(document).ready(function(){
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
                        if (data.code > 0){


                        }
                        else
                            alert("Fail");
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


        $("#add").click(function () {

            var username = $("#FriendName").val();
            if (username==""){
                alert("all things should not be null");
                return;
            }
            $.ajax({
                url:"http://localhost:3000/friends",
                type:'post',
                data: 'username='+username,

                success:function(data){
                    if (data.code > 0){

                        alert("Now "+ username +" is your friend");
                    }
                    else
                        alert(username+ " Not found");
                }

            });
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
                        if (data.code > 0){


                        }
                        else
                            alert("Fail");
                    }

                });

            }, function (error) {
                alert("Can't send user's Location and time because of insecurity");
            }, {
                enableHighAcuracy: true,
                timeout: 10000,
                maximumAge: 10000
            });
        });
        $("#ListFriends").click(function () {

            $.get("http://localhost:3000/Friends",function (data) {
                var friends="";
                $.each(data, function (key, value) {  //循环遍历后台传过来的json数据
                  friends+="<div>" +htmlspecialchars(value.username)+"</div>";
                });
                $("#Friends").html(friends);

            });

        });
    });

