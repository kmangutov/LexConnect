var LexConnectService = function(type) {

  var a = "https://api.mon";
  var aa = "golab.com/api/1/databases/lex";
  var b = "connect/collections/" + type;
  var c = "?ap";
  var ca = "iKey=iILS";
  var d = "3iwLqva8cQ7P0hEfeCI0JouzGX7-";
  var db = a + aa + b + c + ca + d;


  return {
  
    get: function(f) {
      $.get(db, function(data) {
        f(data);
      });
    },

    get: function(query, f) {
      $.get(db + "&q=" + JSON.stringify(query), function(data) {
        f(data);
      }); 
    },

    post: function(data, f) {
      $.ajax( { url: db,
        data: JSON.stringify(data),
        type: "POST",
        contentType: "application/json",
        success: function(data) {
          f(data._id["$oid"]);
        } })
      .fail(function(e) {
        console.log("LexConnectService fail: " + JSON.stringify(e));
        alert("Problem: " + JSON.stringify(e));
      });
    },

    put: function(query, data, f) {
      $.ajax( {url: db + "&q=" + JSON.stringify(query),
        data: JSON.stringify(data),
        type: "PUT",
        contentType: "application/json",
        success: function(data) {
          f(data);
        }})
      .fail(function(e) {
        console.log("LexConnectService fail: " + JSON.stringify(e));
        alert("Problem: " + JSON.stringify(e));
      });
    }

  }
}