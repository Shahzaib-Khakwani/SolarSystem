import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

const textures = [];
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const starsTexture = cubeTextureLoader.load([
    '8k_stars.jpg',
    '8k_stars.jpg',
    '8k_stars.jpg',
    '8k_stars.jpg',
    '8k_stars.jpg',
    '8k_stars.jpg',
]);
const sunTexture = textureLoader.load('8k_sun.jpg');
const mercuryTexture = textureLoader.load('8k_mercury.jpg');
const venusTexture = textureLoader.load('4k_venus_atmosphere.jpg');
const earthTexture = textureLoader.load('8k_earth_daymap.jpg');
const marsTexture = textureLoader.load('8k_mars.jpg');
const jupiterTexture = textureLoader.load('8k_jupiter.jpg');
const saturnTexture = textureLoader.load('8k_saturn.jpg');
const saturnRingTexture = textureLoader.load('https://i.imgur.com/u0muMiZ.png');
const uranusTexture = textureLoader.load('2k_uranus.jpg');
const uranusRingTexture = textureLoader.load('https://i.imgur.com/F1y9Ve4.png');
const neptuneTexture = textureLoader.load('2k_neptune.jpg');
const plutoTexture = textureLoader.load('https://i.imgur.com/YNsmmHV.jpeg');

textures.push(
    starsTexture,
    sunTexture,
    mercuryTexture,
    venusTexture,
    earthTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    saturnRingTexture,
    uranusTexture,
    uranusRingTexture,
    neptuneTexture,
    plutoTexture
);

textures.forEach((texture)=> {
    texture.colorSpace = THREE.SRGBColorSpace; 
})

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000,
);

const orbitControl = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90,140,140);
orbitControl.update();

scene.background = starsTexture;

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10000, 300);
scene.add(pointLight);


const sunGeo = new THREE.SphereGeometry(16,30,30);
const sunMat = new THREE.MeshBasicMaterial({
    map:sunTexture,
})
const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);

function createPlanet(size,texture,position,ring) {
    const obj = new THREE.Object3D()
    const geo = new THREE.SphereGeometry(size,30,30);
    const mat = new THREE.MeshStandardMaterial({
        map:texture
    });
    const planet = new THREE.Mesh(geo, mat);
    obj.add(planet);
    if (ring) {
        const RingGeo = new THREE.RingGeometry(ring.innerRadius,ring.outerRadius,32);
        const RingMat = new THREE.MeshBasicMaterial({
            map:ring.texture,
            side:THREE.DoubleSide,
        })
        const Ring = new THREE.Mesh(RingGeo, RingMat);
        obj.add(Ring);
        Ring.position.x = position;
        Ring.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    planet.position.x =position;
    return{
        planet,obj
    }
}





const mercury = createPlanet(3.2,mercuryTexture,28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);
const saturn = createPlanet(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
  });
const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
  });




function animate() {
    sun.rotateY(0.004);
    mercury.planet.rotateY(0.004);
    venus.planet.rotateY(0.002);
    earth.planet.rotateY(0.02);
    mars.planet.rotateY(0.018);
    jupiter.planet.rotateY(0.04);
    saturn.planet.rotateY(0.038);
    uranus.planet.rotateY(0.03);
    neptune.planet.rotateY(0.032);
    pluto.planet.rotateY(0.008);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
