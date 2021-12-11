(function($) {

    $('#loginBar').hide();
    $('#registerBar').hide();

	

    $('button').on('click', function(event) {
        const buttonText = event.target.closest("button");
        const attitude = buttonText.getAttribute('name');
        const comment = event.target.closest("li");
        const commentId = comment.getAttribute('name');
        let requestConfig = {
            method: 'POST',
            url: window.location.href,
            contentType: 'application/json',
			data: JSON.stringify({
						likeOrDislike: attitude,
                        commentId: commentId
					})
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            var newElement = $(responseMessage);
           /*  console.log(newElement); */
        });
   
       
    });
  
 
    

  

})(window.jQuery);