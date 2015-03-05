function initColorPicker(){
	var canvas = document.getElementById('color-picker');
    var ctx = canvas.getContext('2d');

	var image = new Image();
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

        CurrentColor.setColor(pixel[0], pixel[1], pixel[2]);

    	alert(x + ' - ' + y);
    }, false);
}

function getRelativeCoords(event){
    if (event.offsetX !== undefined && event.offsetY !== undefined) {
    	{ return { x: event.offsetX, y: event.offsetY }; }
    }
    return { x: event.layerX, y: event.layerY };
}