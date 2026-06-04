let checkboxes = document.getElementsByClassName("checkbox");
for (let i = 0; i < checkboxes.length; i++) {
	checkboxes[i].addEventListener("click", () => {
		//This is like really ugly but just putting !Boolean() around it doesn't work...
		checkboxes[i].dataset.state = checkboxes[i].dataset.state == "true" ? false : true;
	});
};