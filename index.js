//This will be removed one list items are loaded since they'll all be created with the event listener
let checkboxes = document.getElementsByClassName("checkbox");
for (let i = 0; i < checkboxes.length; i++) {
	checkboxes[i].addEventListener("click", () => {
		//This is like really ugly but just putting !Boolean() around it doesn't work...
		swapCheckboxState(checkboxes[i]);
	});
};

////Set up checkboxes
const addCheckboxButton = document.getElementById("addCheckbox");
const addCheckboxText = document.getElementById("addCheckboxText");
const taskList = document.getElementById("taskList");

addCheckboxText.addEventListener("keypress", (e) => {
	if (e.key == "Enter") {
		addListItem();
	}
});

addCheckboxButton.addEventListener("click", () => {
	addListItem();
});

function swapCheckboxState(obj) {
	if (!obj.classList.contains("disabled")) {
		obj.dataset.state = obj.dataset.state == "true" ? false : true;
	};
}

function addListItem() {
	if (addCheckboxText.value.length > 0) {
		//Creates the parts of the checklist item
		let taskContainer = document.createElement("li");
		let taskSpan = document.createElement("span");
		let taskParagraph = document.createElement("p");

		//Assembles task container
		taskContainer.classList.add("item");

		//Assembles the checkbox
		taskSpan.classList.add("checkbox");
		taskSpan.draggable = true;
		taskSpan.addEventListener("click", (e) => { swapCheckboxState(e.target); });
		taskContainer.appendChild(taskSpan);

		//Assembles the text
		taskParagraph.innerText = addCheckboxText.value;
		taskParagraph.addEventListener("dblclick", (e) => { swapTextState(e.target); });
		taskContainer.appendChild(taskParagraph)

		//Clear value and insert to list
		addCheckboxText.value = "";
		taskList.insertBefore(taskContainer, taskList.childNodes[taskList.childNodes.length - 2]);
	}
}

function swapTextState(element) {
	if (element.nodeName == "P") {
		//Creates the parts of the checklist item which are modified
		let editText = document.createElement("input");
		let editButton = document.createElement("span");

		//Assembles the text input
		editText.type = "text";
		editText.value = element.innerText;
		editText.addEventListener("keypress", (e) => { if (e.key == "Enter") { swapTextState(e.target); }});//Need to add enter button for mobile support
		editText.addEventListener("focusout", (e) => { swapTextState(e.target); }); //Should I make defocusing reset text or no? ~~~~~~
		element.replaceWith(editText);

		//Assembles enter button
		editButton.id = "addCheckbox";
		editButton.addEventListener("click", (e) => { swapTextState(e.target.parentNode.childNodes[-2]); });
		editText.parentNode.appendChild(editButton);

		//Focus the user
		editText.focus();
	} else {
		const parent = element.parentNode;

		//Creates the element to use return to
		let text = document.createElement("p");

		//Assembles the paragraph
		text.innerText = element.value;
		text.addEventListener("dblclick", (e) => { swapTextState(e.target); });
		element.replaceWith(text);

		//Remove the enter button
		parent.removeChild(parent.lastChild);
	}
}
////

////List dragging functions
let dragged = null;

let draggableItems = taskList.childNodes.forEach(task => {
	task.draggable = true;
	task.addEventListener("dragover", (e) => {
		e.preventDefault;

		const target = e.target.closest(".item");
		if (!target || target === dragged) return;
		taskList.querySelectorAll(".item").forEach(i => {
			i.classList.remove("dragover");
		});
		target.classList.add("dragover");
		const rect = target.getBoundingClientRect();
		const middle = rect.top + rect.height / 2;
		if (e.clientY < middle) {
			taskList.insertBefore(dragged, target);
		} else {
			taskList.insertBefore(dragged, target.nextSibling);
		}
	});

	task.addEventListener("dragstart", (e) => {
		dragged = e.target;
		setTimeout(() => dragged.classList.add("dragging"), 0);
	});


	task.addEventListener("dragend", (e) => {
		dragged.classList.remove("dragging");
		taskList.querySelectorAll(".item").forEach(i => i.classList.remove("over"));
		dragged = null;
	});
});
////