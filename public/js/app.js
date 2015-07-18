var orginalTemplate = document.getElementById('originalProfilTemplate').innerHTML,
	profilContainer = document.getElementById("profilContainer");

document.getElementById('meetupForm').addEventListener("submit", function(){
	$.ajax({
		url: '/getInfos/' + document.getElementById('groupName').value + '/' + document.getElementById('apiKey').value,
		success: function(response){
			profilContainer.innerHTML = "";
			for(i = 0, l = response.length; i < l; i++){
				var template = orginalTemplate
					.replace("%%PHOTO%%", response[i].photo_url)
					.replace("%%PSEUDO%%", response[i].name)
					.replace("%%MEMBRE_ID%%", response[i].member_id);

				var questResp = "<ul>";
				for(var j = 0, k = response[i].answers.length; j < k; j++){
					if(response[i].answers[j].answer){
						questResp += "<li class='question'><span>" + response[i].answers[j].question + "</span>";
						questResp += "<div class='answer'>" + response[i].answers[j].answer + "</div></li>";
					}
				}
				questResp += "</ul>"
				template = template.replace("%%ANSWERS%%", questResp);
				
				var frag = document.createDocumentFragment();
				var elem = document.createElement('div');
				elem.classList.add("profil");
				elem.innerHTML = template;
				frag.appendChild(elem);

				profilContainer.appendChild(frag);

			}
		}
	});
});

