let checkboxes = document.getElementsByClassName("checkbox");
for (let i = 0; i < checkboxes.length; i++) {
	checkboxes[i].addEventListener("click", () => {
		//This is like really ugly but just putting !Boolean() around it doesn't work...
		swapState(checkboxes[i]);
	});
};

const addCheckboxButton = document.getElementById("addCheckbox");
const addCheckboxText = document.getElementById("addCheckboxText");
const taskList = document.getElementById("taskList");

addCheckboxButton.addEventListener("click", () => {
	let taskContainer = document.createElement("li");
	let taskSpan = document.createElement("span");
	taskSpan.classList.add("checkbox");
	taskSpan.addEventListener("click", (e) => { swapState(e.target); });
	taskContainer.appendChild(taskSpan);
	taskContainer.innerHTML = taskContainer.innerHTML + addCheckboxText.value;
	addCheckboxText.value = "";
	taskList.insertBefore(taskContainer, taskList.childNodes[taskList.childNodes.length - 2]);
});

function swapState(obj) {
	if (!obj.classList.contains("disabled")) {
		obj.dataset.state = obj.dataset.state == "true" ? false : true;
	};
}