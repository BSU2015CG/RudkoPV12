function init(){
	initColorPicker();
	var resultColorBoxes = document.getElementsByClassName('result-color-box');
	var resultColorBoxCallback = function(r,g,b){
		for(var key = 0; key < resultColorBoxes.length; key++){
			resultColorBoxes[key].style.background = 'rgb('+r+','+g+','+b+')';
		}
	}
	CurrentColor.addColorChangedListener({onColorChanged: resultColorBoxCallback});
	CurrentColor.setColor(0, 240, 0);
}

init();