(function($) {

    $('#loginBar').hide();
    $('#registerBar').hide();

	let myH = $('#hotelName'),
        myButton = $('#addHotel');

	

    myButton.on('click', function(event) {
        let hotelName = myH.html();
        let requestConfig = {
            method: 'POST',
            url: window.location.href,
            contentType: 'application/json',
			data: JSON.stringify({
						addHotelName: hotelName
					})
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            var newElement = $(responseMessage);
            /* console.log(newElement); */
        });
       
    });
  
 
    

  

})(window.jQuery);