import React, { Component } from 'react';
import * as THREE from 'three';
import Bird from './Bird';

let OrbitControls = require('three-orbit-controls')(THREE)

class App extends Component {
  componentDidMount() {
    this.initThree();
  }
  initThree() {
    const gravity = new THREE.Vector3(0, -0.01, 0);
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 50;
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setClearColor( 'hsl(200, 100%, 80%)', 1);
    renderer.setClearColor( 'hsl(200, 100%, 0%)', 1);
    this.refs.container.appendChild( renderer.domElement );

    // Make floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50, 2);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeeee, side: THREE.DoubleSide});
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.position.y = - 10;
    // scene.add(floor);

    let light = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(light);

    // var spotLight = new THREE.SpotLight( 0xffffff, 1 );
    // spotLight.position.set( 25, 25, 25 );
    // // spotLight.lookAt(0, 0, 0);
    // scene.add( spotLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.7 );
    pointLight.position.set( 10, 100, 50 );
    scene.add( pointLight );

    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    scene.add( pointLightHelper );

    // const lightHelper = new THREE.SpotLightHelper( spotLight );
		// scene.add( lightHelper );



    const flappyConfig = {
      position: new THREE.Vector3(0, 0, 0),
      material: new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors, side: THREE.DoubleSide, flatShading: true})
    }
    const flappy = new Bird(flappyConfig);
    flappy.body.lookAt(10, 0, 10);
    scene.add(flappy.body);

    const controls = new OrbitControls(camera, this.refs.container);
    function animate() {
      requestAnimationFrame( animate );
      flappy.applyForce(gravity);
      flappy.update();
      flappy.flapWings();
      renderer.render( scene, camera );
    }
    controls.rotateSpeed = -0.3;
    animate();
    const handleClick = (e) => {

    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    this.refs.container.addEventListener('click', handleClick);
    window.addEventListener('resize', onResize, false);
  }
  render() {

    return (
      <div ref="container"></div>
    );
  }
}

export default App;
