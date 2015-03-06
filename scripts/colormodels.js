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

var HSV =  {
	_h: 0,
	_s: 0,
	_v: 0,

	setH: function(h){
		this._h = h;
		this.updateColor();
	},
	setS: function(s){
		this._s = s;
		this.updateColor();
	},
	setV: function(v){
		this._v = v;
		this.updateColor();
	},
	onColorChanged: function(r, g, b){
		var min = Math.min(r, g, b),
		    max = Math.max(r, g, b),
		    diff = max - min, h;

		if(max == min){
			h = 0;
		} else if(r == max){
			h = 60*(g - b)/diff;
			if(g < b) {
				this.h += 360;
			}
		} else if(g == max){
			h = 60*(b - r)/diff + 120;
		} else if(b == max){
			h = 60*(r - g)/diff + 240;
		}

        this._h = h;
		this._s = (max == 0 ? 0 : 1 - min/max)*100;
		this._v = max*100;
		this.updateComponents();
	},
	updateColor: function(){
		var hi = Math.floor(this._h/60),
		    vmin = (100-this._s)*this._v/100,
		    a = (this._v - vmin)*(this._h % 60)/60,
		    vinc = vmin + a,
		    vdec = this._v - a, r, g, b;
		switch(hi){
			case 0:
			    r = this._v; g = vinc; b = vmin;
			break;
			case 1:
			    r = vdec; g = this._v; b = vmin;
			break;
			case 2:
			    r = vmin; g = this._v; b = vinc;
			break;
			case 3: 
			    r = vmin; g = vdec; b = this._v;
			break;
			case 4:
			    r = vinc; g = vmin; b = this._v;
			break;
			case 5: 
			    r = this._v; g = vmin; b = vdec;
			break;
		}
		currentColor.setColor(r/100, g/100, b/100, this);
	},
	updateComponents: function(){
		document.getElementById('h-control').setValue(this._h);
		document.getElementById('s-control').setValue(this._s);
		document.getElementById('v-control').setValue(this._v);
	},
	init: function(){
		currentColor.addColorChangedListener(this);
		var that = this;
		document.getElementById('h-control').addValueChangedListener(function(value){
			that.setH(value);
		});
		document.getElementById('s-control').addValueChangedListener(function(value){
			that.setS(value);
		});
		document.getElementById('v-control').addValueChangedListener(function(value){
			that.setV(value);
		});
	}
};

var CMYK =  {
	_c: 0,
	_m: 0,
	_y: 0,
	_k: 0,

	setC: function(c){
		this._c = c;
		this.updateColor();
	},
	setM: function(m){
		this._m = m;
		this.updateColor();
	},
	setY: function(y){
		this._y = y;
		this.updateColor();
	},
	setK: function(k){
		this._k = k;
		updateColor();
	},
	onColorChanged: function(r, g, b){
		var c = 1 - r,
		    m = 1 - g, 
		    y = 1 - b,
		    k = Math.min(c, m, y);
		this._c = c - k;
		this._m = m - k;
		this._y = y - k;
		this._k = k;
		this.updateComponents();
	},
	updateColor: function(){
		var c = this._c + this._k,
		    m = this._m + this._k,
		    y = this._y + this._k;
		currentColor.setColor(1-c, 1-m, 1-y, this);
	},
	updateComponents: function(){
		document.getElementById('c-control').setValue(this._c*100);
		document.getElementById('m-control').setValue(this._m*100);
		document.getElementById('y-control').setValue(this._y*100);
	},
	init: function(){
		currentColor.addColorChangedListener(this);
		var that = this;
		document.getElementById('c-control').addValueChangedListener(function(value){
			that.setC(value/100);
		});
		document.getElementById('m-control').addValueChangedListener(function(value){
			that.setM(value/100);
		});
		document.getElementById('y-control').addValueChangedListener(function(value){
			that.setY(value/100);
		});
	}
};

function initColorModels(){
	HSV.init();
	CMYK.init();
}

function initRangeControls(){
	var controls = document.getElementsByClassName("range-control");
	for(var i = 0; i < controls.length; i++) {
		var box = document.createElement('input'),
		    range = document.createElement('input'),
		    control = controls[i];

        box.type = 'number';
        range.type = 'range';

        control.appendChild(box);
        control.appendChild(range);
        control.valueChangedListeners = [];
        control.inputs = [box, range];

        if(control.dataset.min !== undefined){
        	box.min = control.dataset.min;
        	range.min = control.dataset.min;
        }
        if(control.dataset.max !== undefined){
        	box.max = control.dataset.max;
        	range.max = control.dataset.max;
        }

        var onComponentValueChanged = (function(c){
        	return function(){
        		c.setValue(this.value);
        		c.valueChangedEvent();
        	}
        })(control);

        box.addEventListener('change', onComponentValueChanged);
        range.addEventListener('input', onComponentValueChanged);

        control.setValue = function(value){
        	this.value = value;
        	for(var key = 0; key < this.inputs.length; key++){
        		this.inputs[key].value = value;
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
