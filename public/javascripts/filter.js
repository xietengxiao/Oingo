
$(document).ready(function () {
    //your code here
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
            var geocoder = new google.maps.Geocoder;


            var latlng = {lat: parseFloat(lati), lng: parseFloat(longi)};


            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        console.log(results[1].place_id);
                        $("#placeid").html(results[1].place_id);

                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
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
            $("#begindate").val(currentdate);
            $("#begintime").val(currenttime);
            $("#enddate").val(currentdate);
            $("#endtime").val(currenttime);
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
    $("#submit").click(function () {
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

        var begindate = $("#begindate").val();
        var begintime = $("#begintime").val();
        var enddate = $("#enddate").val();
        var endtime = $("#endtime").val();
        var selectRepeat = $("#selectRepeat").val();
        var from = $('#from').val();
        var to = $("#to").val();
        var state = $("#state").val();
        var longi = $("#longi").html();
        var lati = $("#lati").html();
        var radius = $("#radius").val();
        var fromwho = $("#fromWho").val();
        var tag = $("#select3").val();





        var placeid =  $("#placeid").html();
        if ($("#locationCondition").css("visibility")== "hidden"){
            longi = "null";
            lati = "null";
            radius = 0;
            placeid = "null";

        }
        else{
            if (radius == ""||longi==""||lati==""){
                alert("all things should not be null");
                return;
            }
        }

        if ($("#scheduleCondition").css("visibility")== "hidden"){
            begintime = "null";
            begindate = "null";
            endtime = "null";
            enddate = "null";
            selectRepeat = 0;
            from = 0;
            to = 0;

        }
        else
        {
            if (begindate =="" || begintime==""|| enddate==""|| endtime==""){
                alert("all things should not be null");
                return;
            }


            if (from == "" || to==""){
                alert("from and to can not be null and if choose every day or no repeat keep it zero");
                return;
            }
            if (selectRepeat == 2 && (from < 1 ||  to > 7 || from > to)){
                alert("if you choose repeat everyweek, from represents the begin weekday and to represents the end weekday and both of them should be >= 1 and <= 7");
                return;
            }
            if (selectRepeat == 3 && (from < 1 ||  to > 31 || from > to)){
                alert("if you choose repeat everymonth,from represents the begin monthday and to represents the end monthday and both of them should be >= 1 and <= 31");
                return;
            }
        }
        if ($("#tagRows").css("visibility") == "hidden" ){
            tag = 0;
        }
        if ($("#stateCondition").css("visibility") == "hidden")
            state = "";
        else{
            if (state == ""){
                alert("all things should not be null");
                return;
            }

        }
        if($("#fromWho").css("visibility")== "hidden")
            fromwho  = 3;



        var data= {longi:longi,
            lati:lati, begindate:begindate,
            enddate:enddate,
            begintime:begintime,
            endtime:endtime,radius:radius,
            from:from,
            to:to,
            tag:tag,radius:radius, repeat:selectRepeat,
            fromwho:fromwho,placeid:placeid,state:state};


        $.post("http://localhost:3000/users/addFilter",data,function (response) {
            if (response.code == -1)
                alert("Add fail");
            else {
                alert("Add success");
                // window.location.href='http://localhost:3000/homepage';
            }

        });
    });
    $("#listFilters").click(function () {
        $.get("http://localhost:3000/users/getFilter",function (data) {
            var filters="";
            $.each(data, function (key, value) {  //循环遍历后台传过来的json数据
                filters += "<div>"+"tagname: "+htmlspecialchars(value.tagname)+" state:"+htmlspecialchars(value.state)+"  radius:"+ htmlspecialchars(value.radius)+" fromWho: "+htmlspecialchars(value.fromWho)+" place_name: "+htmlspecialchars(value.place_name)+" address:"+ htmlspecialchars(value.address)+" lati:"+ htmlspecialchars(value.lat)+" longi: "+ htmlspecialchars(value.lng)+" starttime: "+ htmlspecialchars(value.starttime)+ " endtime: "+ htmlspecialchars(value.endtime)+ " startdate: "+htmlspecialchars(value.startdate)+" enddate: "+htmlspecialchars(value.enddate)+" from:"+ htmlspecialchars(value.sfrom)+ " to: "+ htmlspecialchars(value.sto)+ "repeatid: "+ htmlspecialchars(value.repeatid)+"</div>";
            });
            $("#Filter").html(filters);

        });

    });
});