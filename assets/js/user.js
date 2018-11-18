//file created for user login and input//

$(function() {
  // Setup drop down menu
  $('.dropdown-toggle').dropdown("toggle");
 
  // Fix input element click problem
  $('.dropdown input, .dropdown label').click(function(e) {
    e.stopPropagation();
  });
});