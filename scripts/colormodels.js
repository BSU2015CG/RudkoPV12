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
		document.getElementById('h-control').setValue(Math.floor(this._h));
		document.getElementById('s-control').setValue(Math.floor(this._s));
		document.getElementById('v-control').setValue(Math.floor(this._v));
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
		document.getElementById('c-control').setValue(Math.floor(this._c*100));
		document.getElementById('m-control').setValue(Math.floor(this._m*100));
		document.getElementById('y-control').setValue(Math.floor(this._y*100));
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

var XYZ = {
	_x: 0,
	_y: 0,
	_z: 0,

	setX: function(x){
		this._x = x;
		this.updateColor();
	},
	setY: function(y){
		this._y = y;
		this.updateColor();
	},
	setZ: function(z){
		this._z = z;
		this.updateColor();
	},
	onColorChanged: function(r, g, b){
		var xyz = rgbToXyz(r, g, b);
		this._x = xyz[0];
		this._y = xyz[1];
		this._z = xyz[2];
		this.updateComponents();
	},
	updateColor: function(){
		var rgb = xyzToRgb(this._x, this._y, this._z);
		currentColor.setColor(rgb[0], rgb[1], rgb[2], this);
	},
	updateComponents: function(){
		document.getElementById('x-control').setValue(Math.floor(this._x*100));
		document.getElementById('ciey-control').setValue(Math.floor(this._y*100));
		document.getElementById('z-control').setValue(Math.floor(this._z*100));
	},
	init: function(){
		currentColor.addColorChangedListener(this);
		var that = this;
		document.getElementById('x-control').addValueChangedListener(function(value){
			that.setX(value/100);
		});
		document.getElementById('ciey-control').addValueChangedListener(function(value){
			that.setY(value/100);
		});
		document.getElementById('z-control').addValueChangedListener(function(value){
			that.setZ(value/100);
		});
	}
};

var LAB = {
	_l: 0,
	_a: 0,
	_b: 0,

	setL: function(l){
		this._l = l;
		this.updateColor();
	},
	setA: function(a){
		this._a = a;
		this.updateColor();
	},
	setB: function(b){
		this._b = b;
		this.updateColor();
	},
	onColorChanged: function(r, g, b){
		var lab = rgbToLab(r,g,b);
		this._l = lab[0];
		this._a = lab[1];
		this._b = lab[2];
		this.updateComponents();
	},
	updateColor: function(){
		var rgb = labToRgb(this._l, this._a, this._b);
		currentColor.setColor(rgb[0], rgb[1], rgb[2], this);
	},
	updateComponents: function(){
		document.getElementById('l-control').setValue(Math.floor(this._l));
		document.getElementById('a-control').setValue(Math.floor(this._a));
		document.getElementById('b-control').setValue(Math.floor(this._b));
	},
	init: function(){
		currentColor.addColorChangedListener(this);
		var that = this;
		document.getElementById('l-control').addValueChangedListener(function(value){
			that.setL(value);
		});
		document.getElementById('a-control').addValueChangedListener(function(value){
			that.setA(value);
		});
		document.getElementById('b-control').addValueChangedListener(function(value){
			that.setB(value);
		});
	}
};

function initColorModels(){
	HSV.init();
	CMYK.init();
	XYZ.init();
	LAB.init();
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
        //warning.innerHTML = "!";

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

function rgbToXyz() {
	return matrixByVector(
		[[0.4124, 0.3576, 0.1805], 
		 [0.2126, 0.7152, 0.0722], 
		 [0.0913, 0.1192, 0.9505]],
		 arguments);
};

function xyzToRgb() {
	return matrixByVector(
		[[3.2408, -1.5372, -0.4985], 
		 [-0.9693, 1.8760, 0.0416], 
		 [0.0557, -0.2040, 1.0573]],
		 arguments);
};

function labToRgb(){
	var xyz = labToXyz.apply(this, arguments);
	return xyzToRgb.apply(this, xyz);
}

function rgbToLab(){
	var xyz = rgbToXyz.apply(this, arguments);
	return xyzToLab.apply(this, xyz);
}

function labToXyz(l, a, b) {
	var fy = (l+16)/116,
	    fz = fy - b/200,
	    fx = a/500 + fy,
	    fxpow3 = fx*fx*fx,
	    xr = fxpow3 > eps ? fxpow3 : (116*fx - 16)/k,
	    yr = l > k*eps ? Math.pow((l+16)/116, 3) : l/k,
	    fzpow3 = fz*fz*fz,
	    zr = fzpow3 > eps ? fzpow3 : (116*fz-16)/k;
	return [xr*Xr, yr*Yr, zr*Zr];
};

function xyzToLab(x, y, z) {
	var xr = x/Xr, yr = y/Yr, zr = z/Zr,
	    magic = function(a) {
	    	return a > eps ? Math.pow(a, 1/3) : (k*a + 16)/116;
	    },
	    fx = magic(xr),
	    fy = magic(yr),
	    fz = magic(zr);
	return [116*fy - 16, 500*(fx-fy), 200*(fy-fz)];
};

function matrixByVector(m, v) {
	var result = [];
	for(var i = 0; i < m.length; i++){
		var sum = 0;
		for(var j = 0; j < v.length; j++){
			sum += m[i][j]*v[j];
		}
		result.push(sum);
	}
	return result;
};