function initColorPicker(){
	var canvas = document.getElementById('color-picker'),
        smallAim = document.getElementById('small-aim');
        ctx = canvas.getContext('2d'),
        image = new Image();

	image.onload = function () {
	    ctx.drawImage(image, 0, 0, image.width, image.height);
	}
	image.src = 'images/colorwheel.png';

    canvas.addEventListener('click', function(event) {
    	var coords = getRelativeCoords(event), 
    	    x = coords.x, 
    	    y = coords.y,
    	    radius = canvas.width / 2,
    	    dx = radius - x,
    	    dy = radius - y,
    	    distance = Math.sqrt(dx*dx + dy*dy);

	    if(distance >= radius){
	    	return;
	    }
	    
        var imageData = ctx.getImageData(x, y, 1, 1);
        var pixel = imageData.data;

        currentColor.setColor(pixel[0]/255, pixel[1]/255, pixel[2]/255);
    }, false);

    canvas.addEventListener('mouseover', function(event){
        var coords = getRelativeCoords(event), 
            x = coords.x, 
            y = coords.y,
            radius = canvas.width / 2,
            dx = radius - x,
            dy = radius - y,
            distance = Math.sqrt(dx*dx + dy*dy);

        if(distance >= radius){
            return;
        }

        smallAim.style.top = y;
        smallAim.style.left = x;
    }, false);
};

function getRelativeCoords(event){
    if (event.offsetX !== undefined && event.offsetY !== undefined) {
    	{ return { x: event.offsetX, y: event.offsetY }; }
    }
    return { x: event.layerX, y: event.layerY };
};

function initColorPickerModal(){
    function setColorPickerHidden(hidden){
        document.getElementById("color-picker-wrap").setAttribute('data-hidden', hidden);
    }

    document.getElementById('color-picker-button').onclick = function(){
        setColorPickerHidden('false');
    }

    document.getElementById('color-picker-wrap').addEventListener('click', function(){
        setColorPickerHidden('true');
    }, false);
};