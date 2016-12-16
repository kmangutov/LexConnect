
var QuestionTree = QuestionTree.get();
var root = QuestionTree[QuestionTree.root];
dump("question root", root)

log.info("Question root", root);

var firstAnswer = Lockr.get("FIRST_ANSWER");
var currentNode = QuestionTree[firstAnswer.nodeId];

dump("firstAnswer", firstAnswer);
dump("secondQuestion", currentNode);