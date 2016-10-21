

var dump = function(text, obj) {
  console.log("[" + text + "]:\t" + JSON.stringify(obj));
}

var appendToNewArray = function(original, newItem) {
  var ret = [];
  for(var i = 0; i < original.length; i++)
    ret[i] = original[i];
  ret[i] = newItem;
  return ret;
}

var mergeObjects = function(a, b, next) {
  var newObj = {};

  for(var k in a) {
    newObj[k] = a[k];
  }

  for(var k in b) {
    newObj[k] = b[k];
  }

  dump("mergeObjects", newObj);

  next(newObj);
}



var LexConnectService = function(type) {

  var a = "https://api.mon";
  var aa = "golab.com/api/1/databases/lex";
  var b = "connect/collections/" + type;
  var c = "?ap";
  var ca = "iKey="
  var caa = "iILS";
  var d = "3iwLqva8cQ7P0hEfeCI0JouzGX7-";
  var db = a + aa + b + c + ca + caa + d;
  var key = caa + d;

  var urlForObjectId = function(collection, id) {
    var a = "https://api.mon";
    var aa = "golab.com/api/1/databases/lex";
    var b = "connect/collections/" + collection;
    var c = "/" + id + "?apiKey=" + key;

    return a + aa + b + c;
  }


  var dump = function(text, obj) {
    console.log("[" + text + "]:\t" + JSON.stringify(obj));
  }

  return {
  
    drop: function() {
      //alert("drop " + db);
      $.ajax({
        url: db,
        data: JSON.stringify([]),
        type: "PUT",
        contentType: "application/json",

        success: function(data) {
          //alert(db + " " + JSON.stringify(data));
        },

        fail: function(data) {
          //alert(db + " " + JSON.stringify(data));
        }

      });
    },

    getAll: function(f) {
      $.get(db, function(data) {
        f(data);
      });
    },

    get: function(query, f) {
      dump("LexConnectService::get " + db + "&q=" + JSON.stringify(query));
      $.get(db + "&q=" + JSON.stringify(query), function(data) {
        f(data);
      }); 
    },

    getId: function(id, f) {
      console.log("LexConnectService::getId " + id);
      //alert("get " + urlForObjectId(type, id))
      $.get(urlForObjectId(type, id), function(resp) {
        console.log("LexConnectService::getId " + JSON.stringify(resp));
        f(resp);
      });
    },

    post: function(data, f) {
      dump("LexConnectService::post " + db, data)
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

    put: function(objectId, data, f) {

      //data["_id"] = {"$oid": objectId};

      var url = urlForObjectId(type, objectId);
      dump("LexConnectService::put " + url, data)
      $.ajax( {url: url,
        data: JSON.stringify(data),
        headers: {"X-HTTP-Method-Override": "PUT"}, 
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