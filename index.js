//Code consts
const taskList = document.getElementById("taskList");

////Save and load code
function save() {
	let toSave = [];
	document.querySelectorAll("li.item").forEach(li => {
		toSave.push({ text: li.querySelector("p").innerText, checked: li.querySelector(".checkbox").dataset.state == "true" });
	});
	localStorage.setItem("savedListItems", JSON.stringify(toSave));
	//console.log(localStorage.getItem("savedListItems")); //remove me! ~~~~~~
}

function load() {
	taskList.innerHTML = "";
	JSON.parse(localStorage.getItem("savedListItems")).forEach(li => {
		addListItem(li.text, li.checked);
	});
}
////

//This will be removed one list items are loaded since they'll all be created with the event listener
let checkboxes = document.getElementsByClassName("checkbox");
for (let i = 0; i < checkboxes.length; i++) {
	checkboxes[i].addEventListener("click", (e) => {
		//This is like really ugly but just putting !Boolean() around it doesn't work...
		swapCheckboxState(e.target);
	});
};

////Set up checkboxes
const addCheckboxButton = document.getElementById("addCheckbox");
const addCheckboxText = document.getElementById("addCheckboxText");

addCheckboxText.addEventListener("keypress", (e) => {
	if (e.key == "Enter") {
		addListItem(addCheckboxText.value);
	}
});

addCheckboxButton.addEventListener("click", () => {
	addListItem(addCheckboxText.value);
});

function swapCheckboxState(obj) {
	if (!obj.classList.contains("disabled")) {
		obj.dataset.state = obj.dataset.state == "true" ? false : true;
		save(); //Save list automatically
	};
}

function addListItem(text, checked = false) {
	if (text.length > 0) {
		//Creates the parts of the checklist item
		let taskContainer = document.createElement("li");
		let taskSpan = document.createElement("span");
		let taskParagraph = document.createElement("p");
		let taskHandle = document.createElement("span");

		//Assembles task container
		taskContainer.classList.add("item");

		//Assembles the checkbox
		taskSpan.classList.add("checkbox");
		taskSpan.dataset.state = String(checked);
		taskSpan.addEventListener("click", (e) => { swapCheckboxState(e.target); });
		taskContainer.appendChild(taskSpan);

		//Assembles the text
		taskParagraph.innerText = text;
		taskParagraph.addEventListener("dblclick", (e) => { swapTextState(e.target); });
		taskContainer.appendChild(taskParagraph)

		//Assembles the handle
		taskHandle.innerText = "܍"; //Will replace this symbol with an svg or something later ~~~~~~
		taskHandle.classList.add("handle");
		taskContainer.appendChild(taskHandle)

		//Final steps
		taskSpan.draggable = true;
		applyDragEvents(taskContainer);

		//Clear value and insert to list
		addCheckboxText.value = "";
		taskList.appendChild(taskContainer);
	}
}

//Swaps the state for editing a list item
async function avoidFocusOutClick(e) {
	e.preventDefault();
	return new Promise(resolve => {
		document.addEventListener("mouseup", (f) => {
			resolve(document.elementFromPoint(f.clientX, f.clientY) == e.target);
		}, { once: true })
	});
}

async function swapTextState(element) {
    if (element.dataset.processing) return; //Stop the error from enter causing double event fire
    element.dataset.processing = "true";
	if (element.nodeName == "P") {
		//Creates the parts of the checklist item which are modified
		let editText = document.createElement("input");
		let editButton = document.createElement("span");
		let taskTrash = document.createElement("span");

		//Assembles the text input
		editText.type = "text";
		editText.value = element.innerText;
		editText.addEventListener("keypress", (e) => { if (e.key == "Enter") { swapTextState(e.target); }});//Need to add enter button for mobile support
		element.replaceWith(editText);

		const parent = editText.parentNode;

		//Assembles enter button
		editButton.id = "addCheckbox";
		editButton.addEventListener("mousedown", async (e) => { if (await avoidFocusOutClick(e)) { swapTextState(e.target.parentNode.querySelector("input[type='text']")); }});
		editText.addEventListener("focusout", (e) => { swapTextState(e.target); }); //Should I make defocusing reset text or no? ~~~~~~
		parent.insertBefore(editButton, parent.lastChild);

		//Assembles the trash
		taskTrash.innerText = "🗑️";
		taskTrash.classList.add("trash");
		taskTrash.addEventListener("mousedown", async (e) => { if (await avoidFocusOutClick(e)) { parent.remove(); save(); }});//parent.remove(); 
		parent.insertBefore(taskTrash, parent.lastChild);

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
		parent.removeChild(parent.querySelector("#addCheckbox"));
		parent.removeChild(parent.querySelector(".trash"));

		save(); //Save list automatically
	}
    element.dataset.processing = "false";
}
////

////List dragging functions
let dragged = null;

let draggableItems = taskList.childNodes.forEach(task => {
	applyDragEvents(task) //I'll be removing this loop once I add items in from stored data rather than modifying the default items
});

function applyDragEvents(item) {
	item.draggable = true;
	item.addEventListener("dragover", (e) => {
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

	item.addEventListener("dragstart", (e) => {
		if (!document.elementFromPoint(e.clientX, e.clientY).classList.contains("handle")) { e.preventDefault(); return; }
		dragged = e.target.closest(".item");
		setTimeout(() => dragged.classList.add("dragging"), 0);
	});


	item.addEventListener("dragend", (e) => {
		dragged.classList.remove("dragging");
		taskList.querySelectorAll(".item").forEach(i => i.classList.remove("over"));
		dragged = null;
		save(); //Save list automatically
	});
}
////



////Code to run at page load
load();