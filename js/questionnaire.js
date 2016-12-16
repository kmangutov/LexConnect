
var QuestionTree = QuestionTree.get();
var root = QuestionTree[QuestionTree.root];
dump("question root", root)

log.info("Question root", root);

var firstAnswer = Lockr.get("FIRST_ANSWER");
var currentNode = QuestionTree[firstAnswer.nodeId];

dump("firstAnswer", firstAnswer);
dump("secondQuestion", currentNode);

var vue = new Vue({
	el: '#main',
	data: {
		questionString: "Is this drugs?",
		answerMap: currentNode.options
		 /*{
			"Alcohol": 40,
			"Drugs": 57
		}*/
	},
	methods: {
		selectOption(newNodeId, selectedText) {
			if (newNodeId != -1) {
				this.questionString = QuestionTree[newNodeId].value;
				this.answerMap = QuestionTree[newNodeId].options;
			} else {
				this.nextPage();
			}
		},

		nextPage() {
			alert("nextPage");
		}	
	}
});