var CurrentColor = {
	setColor: function(r, g, b){
		_r = r;
		_g = g;
		_b = b;
		this._onColorChanged();
	},

    addColorChangedListener: function(listener){
    	this._colorChangedListeners.push(listener);
    },

	_r: 0,
	_g: 0,
	_b: 0,
	_colorChangedListeners: [],

	_onColorChanged: function(){
		var listeners = this._colorChangedListeners;
		for(var key in listeners){
			listeners[key].onColorChanged(_r, _g, _b);
		}
	}
};