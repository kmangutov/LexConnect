
var questionTree = QuestionTree.get();
var root = questionTree[QuestionTree.root];
dump("question root", root)

log.info("Question root", root);

var firstQuestion = Lockr.get("FIRST_QUESTION");
var firstAnswer = Lockr.get("FIRST_ANSWER");
var currentNode = questionTree[firstAnswer.nodeId];

dump("firstAnswer", firstAnswer);
dump("secondQuestion", currentNode);
dump("firstQuestion ", firstQuestion)

logService = LexLogService("questionnaire");

/*var history = [
	{
		question: firstQuestion,
		answer: firstAnswer
	}
];*/

var vue = new Vue({
	el: '#question-main',
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

			// Log step
			logService.click("questionOption", historyElement);

			if (newNodeId != -1) {
				this.questionString = questionTree[newNodeId].value;
				this.answerMap = questionTree[newNodeId].options;
			} else {
				this.nextPage();
			}
		},

		nextPage() {
			Lockr.set("history", this.history);
			logService.click("questionnaireFinish", this.history).then(function() {
				window.location.href = "email2.html";
			});
		},

		submitPressed() {
			Lockr.set("history", this.history);
			logService.click("questionnaireSubmit", this.history).then(function() {
				window.location.href = "email2.html";
			});
		},

		reset() {
			logService.click("questionnaireReset");

			this.questionString = root.value;
			this.answerMap = root.options;
			this.history = [];
		}	
	}
});
