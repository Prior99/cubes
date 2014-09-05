function initGL(canvas, callback) {
	console.log("Initializing WebGL...");
	try {
		var gl = canvas.getContext("experimental-webgl");
		if(gl) {
			callback(false, gl);
		}
		else {
			callback("Could not initialize WebGL");
		}
	}
	catch(e) {
		callback("Could not initialize WebGL:" + e);
	}
}
