function rgbToCmyk(r, g, b){
	var c = 1 - r,
		m = 1 - g, 
		y = 1 - b,
		k = Math.min(c, m, y);
    return {c:c*100, m:m*100, y:y*100, k:k*100};
}

function cmykToRgb(c, m, y){
	return {r: 1-c/100, g: 1-m/100, b: 1-y/100};
}

function rgbToXyz() {
	var xyz = matrixByVector(
		[[0.4124, 0.3576, 0.1805], 
		 [0.2126, 0.7152, 0.0722], 
		 [0.0913, 0.1192, 0.9505]],
		 arguments);
	return {x:xyz[0]*100, ciey:xyz[1]*100, z:xyz[2]*100};
};

function xyzToRgb(x,ciey,z) {
	var rgb = matrixByVector(
		[[3.2408, -1.5372, -0.4985], 
		 [-0.9693, 1.8760, 0.0416], 
		 [0.0557, -0.2040, 1.0573]],
		 [x/100, ciey/100, z/100]);
	return {r:rgb[0], g:rgb[1], b:rgb[2]};
};

function labToRgb(){
	var xyz = labToXyz.apply(this, arguments);
	return xyzToRgb(xyz[0]*100, xyz[1]*100, xyz[2]*100);
}

function rgbToLab(){
	var xyz = rgbToXyz.apply(this, arguments),
	    lab = xyzToLab(xyz.x/100, xyz.ciey/100, xyz.z/100);
	return {l:lab[0], a:lab[1], b:lab[2]};
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

function hsvToRgb(h, s, v){
	var hi = Math.floor(h/60),
		    vmin = (100-s)*v/100,
		    a = (v - vmin)*(h % 60)/60,
		    vinc = vmin + a,
		    vdec = v - a, r, g, b;
		switch(hi){
			case 0:
			    r = v; g = vinc; b = vmin;
			break;
			case 1:
			    r = vdec; g = v; b = vmin;
			break;
			case 2:
			    r = vmin; g = v; b = vinc;
			break;
			case 3: 
			    r = vmin; g = vdec; b = v;
			break;
			case 4:
			    r = vinc; g = vmin; b = v;
			break;
			case 5: 
			    r = v; g = vmin; b = vdec;
			break;
		}
		return {r: r/100, g: g/100, b: b/100};
};

function rgbToHsv(r, g, b){
	var min = Math.min(r, g, b),
		    max = Math.max(r, g, b),
		    diff = max - min, h, s, v;

		if(max == min){
			h = 0;
		} else if(r == max){
			h = 60*(g - b)/diff;
			if(g < b) {
				h += 360;
			}
		} else if(g == max){
			h = 60*(b - r)/diff + 120;
		} else if(b == max){
			h = 60*(r - g)/diff + 240;
		}

		s = (max == 0 ? 0 : 1 - min/max)*100;
		v = max*100;

		return {h:h, s:s, v:v};
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