import * as THREE from 'three';

class Bird {
	constructor(props) {
		const { position, material } = props;
		this.position = position;
		this.body = new THREE.Mesh(this.buildGeometry(), material);
		this.flapOffset = 0;
		// this.flapRate = Math.floor(Math.random() * (0.05 - 0.04 + 1)) + 0.04;
		this.hoverForceMult = 10;
		this.fallForceMult = 11;
		this.flapSpeed = props.flapSpeed || 8;
		this.flapAngle = 0;
		this.flapDownRate = this.flapSpeed * Math.PI / 180;
		this.flapUpRate = 10 * Math.PI / 180;
		this.flapDown = true;
		this.flapDownMax = 60 * Math.PI / 180;
		this.flapUpMax = - 45 * Math.PI / 180;
		this.flapForce = 0.0001;
		// const min = -2;
		// const max = 2;
		// const x = Math.floor(Math.random() * (max - min + 1)) + min;
		// const y = Math.floor(Math.random() * (max - min + 1)) + min;
		// const z = Math.floor(Math.random() * (max - min + 1)) + min;
		// this.velocity = new THREE.Vector3(x, y, z);
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.axis = new THREE.Vector3(0, 0, 1);
		this.axis.normalize();
	}
	setFlapSpeed(speed) {
		this.flapSpeed = speed;
		this.flapDownRate = this.flapSpeed * Math.PI / 180;		
	}
	// addToAxis(vector) {
	// 	this.axis.add(vector);
	// 	console.log(this.axis);
	// 	this.axis.normalize();
	// 	console.log(this.axis);
	// }
	update() {
		this.velocity.add(this.acceleration);
		this.velocity.clampLength(0, 1);
		this.position.add(this.velocity);
		this.body.position.set(this.position.x, this.position.y, this.position.z);
		this.acceleration.multiplyScalar(0);
	}
	applyForce(force) {
		// console.log(force);
		this.acceleration.add(force);
	}
	buildGeometry() {
		const birdGeometry = new THREE.Geometry();
		birdGeometry.dynamic = true;
		birdGeometry.vertices.push(
		  new THREE.Vector3( -4, 0, 0 ),
		  new THREE.Vector3( -1, 0, 1 ),
		  new THREE.Vector3( -1, 0, -1 ),
		  new THREE.Vector3( 0, -1, -0.5 ),
		  new THREE.Vector3( 0, -1, 1.5 ),
		  new THREE.Vector3( 1, 0, 1 ),
		  new THREE.Vector3( 1, 0, -1 ),
		  new THREE.Vector3( 4, 0, 0 ),
		);

		birdGeometry.faces.push( new THREE.Face3( 2, 0, 1 ) );
		birdGeometry.faces.push( new THREE.Face3( 2, 1, 3 ) );
		birdGeometry.faces.push( new THREE.Face3( 3, 1, 4 ) );
		birdGeometry.faces.push( new THREE.Face3( 3, 4, 5 ) );
		birdGeometry.faces.push( new THREE.Face3( 3, 5, 6 ) );
		birdGeometry.faces.push( new THREE.Face3( 6, 5, 7 ) );

		
		// const red = new THREE.Color( 0xff0000 );
    // const green = new THREE.Color( 0x00ff00 );
		// const blue = new THREE.Color( 0x0000ff );
		
		// birdGeometry.faces[0].vertexColors = [red, green, blue]
		// birdGeometry.faces[1].vertexColors = [red, green, blue]
		// birdGeometry.faces[2].vertexColors = [red, green, blue]
		// birdGeometry.faces[3].vertexColors = [red, green, blue]
		// birdGeometry.faces[4].vertexColors = [red, green, blue]
		// birdGeometry.faces[5].vertexColors = [red, green, blue]
		
		const dark = new THREE.Color( 'hsl(0, 100%, 30%)' );
    const main = new THREE.Color( 'hsl(0, 100%, 50%)' );
		const bright = new THREE.Color( 'hsl(0, 100%, 70%)' );
		const accent = new THREE.Color( 'hsl(58, 100%, 70%)' );

		birdGeometry.faces[0].vertexColors = [main, bright, main]
		birdGeometry.faces[1].vertexColors = [main, main, dark]
		birdGeometry.faces[2].vertexColors = [dark, main, accent]
		birdGeometry.faces[3].vertexColors = [dark, accent, main]
		birdGeometry.faces[4].vertexColors = [dark, main, main]
		birdGeometry.faces[5].vertexColors = [main, main, bright]

		birdGeometry.computeFaceNormals();
		birdGeometry.computeVertexNormals();
		birdGeometry.computeBoundingSphere();
		// console.log(birdGeometry);
		return birdGeometry;
	}
	addToScene(scene) {
		this.body.position.set(this.position.x, this.position.y, this.position.z);
		const axis = new THREE.Vector3(1, 0, 0);
		axis.normalize();
		// let rotationMatrix = new THREE.Matrix4();

		// rotationMatrix.setRotationAxis( axis.normalize(), radians );
		// object.matrix.multiplySelf( rotationMatrix );
		// object.rotation.setRotationFromMatrix( object.matrix );
		// console.log(this.position);
		// this.body.rotation.set(0, Math.PI / 2, 0);
		// const angleAmount = 45 * Math.PI * 180;
		// this.body.rotateOnAxis(axis.normalize(), angleAmount);
		// this.body.rotateX(axis.x * Math.PI * 2);
		// this.body.rotateY(axis.y * Math.PI * 2);
		// this.body.rotateZ(axis.z * Math.PI * 2);
		// this.body.rotateY(axis.y);
		// this.body.rotateZ(axis.z);
		// console.log(this.body.rotation);
		scene.add(this.body);
	}
	flapWings() {
		// const vSpeed = this.body.rotation.x;
		// console.log(vSpeed);
		// this.applyForce(new THREE.Vector3(vSpeed, 0, 0));
		if (this.flapDown) {
			this.body.geometry.vertices[0].applyAxisAngle(this.axis, this.flapDownRate);
		  this.body.geometry.vertices[7].applyAxisAngle(this.axis, - this.flapDownRate);
			this.flapAngle += this.flapDownRate;
			const yForce = this.flapForce * (this.flapAngle + 45) / (this.flapDownMax + 45) * this.flapSpeed * this.flapSpeed;
			this.applyForce(new THREE.Vector3(0, yForce, 0));
		} else {
			this.body.geometry.vertices[0].applyAxisAngle(this.axis, - this.flapUpRate);
		  this.body.geometry.vertices[7].applyAxisAngle(this.axis, this.flapUpRate);
			this.flapAngle -= this.flapUpRate;
		}
		if (this.flapAngle > this.flapDownMax && this.flapDown) {
			this.flapDown = false;
		} else if(this.flapAngle < this.flapUpMax && !this.flapDown) {
			this.flapDown = true;
		}
		this.body.geometry.verticesNeedUpdate = true;
	}
}

export default Bird;