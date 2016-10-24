
var attorneys = new LexConnectService("attorneys");
var clients = new LexConnectService("clients");
var queries = new LexConnectService("queries");
var logs = new LexConnectService("logs");

var logService = LexLogService();

$(document).ready(function() {
	$("#reset").click(function() {
		alert("Ok");
		attorneys.drop();
		clients.drop();
		queries.drop();
		// Drop logs??? idk
		logService.log("Database reset");
	});
});