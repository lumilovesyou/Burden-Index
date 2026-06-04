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
	let taskItem = document.createElement("li");
	taskItem.innerHTML = `<span class="checkbox"></span> ${addCheckboxText.value}`
	addCheckboxText.value = "";
	taskList.insertBefore(taskItem, taskList.childNodes[taskList.childNodes.length - 2]);
});

function swapState(obj) {
	if (!obj.classList.contains("disabled")) {
		obj.dataset.state = obj.dataset.state == "true" ? false : true;
	};
}