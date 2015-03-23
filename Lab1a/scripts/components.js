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
        //range.addEventListener('change', onComponentValueChanged);

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

        control.setValue(0);
	}
};