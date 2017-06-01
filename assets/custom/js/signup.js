

var referralCode = Lockr.get('REFERRAL_CODE');
logService = LexLogService("email");

var html = "<table>";

if(Lockr.get("history")){
Lockr.get("history").forEach(function(row) {
	html += "<tr><td>" + row.question + "</td><td>" + row.answer + "</td></tr>";
});
}

html += "</table>";




/*
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.imgur.com/3/image",
  "type": "POST",
  "headers": {
    "authorization":  "Client-ID 84b67a72469fab6",
    "authorization": "Bearer 27ccaf80d0e73825819847b4b68916ab9912d4e3"
  },
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": formData
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
*/




/*
var formData = new FormData();
	
	formData.append("image", $('input[type=file]')[0].files[0]); 

$.ajax({
	dataType: 'jsonp',
    url: 'https://getsimpleform.com/messages/ajax?form_api_token=3f5bff9511b02b28a7a9ce8690c51a67',
    data: formData,
    type: 'POST',
    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    processData: false, // NEEDED, DON'T OMIT THIS
    // ... Other options like success and etc
});
*/



//formData.append("username", "Groucho");
//formData.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"

// HTML file input, chosen by user



//var request = new XMLHttpRequest();
//request.open("POST", "https://getsimpleform.com/messages?form_api_token=3f5bff9511b02b28a7a9ce8690c51a67");
//request.send(formData);

//function to submit the form to simple form site
//not doing ajax allows to submit the picture as attachment
function submitSimpleForm(){
	document.getElementById("attorney-signup-form").action = "https://getsimpleform.com/messages?form_api_token=3f5bff9511b02b28a7a9ce8690c51a67";
	document.getElementById("attorney-signup-form").submit();
}


//function to make post request to convertkit 
//works, but no response given which should be fine
function convertkitPost(area, name, emailIn) {
  // Add the iframe with a unique name
  var iframe = document.createElement("iframe");
  var uniqueString = "Tz4krNAWrdBuLkKO7v3U";
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.contentWindow.name = uniqueString;

  var attorney_id = "217520";
  var dui_id = "215927";
  var divorce_id = "217162";
  var business_id = "217163";

	var tag_id = attorney_id;


  //i know this is stupid as hell
  //wehen we get more branches ill redo this

	var tags_final;

  if (area == '1')
	{
	  tags_final = "215927";
	}

  else if (area == '2')
	{
	  tags_final = "217162";
	}


  else if (area == '3')
	{
	  tags_final = "217163";
	}

  else if (area == '12')
	{
	  tags_final = "215927, 217162";
	}

  else if (area == '13')
	{
	  tags_final = "215927, 217163";
	}

  else if (area == '23')
	{
	  tags_final = "217162, 217163";
	}

  else if (area == '123')
	{
	  tags_final = "215927, 217162, 217163";
	}


	  return $.ajax({
	    url: "https://api.convertkit.com/v3/tags/"+ tag_id +"/subscribe",
	    type: "POST",
	    data: {
				    api_key: "bWEMgj_xI4srTSdjlFikWw",
				    email: emailIn,
				    first_name: name,
				    tags: tags_final
				  },

	    success: function(response) {
	      console.log(response);

	    },
	    error: function(response){
	    	console.log(response);
	    }
	  });


}



//post the uploaded to imgur
//the bios are uploaded as descriptions of the pic
//basically backup for now
function imgurPost(){
	var formData = new FormData();
		
		formData.append("image", $('input[type=file]')[0].files[0]); 
		formData.append("title", $('#name').val());
		formData.append("description", $('#bio').val());


	  return $.ajax({
	    url: "https://api.imgur.com/3/image",
	    type: "POST",
	    datatype: "json",
	    headers: {
	      "Authorization": "Client-ID 84b67a72469fab6",
	      "Authorization": "Bearer 27ccaf80d0e73825819847b4b68916ab9912d4e3"
	    },
	    data: formData,
	    success: function(response) {

	    	submitSimpleForm();
	      //console.log(response);

	    },
	    cache: false,
	    contentType: false,
	    processData: false
	  });

}



//first we make sure everything neccessary has been entered
$(document).ready(function() {
	$("#attorney-signup-form").validate({
		rules: {
			name: {
				required: true 
			},

			email: {
				required: true,
				email: true
			},
			leadEmail: {
				required: true,
				email: true
			},
			zipcode: {
				required: true,
				digits: true,
				minlength: 5,
				maxlength: 5
			},
			counties: {
				required: true
			},
			phone: {
				required: true,
				minlength: 10
			},
			mailingAddress: {
				required: true
			},
			city: {
				required: true
			},
			state: {
				required: true
			},
			years: {
				required: true
			},
			bio: {
				required:true ,
				maxlength: 350
			},
			pic: {
				required:true ,
			}

		},
		messages: {
			email: "Please enter a valid email address.",
			leadEmail: "Please enter a valid email address.",
			zipcode: "Please enter a valid 5 digit zipcode.",
			pic: "Please upload an image of yourself.",
			phone: "Please enter a phone number in the format xxx-xxx-xxxx."
		}

	});
	

	$('#Submit').click(function() {
		if($("#attorney-signup-form").valid()){

			$('#Submit').text("Please Wait...");
			$('#Submit').prop('disabled', true);

			console.log($('#practiceInput').val())

			console.log($('#checkboxes').val())



			var checklist = $('#checkboxes :checkbox')

			for (var i =0; i < checklist.length; i++){
				if (checklist[i].checked) {
					//console.log(checklist[i].value)
				}
			}



			var areas ="";

			//see what areas of law were choses
			if (checklist[0].checked) {
				areas += "1"
			}

			if (checklist[1].checked) {
				areas += "2"			
			}

			if (checklist[2].checked) {
				areas += "3"
			}


			//make sure both ajax posts finish, then we submit the simpleform, and after that we redirect to thanks page
		$.when(convertkitPost(areas, $('#name').val(), $('#email').val()), imgurPost()).done(function(a1, a2){
			submitSimpleForm();
			//window.location = "http://tryzealous.com/thanks.html"
		});





		}

		else{
			$('#Submit').text("Submit");

		}

	});
});

//please leave this code just in case lol


/*
	var formData = new FormData();
		
		formData.append("image", $('input[type=file]')[0].files[0]); 
		formData.append("title", $('#name').val());
		formData.append("description", $('#bio').val());


	  $.ajax({
	    url: "https://api.imgur.com/3/image",
	    type: "POST",
	    datatype: "json",
	    headers: {
	      "Authorization": "Client-ID 84b67a72469fab6",
	      "Authorization": "Bearer 27ccaf80d0e73825819847b4b68916ab9912d4e3"
	    },
	    data: formData,
	    success: function(response) {

	    	submitSimpleForm();
	      //console.log(response);

	    },
	    cache: false,
	    contentType: false,
	    processData: false
	  });
*/




/*


				$.ajax({
				  dataType: 'jsonp',
				  url: "http://getsimpleform.com/messages/ajax?form_api_token=3f5bff9511b02b28a7a9ce8690c51a67",
				  data: {
				    name: $('#name').val(),
				    namePractice: $('#name-practice').val(),
				    email: $('#email').val(),
				    leadEmail: $('#lead-email').val(),
				    counties: $('#counties').val(),
				    years: $('#years').val(),
				    DUI: checklist[0].checked,
				    divorce: checklist[1].checked,
				    businessFormation: checklist[2].checked,
				    otherAreas: $('#other_areas').val(),
				    bio: $('#bio').val(),
				  },
				  success: function(response){
	      				

	      				crossDomainPost(areas, $('#name').val(), $('#email').val());

				  }

				});
*/



/*


  // construct a form with hidden inputs, targeting the iframe
  var form = document.createElement("form");
  form.target = uniqueString;
  form.action =  "https://api.convertkit.com/v3/tags/"+ tag_id +"/subscribe";
  form.method = "POST";

  // repeat for each parameter
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "api_key";
  input.value = "bWEMgj_xI4srTSdjlFikWw";
  form.appendChild(input);


	var input2 = document.createElement("input");
  input2.type = "hidden";
  input2.name = "email";
  input2.value = emailIn;
  form.appendChild(input2);

  var input3 = document.createElement("input");
  input3.type = "hidden";
  input3.name = "first_name";
  input3.value = name;
  form.appendChild(input3);

  //i know this is stupid as hell
  //wehen we get more branches ill redo this

  if (area == '1')
	{
		var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "tags";
	  input.value = "215927";
	  form.appendChild(input);
	}

  if (area == '2')
	{
		var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "tags";
	  input.value = "217162";
	  form.appendChild(input);
	}


  if (area == '3')
	{
		var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "tags";
	  input.value = "217163";
	  form.appendChild(input);
	}

  if (area == '12')
	{
		var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "tags";
	  input.value = "215927, 217162";
	  form.appendChild(input);
	}

  if (area == '13')
	{
		var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "tags";
	  input.value = "215927, 217163";
	  form.appendChild(input);
	}

  if (area == '23')
	{
		var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "tags";
	  input.value = "217162, 217163";
	  form.appendChild(input);
	}

  if (area == '123')
	{
		var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "tags";
	  input.value = "215927, 217162, 217163";
	  form.appendChild(input);
	}




  document.body.appendChild(form);
  form.submit();

  */