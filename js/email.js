
var history = Lockr.get("history");
var test = Lockr.get("FIRST_ANSWER");
dump("test", test);
dump("history", history);
dump("fuck", Lockr.getAll());

dump("last try", Lockr.getAll()[0]);