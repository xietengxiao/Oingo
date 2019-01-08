$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});
$("#register").click(function(){
    var email = $('#email').val();
    var password = $('#password').val();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var username = $("#username").val();
    if (email == "" || password== "" || firstname== "" || lastname==""|| username==""){
        alert("all fieles should not be null");
        return;
    }


    data =    {
            email: email,
            password :password,
            firstname: firstname,
            lastname: lastname,
            username: username
        };

    $.post("http://localhost:3000/users/reg",data,function (response) {
       if (response.code == -2)
        alert("fail because your username or email is duplicate");
       else
         alert("register success");
    });

      
});
$("#login2").click(function(){
    var email = $('#email2').val();
    var password = $('#password2').val();
    if (email==""|| password==""){
        alert("all things should not be null");
        return;
    }

    var data =    {
        email: email,
        password :password

    };

    $.post("http://localhost:3000/users/login",data,function (response) {
        if (response.result.code == -1)
            alert("login fail because your email or password is wrong or not exist");
        else {
            alert("login success");
            window.location.href='http://localhost:3000/homepage';
        }

    });


});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});