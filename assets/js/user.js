//file created for user login and input//

$('.message a').click(function () {
  $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});



  


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDeocHj9YvZuYXxWMygRZY03aDB9FUsGYE",
    authDomain: "groupproject1-1e4a8.firebaseapp.com",
    databaseURL: "https://groupproject1-1e4a8.firebaseio.com",
    projectId: "groupproject1-1e4a8",
    storageBucket: "groupproject1-1e4a8.appspot.com",
    messagingSenderId: "397184135724"
  };
  firebase.initializeApp(config);

 

  $( "#register , #register2" ).on( "click", function() {
    var name = $("#name").val().trim();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    console.log(name);
    console.log(password);
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
     
    });
    $("#signUpModal").css("display", "none");
  });


  
  $( "#sign-in, #sing-in2" ).on( "click", function() {
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    console.log(email);
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode);
      console.log(errorMessage);
      // ...
     
    });
    $("#signInModal").css("display", "none");
  });

 




