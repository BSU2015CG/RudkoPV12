 var Xr =  0.95047, Yr = 1, Zr = 1.08883, eps = 0.008856, k = 903.3;

var currentColor = {
	setColor: function(r, g, b, caller){
		_r = r;
		_g = g;
		_b = b;
		this._onColorChanged(caller);
	},

    addColorChangedListener: function(listener){
    	this._colorChangedListeners.push(listener);
    },

	_r: 0,
	_g: 0,
	_b: 0,
	_colorChangedListeners: [],

	_onColorChanged: function(caller){
		var listeners = this._colorChangedListeners;
		for(var key in listeners){
			if(caller != listeners[key]){
				listeners[key].onColorChanged(_r, _g, _b);
			}
		}
	}
}

function colorModel(a, b, c, fromRgbConverter, toRgbConverter) {
	this.components = [];
	this.controls = [];
	this.componentIndexes = [];
	for(var i = 0; i < 3; i++){
		var componentName = arguments[i],
		    controlId = componentName + "-control",
		    control = document.getElementById(controlId),
		    that = this;
		this.componentIndexes[componentName] = i;
		this.controls[componentName] = control;
		control.addValueChangedListener((function(that, name){
			return function(value){
				that.setComponent(name, value);
			    that.updateColor();
			    that.updateControls();
			}
		})(this, componentName));
	}
	this.updateColor = function(){
		var rgb = toRgbConverter.apply(this, this.components);
		currentColor.setColor(rgb.r, rgb.g, rgb.b, this);
	}
	this.setComponent = function(componentName, value){
		var index = this.componentIndexes[componentName];
		this.components[index] = value;
	}
	this.getComponent = function(componentName){
		var index = this.componentIndexes[componentName];
		return this.components[index];
	}
	this.updateControl = function(name, value){
		var control = this.controls[name],
		    min = parseInt(control.dataset.min),
		    max = parseInt(control.dataset.max), 
		    rgbs = [];
		for(var i = 0; i < 4; i++){
			var comps = this.components.slice();
			comps[this.componentIndexes[name]] = (max*i + (4 - i)*min)/4;
			rgbs.push(toRgbConverter.apply(this, comps));
		}
		control.setValue(Math.floor(value));
		control.setGradient(rgbs);
	},
	this.updateControls = function(){
		for(var key in this.componentIndexes){
			if(this.componentIndexes.hasOwnProperty(key)){
				var index = this.componentIndexes[key];
				var value = this.components[index];
				this.updateControl(key, value);
			}
		}
	},
	this.onColorChanged = function(r, g, b){
		var newComponents = fromRgbConverter(r, g, b);
		for(var key in newComponents){
			if(newComponents.hasOwnProperty(key)){
				var value = newComponents[key];
				this.setComponent(key, value);
			}
		}
		this.updateControls();
	}
}

function initHsv(){
	var hsv = new colorModel('h', 's', 'v', rgbToHsv, hsvToRgb);
	currentColor.addColorChangedListener(hsv);
}

function initXyz(){
	var xyz = new colorModel('x', 'ciey', 'z', rgbToXyz, xyzToRgb);
	currentColor.addColorChangedListener(xyz);
}

function initLab(){
	var lab = new colorModel('l', 'a', 'b', rgbToLab, labToRgb);
	currentColor.addColorChangedListener(lab);
}

function initCmyk(){
	var cmyk = new colorModel('c', 'm', 'y', rgbToCmyk, cmykToRgb);
	currentColor.addColorChangedListener(cmyk);
}

function initColorModels(){
	initHsv();
	initLab();
	initXyz();
	initCmyk();
}

function initRangeControls(){
	var controls = document.getElementsByClassName("range-control");
	for(var i = 0; i < controls.length; i++) {
		var box = document.createElement('input'),
		    range = document.createElement('input'),
		    warning = document.createElement('div'),
		    control = controls[i];

        box.type = 'number';
        range.type = 'range';
        warning.className = "warning-hidden";

        control.appendChild(box);
        control.appendChild(range);
        control.appendChild(warning);
        control.valueChangedListeners = [];
        control.inputs = [box, range];
        control.warning = warning;

        if(control.dataset.min === undefined){
        	control.dataset.min = "0";
        }
        if(control.dataset.max === undefined){
        	control.dataset.max = "100";
        }
        box.min = control.dataset.min;
    	range.min = control.dataset.min;
    	box.max = control.dataset.max;
    	range.max = control.dataset.max;

        var onComponentValueChanged = (function(c){
        	return function(){
        		var newValue = parseInt(this.value);
        		var val = parseInt(this.value),
        	        min = parseInt(c.dataset.min),
        	        max = parseInt(c.dataset.max);
        		if(isNaN(newValue) || newValue < min || newValue > max) {
        			this.value = c.value;
        			alert("Ай ай ай...");
        			return;
        		}
        		c.setValue(this.value);
        		c.valueChangedEvent();
        	}
        })(control);

        box.addEventListener('change', onComponentValueChanged);
        range.addEventListener('input', onComponentValueChanged);

        control.setGradient = function(rgbsArray){
        	var range = this.inputs[1];
        	var rgbs = [];
        	for(var i = 0; i < rgbsArray.length; i++){
        		rgbs.push(rgbToCss(rgbsArray[i]));
        	}
        	var gradient = "linear-gradient(to right, " + rgbs.join() + ")";
        	range.style.background = gradient;
        }

        control.setValue = function(value){
        	this.value = value;
        	for(var key = 0; key < this.inputs.length; key++){
        		this.inputs[key].value = value;
        	}
        	this.validate();
        };

        control.validate = function(){
        	var val = parseInt(this.value),
        	    min = parseInt(this.dataset.min),
        	    max = parseInt(this.dataset.max);
        	if(val > max || val < min) {
        		this.warning.className = "warning";
        	}
        	else {
        		this.warning.className = "warning-hidden";
        	}
        };

        control.valueChangedEvent = function(){
        	for(var key = 0; key < this.valueChangedListeners.length; key++){
        		this.valueChangedListeners[key](parseInt(this.value));
        	}
        };

        control.addValueChangedListener = function(listener){
        	this.valueChangedListeners.push(listener);
        };
	}
};

function rgbToCss(rgb){
	var rgbArray = [];
	rgbArray[0] = Math.round(rgb.r*255);
	rgbArray[1] = Math.round(rgb.g*255);
	rgbArray[2] = Math.round(rgb.b*255);
	for(var i = 0; i < 3; i++){
		if(rgbArray[i] < 0){
			rgbArray[i] = 0;
		}
		if(rgbArray[i] > 255){
			rgbArray[i] = 255;
		}
	}
	return "rgb(" + rgbArray.join() + ")";
}

