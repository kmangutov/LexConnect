
var attorneys = new LexConnectService("attorneys");
var clients = new LexConnectService("clients");
var queries = new LexConnectService("queries");

$(document).ready(function() {
	$("#reset").click(function() {
		alert("Ok");
		attorneys.drop();
		clients.drop();
		queries.drop();
	});
});