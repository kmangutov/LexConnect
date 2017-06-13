

var getDuiQuestionnaireObject = function() {
	var vals = [
		'questionnaire', 
		'county_val',
		'source',
		'first_dui',
		'vehicle_owner',
		'physical_location',
		'engine_running',
		'tests_given',
		'freeform'
	];

	var obj = {};
	vals.forEach(function(val) {
		obj[val] = getUrlVars()[val];
	});


	var res = "<table>";


	for (var key in obj) {
  		if (obj.hasOwnProperty(key)) {
  			res += "<tr><td>" + key + "</td><td>" + obj[key] + "</td></tr>";
  		}
	}
	res += "</table>";

	return res;
}
//console.log(JSON.stringify(getDuiQuestionnaireObject()));

//function to make post request to convertkit 
//works, but no response given which should be fine
function convertkitPost(area, name, emailIn) {
  // Add the iframe with a unique name
  var iframe = document.createElement("iframe");
  var uniqueString = "Tz4krNAWrdBuLkK97v3U";
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.contentWindow.name = uniqueString;

  var client_id = "224914";
  var client_dui_id = "224899";

	var tag_id = client_id;


  //i know this is stupid as hell
  //wehen we get more branches ill redo this

	var tags_final;

  if (area == 'dui')
	{
	  tags_final = client_dui_id;
	}


	  return $.ajax({
	    url: "https://api.convertkit.com/v3/tags/"+ tag_id +"/subscribe",
	    type: "POST",
	    data: {
				    api_key: "bWEMgj_xI4srTSdjlFikWw",
				    email: emailIn,
				    first_name: name,
				    tags: tags_final,
				    fields: {
				    	
				    }
				  },

	    success: function(response) {
	      console.log(response);

	    },
	    error: function(response){
	    	console.log(response);
	    }
	  });


}


var referralCode = Lockr.get('REFERRAL_CODE');
logService = LexLogService("email");

var html = "<table>";

if(Lockr.get("history")){
Lockr.get("history").forEach(function(row) {
	html += "<tr><td>" + row.question + "</td><td>" + row.answer + "</td></tr>";
});
}

html += "</table>";

$(document).ready(function() {

	$("#client-signup-form").validate({
		rules: {
			name: {
				required: true,
			},
			email: {
				required: true,
				email: true
			},
			county: {
				required: true,
			},
			phone: {
				required: true,
				minlength: 10
			}
		},
		messages: {
			email: "Please enter a valid email address.",
			phone: "Please enter a valid 10 digit phone number.",
			county: "Please enter the county in which you reside in.",
		}

	});




	$('#Submit').click(function() {
		if($("#client-signup-form").valid()){

			$('#Submit').text("Please Wait...");
			$('#Submit').prop('disabled', true);

			var job_status_temp;
			var job_time_temp;
			var checklist_job_status = $('#jobStatus :checkbox')
			var checklist_job_time = $('#jobTime :checkbox')
			
			for (var i =0; i < checklist_job_status.length; i++){
				if (checklist_job_status[i].checked) {
					//console.log(checklist[i].value)
					job_status_temp = checklist_job_status[i].value
				}
			}

			for (var i =0; i < checklist_job_time.length; i++){
				if (checklist_job_time[i].checked) {
					//console.log(checklist[i].value)
					job_time_temp = checklist_job_time[i].value
				}
			}


			var temp_freeform;

			if ($('#countyIncident'))

			var area_of_law = getUrlVars()['questionnaire'];

			var county_of_incident= getUrlVars()['county_val'];

			if(area_of_law == "dui"){
				var questionnaire_info = getDuiQuestionnaireObject();
			}

			convertkitPost(area_of_law, $('#name').val(), $('#email').val());


			var obj = {
				countyIncident: $('#countyIncident').val(),
				countyResidence: $('#county').val(),
				email: $('#email').val(), 
				html: html,
				name: $('#name').val(),
				jobStatus: job_status_temp,
				phone: $('#phone').val(),
				jobTime: job_time_temp,
				lengthOfEmployment: $('#lengthOfEmployment').val(),
				monthlyIncome: $('#monthlyIncome').val(), 
				dependents: $('#dependents').val(),
				questionnaireInfo: questionnaire_info,
				additionalInfo: $('#additionalInfo').val(),

			}

			var logging = logService.click("submit", obj);
			var clientEmail = emailjs.send("gmail", "email_submission_thanks", obj);
			var adminEmail = emailjs.send("gmail", "client_signup", obj);
			Promise.all([clientEmail, adminEmail, logging]).then(function () {
				window.location.href = "thanks.html";
			});
		}

	});
});