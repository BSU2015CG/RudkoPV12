function initCanvas() {
	var canvasMediator = {};
	canvasMediator.canvas = document.getElementById('picture-canvas');

	canvasMediator.imageChangedListeners = [];

	canvasMediator.addImageChangedEventListener = function(listener) {
		canvasMediator.imageChangedListeners.push(listener);
	};

	canvasMediator.getCurrentImageData = function() {
		return this.canvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

	canvasMediator.onImageChanged = function() {
		var width = this.canvas.width,
			height = this.canvas.height,
			imageData = this.getCurrentImageData().data;
		for(var i = 0; i < canvasMediator.imageChangedListeners.length; i++) {
			canvasMediator.imageChangedListeners[i](imageData);
		}
	};

	canvasMediator.loadImage = function(image) {
		var context = canvasMediator.canvas.getContext('2d');
		this.canvas.width = image.width;
		this.canvas.height = image.height;
		context.drawImage(image, 0, 0);
		canvasMediator.originalImage = this.getCurrentImageData();
		canvasMediator.onImageChanged();
		canvasMediator.brightness = 0;
		canvasMediator.contrast = 1;
	};

	canvasMediator.setBrightness = function(brightness) {
		this.brightness = brightness;
		this.applyFilters();
	}

	canvasMediator.setContrast = function(contrast) {
		this.contrast = 1 + contrast/100;
		this.applyFilters();
	}

	function initImageLoader() {
		document.getElementById('upload-button').addEventListener('click', function(e) {
			document.getElementById('load-image-button').click();
		}, false);
		document.getElementById('load-image-button').addEventListener('change', function(e) {
			var reader = new FileReader();
			reader.onload = function(event) {
		        var image = new Image();
		        image.onload = function() {
		        	canvasMediator.loadImage(image);
		        	document.getElementById('download-button').dataset.hidden = 'false';
		        }
		        image.src = event.target.result;
		    }
	        reader.readAsDataURL(e.target.files[0]);  
	    }, false);
	};

	function Histogram(name, color) {
		this.canvas = document.getElementById(name + '-histogram');
		this.color = color;
		this.setData = function(points, maxY) {
			var width = this.canvas.width,
			    height = this.canvas.height,
			    xScale = width / points.length,
			    yScale = height / maxY;
			    context = this.canvas.getContext('2d');
			context.clearRect (0, 0, this.canvas.width, this.canvas.height);
			context.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
			for (var i = 0; i < points.length; i++) {
				var left = xScale*i,
				    right = xScale*(i+1);

				context.fillRect(left, height - points[i]*yScale, right-left, points[i]*yScale);
			}
		}
	}

	var rHistogram = new Histogram('r', {r:255, g:0, b:0}),
		gHistogram = new Histogram('g', {r:0, g:255, b:0}),
		bHistogram = new Histogram('b', {r:0, g:0, b:255}),
		tHistogram = new Histogram('t', {r:0, g:0, b:0});

    var points = [];
    for(var i = 0; i < 4; i++) {
    	points[i] = [];
    }

    var avg = [];
    var avgBoxes = [
	    document.getElementById('r-avg'),
	    document.getElementById('g-avg'),
	    document.getElementById('b-avg'),
	    document.getElementById('t-avg')
    ];

    function updateComponents(imageData) {
    	for(var i = 0; i < 4; i++) {
    		avg[i] = 0;
    		for(var j = 0; j < 255; j++) {
    			points[i][j] = 0;
    		}
    	}
    	for(var i = 0; i < imageData.length; i+=4) {
    		for(var j = 0; j < 3; j++) {
    			var value = imageData[i + j];
    			points[j][value]++;
    			points[3][value] += 1/3;
    			avg[j] += value/255;
    			avg[3] += value/255/3;
    		}
    	}
    	for(var i = 0; i < 4; i++) {
    		avgBoxes[i].value = Math.round(avg[i]/(imageData.length/4)*100)/100;
    	}
    	var max = imageData.length/4/100;
    	rHistogram.setData(points[0], max);
    	gHistogram.setData(points[1], max);
    	bHistogram.setData(points[2], max);
    	tHistogram.setData(points[3], max);
    }

    canvasMediator.applyFilters = function() {
    	this.canvas.getContext('2d').putImageData(this.originalImage,0,0);
    	var imageData = this.canvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height);
		for(var i = 0; i < imageData.data.length; i += 4) {
			for(var j = 0; j < 3; j++) {
				imageData.data[i+j] = this.contrast*(imageData.data[i+j]-128)+128 + this.brightness;
			}
		}
		this.canvas.getContext('2d').putImageData(imageData, 0, 0);
		this.onImageChanged();
    }

    document.getElementById('brightness-control').addValueChangedListener(function(value){
    	canvasMediator.setBrightness(value);
    });

    document.getElementById('contrast-control').addValueChangedListener(function(value){
    	canvasMediator.setContrast(value);
    });

    canvasMediator.addImageChangedEventListener(updateComponents);
	initImageLoader();

	var downloadLink = document.createElement('a');
	document.getElementById('download-button').addEventListener('click', function(e) {
    	downloadLink.href = canvasMediator.canvas.toDataURL();
        downloadLink.download = "result.png";
        downloadLink.click();
    }, false);
};