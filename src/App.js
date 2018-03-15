import React, { Component } from 'react';
import * as THREE from 'three';
import Bird from './Bird';
import Stats from 'stats.js';

let OrbitControls = require('three-orbit-controls')(THREE)

class App extends Component {
  componentDidMount() {
    this.initThree();
  }
  initThree() {
    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );
    const gravity = new THREE.Vector3(0, -0.003, 0);
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

    var pointLight = new THREE.PointLight( 0xffffff, 0.7 );
    pointLight.position.set( 10, 100, 50 );
    scene.add( pointLight );

    // var sphereSize = 1;
    // var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    // scene.add( pointLightHelper );

    const flappyConfig = {
      position: new THREE.Vector3(0, 0, 0),
      material: new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors, side: THREE.DoubleSide, flatShading: true})
    }
    const flappy = new Bird(flappyConfig);
    flappy.body.lookAt(10, 0, 10);
    scene.add(flappy.body);

    new OrbitControls(camera, this.refs.container);
    // const controls = new OrbitControls(camera, this.refs.container);
    console.log(flappy);
    let rise = true;
    let hoverPoint = 3;
    const animate = () => {
      this.stats.begin();
      flappy.applyForce(gravity);
      flappy.update();
      flappy.flapWings();
      if (flappy.body.position.y > hoverPoint && rise) {
        flappy.setFlapSpeed(6);
        rise = false;
      } else if (flappy.body.position.y < hoverPoint && !rise) {
        flappy.setFlapSpeed(8);
        rise = true;
      }
      renderer.render( scene, camera );
      this.stats.end();
      requestAnimationFrame( animate );
    }
    // controls.rotateSpeed = -0.3;
    animate();
    const handleClick = (e) => {

    }
    const handleKeydown = (event) => {
      const keyCode = event.keyCode
      const turnAngle = 4;
      // console.log(event);

      switch (keyCode) {
      case 65:
          console.log('Turn left');
          flappy.body.rotateY( turnAngle * -Math.PI / 180);
          break;
      case 68:
      console.log('Turn right');
          flappy.body.rotateY(turnAngle * Math.PI / 180);
          break;
      case 83:
          console.log('Turn up');
          flappy.body.rotateX( turnAngle * -Math.PI / 180);
          // flappy.applyForce(new THREE.Vector3(-0.01, 0, 0));
        break;
      case 87:
          console.log('Turn down');
          flappy.body.rotateX(turnAngle * Math.PI / 180);
          // flappy.applyForce(new THREE.Vector3(0.01, 0, 0));
        break;
      // case 38:
      //     console.log('Go up');
      //     hoverPoint++;     
      //     console.log('hoverPoint', hoverPoint);
      //   break;
      // case 38:
      //     console.log('Go down');
      //     hoverPoint--;
      //     console.log('hoverPoint', hoverPoint);
      //   break;
    
      default:
        break;
      }
    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    this.refs.container.addEventListener('click', handleClick);
    window.addEventListener('resize', onResize, false);
    document.addEventListener('keydown', handleKeydown);
  }
  render() {

    return (
      <div ref="container"></div>
    );
  }
}

export default App;
