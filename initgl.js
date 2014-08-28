function initGL(canvas, callback) {
	console.log("Initializing WebGL...");
	try {
		var gl = canvas.getContext("experimental-webgl");
		if(gl) {
			callback(gl);
		}
		else {
			console.error("Could not initialize WebGL");
		}
	}
	catch(e) {
		console.error("Could not initialize WebGL:", e);
	}
}
