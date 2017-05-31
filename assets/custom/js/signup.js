

var referralCode = Lockr.get('REFERRAL_CODE');
logService = LexLogService("email");

var html = "<table>";

if(Lockr.get("history")){
Lockr.get("history").forEach(function(row) {
	html += "<tr><td>" + row.question + "</td><td>" + row.answer + "</td></tr>";
});
}

html += "</table>";




//function to make post request to convertkit 
//since cross domain, and we have no server, this seems like only way (ajax doesnt work)
//works, but no response given which should be fine
function crossDomainPost(area, name, email) {
  // Add the iframe with a unique name
  var iframe = document.createElement("iframe");
  var uniqueString = "";
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.contentWindow.name = uniqueString;

  var attorney_id = "217520";
  var dui_id = "215927";
  var divorce_id = "217162";
  var business_id = "217163";

	var tag_id = attorney_id;



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
  input2.value = email;
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
}


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
			zipcode: {
				required: true,
				digits: true,
				minlength: 5,
				maxlength: 5
			},
			years: {
				required: true
			},
			freeform: {
				required:true ,
				maxlength: 350
			}

		},
		messages: {
			email: "Please enter a valid email address",
			zipcode: "Please enter a valid 5 digit zipcode"
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
					console.log(checklist[i].value)
				}
			}

			//this is ugly lol but multiple post requests above 
			//(using crossDomainPost multiple times ina  row) didnt work

			var areas ="";


			if (checklist[0].checked) {
				areas += "1"
			}

			if (checklist[1].checked) {
				areas += "2"			
			}

			if (checklist[2].checked) {
				areas += "3"
			}

			crossDomainPost(areas, $('#name').val(), $('#email').val());


/*
			$.ajax({
				 url: "https://api.convertkit.com/v3/tags/215927/subscribe",
				 type: 'POST',
				 dataType: 'json',
				 contentType: 'application/json',
				 data: {api_key: "bWEMgj_xI4srTSdjlFikWw", email: "peter.ivanov.22@gmail.com", 
				 name: "Peter" },
					 success: function (data) {
					  alert(JSON.stringify(data));
					  alert("1");
					},
					  error: function(xhr, status, error){		    
						alert(xhr.responseText);
					  	alert("2");

					 }
				
			});	        
*/




			var obj = {
				zip: $('#zipcode').val(),
				email: $('#email').val(), 
				html: html,
				name: $('#name').val(),
				openEnded: $('#freeform').val(),
				referralCode: referralCode
			}

			var logging = logService.click("submit", obj);
			var clientEmail = emailjs.send("gmail", "email_submission_thanks", obj);
			var adminEmail = emailjs.send("gmail", "form_submission", obj);

		}

	});
});