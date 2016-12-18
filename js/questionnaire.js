
var QuestionTree = QuestionTree.get();
var root = QuestionTree[QuestionTree.root];
dump("question root", root)

log.info("Question root", root);

var firstQuestion = Lockr.get("FIRST_QUESTION");
var firstAnswer = Lockr.get("FIRST_ANSWER");
var currentNode = QuestionTree[firstAnswer.nodeId];

dump("firstAnswer", firstAnswer);
dump("secondQuestion", currentNode);

/*var history = [
	{
		question: firstQuestion,
		answer: firstAnswer
	}
];*/

var vue = new Vue({
	el: '#main',
	data: {
		questionString: currentNode.value,
		answerMap: currentNode.options,
		history: [
			{
				question: "Area of law",
				answer: firstAnswer.text,
				nodeId: firstAnswer.nodeId,
			}
		]
	},
	methods: {
		selectOption(newNodeId, selectedText) {
			var historyElement = {
				question: this.questionString,
				answer: selectedText,
				nodeId: newNodeId
			};
			this.history.push(historyElement);

			if (newNodeId != -1) {
				this.questionString = QuestionTree[newNodeId].value;
				this.answerMap = QuestionTree[newNodeId].options;
			} else {
				this.nextPage();
			}
		},

		nextPage() {
			dump("history", this.history);
			Lockr.set("history", this.history);
			window.location.href = "email.html";
		}	
	}
});