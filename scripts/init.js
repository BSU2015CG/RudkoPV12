function init(){
	initRangeControls();
	initColorPicker();
	initColorPickerModal();
	var resultColorBoxes = document.getElementsByClassName('result-color-box');
	var resultColorBoxCallback = function(r,g,b){
		for(var key = 0; key < resultColorBoxes.length; key++){
			r = Math.round(r*255);
			g = Math.round(g*255);
			b = Math.round(b*255);
			resultColorBoxes[key].style.background = 'rgb('+r+','+g+','+b+')';
		}
	}
	currentColor.addColorChangedListener({onColorChanged: resultColorBoxCallback});
	initColorModels();
	currentColor.setColor(0.4,0.3,0.7);
}

init();