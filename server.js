var request = require('request'),
	async = require("async"),
	express = require('express');

var app = express();
var MEETUP_ENDPOINT = {
	group : "https://api.meetup.com/",
	group_profiles: 'https://api.meetup.com/2/profiles/'
};


/** EXPRESS CONFIG **/
app.use(express.static('public'));

/** EXPRESS ROUTES **/
app.get('/getInfos/:groupName/:meetupKey', function (req, res) {
	// URL http://127.0.0.1:3000/getInfos/123/124
	GROUP_NAME = req.params.groupName;
	MEETUP_KEY = req.params.meetupKey;
	start(function(result){
		res.send(result);
	});
});

var host = process.argv[2] || server.address().address;
var port = process.argv[3] || 3000;
var server = app.listen(port, host, function () {
	console.log('Example app listening at http://%s:%s', host, port);
});


// Get informations on group
var getGroupInfo = function(groupName, callback){
	var url = MEETUP_ENDPOINT.group + groupName + "?key=" + MEETUP_KEY;
	request.get({url: url, headers : {'Accept' : "application/json"}}, function (err, response, body) {
	    if(err){
	        console.log("Erreur de requête");
	        callback(null, body);
	    } else{
	    	var json = JSON.parse(body);	
	        callback(null, {id: json.id, groupName: groupName, members: json.members});
	    }
	//            callback(body);

	});	
}

var getPageProfile = function(url, tab, callback){
	request.get({url: url, headers : {'Accept' : "application/json"}}, function (err, response, body) {
	    if(err){
	        console.log("Erreur de requête");
	        callback(null, body);
	    } else{
	    	var json = JSON.parse(body);
	    	console.log(json);
	    	if(json.code === "not_authorized" || json.code === "invalid_param"){
	    		callback(null, []);
	    		return null;
	    	}
	    	tab = tab.concat(json.results);
	    	if(json.meta.next){
    			getPageProfile(json.meta.next, tab, callback);
	    	} else {
	    		callback(null, tab);
	    	}
	    }
	//            callback(body);

	});	
};

var getMembersProfile = function(props, callback){
	var url = MEETUP_ENDPOINT.group_profiles + "?&sign=true&group_urlname="+ props.groupName + "&key=" + MEETUP_KEY + "&page=" + props.members;
	getPageProfile(url, [], callback);
}

var start = function(callback){
	async.waterfall([
		function(callback){
			getGroupInfo(GROUP_NAME, callback);
		}, getMembersProfile
	], function(err, result){
		if(err){console.log("erreur in waterfall");}
		callback(result);

	})
};

//start();
