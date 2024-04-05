import * as THREE from 'three'
import {OrbitControls} from "three/addons"
import {gsap} from "gsap"
import vertexShader from '/shaders/vertex.glsl'
import fragmentShader from '/shaders/fragment.glsl'
import atmosphereVertexShader from '/shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from '/shaders/atmosphereFragment.glsl'

/**
 *
 * Set up
 */

//Scene
const scene = new THREE.Scene()

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.y = 300
camera.lookAt(0,0,0)
scene.add(camera)


//Canvas
const canvas = document.querySelector('canvas.webgl')

//Controls
const controls = new OrbitControls(camera, canvas)
controls.target = new THREE.Vector3(0,0,0)
controls.enableDamping = true
controls.maxDistance = 300
controls.minDistance = 50

//Loading manager + loading bar
const loadingManager = new THREE.LoadingManager()
const loadingBarElement = document.querySelector('.loading-bar')

/**
 *
 * Textures
 */
const textureLoader = new THREE.TextureLoader(loadingManager)

// Earth
const  earthColorTexture = textureLoader.load("/textures/earth_color.png")

// Sun
const sunColorTexture = textureLoader.load(('/textures/sun.jpg'))

// Mercury
const mercuryColorTexture = textureLoader.load('/textures/mercury_color.jpg')

// Venus
const venusColorTexture = textureLoader.load('/textures/venus.jpg')


// Mars
const marsColorTexture = textureLoader.load('/textures/mars.jpg')


const jupiterColorTexture = textureLoader.load('/textures/jupiter.jpg')

const saturnColorTexture = textureLoader.load('/textures/saturn.jpg')
const saturnRingTexture = textureLoader.load('/textures/saturnringcolor.jpg')
saturnRingTexture.rotation = Math.PI /2
const saturnRingAlphaTexture = textureLoader.load('/textures/saturnringpattern.png')
saturnRingAlphaTexture.rotation = Math.PI /2
saturnRingTexture.colorSpace = THREE.SRGBColorSpace

const uranusColorTexture = textureLoader.load('/textures/uranus.jpg')

const neptuneColorTexture = textureLoader.load('/textures/neptune.jpg')


//creating stars for the background
const parameters = {}
parameters.count = 500


let starGeometry = null
let starMaterial = null
let stars = null

const generateGalaxy = () =>
{
    starGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        positions[i3    ] = (Math.random() - 0.5) * 2000
        positions[i3 + 1] = (Math.random() - 0.5) * 2000
        positions[i3 + 2] = (Math.random() - 0.5) * 2000
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
     starMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })

    stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
}
generateGalaxy()

/**
 *
 * Planet dummies that function as parents for planets to imitate rotating around sun
 * Each rotates at a different speed
 */

const mercDummy = new THREE.Object3D()
const venusDummy = new THREE.Object3D()
const earthDummy = new THREE.Object3D()
const marsDummy = new THREE.Object3D()
const jupDummy = new THREE.Object3D()
const satDummy = new THREE.Object3D()
const uranDummy = new THREE.Object3D()
const nepDummy = new THREE.Object3D()

/**
 *
 * Creating planet meshes
 */

// Earth
const earthMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            colorTexture: { value: earthColorTexture},
            color: {value: new THREE.Vector3(0.3, 0.6, 1.0)}
    }}
)
const earth = new THREE.Mesh(new THREE.SphereGeometry(4.4, 32, 32), earthMaterial)
earthDummy.add(earth)
scene.add(earthDummy)
earth.position.x = 62


// Sun
const sun = new THREE.Mesh(new THREE.SphereGeometry(26,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: sunColorTexture},
        color: {value: new THREE.Vector3(1,1,0.5)}
    }
}))
scene.add(sun)

const sunAtmo = new THREE.Mesh(new THREE.SphereGeometry(35.5), new THREE.ShaderMaterial({ //glow around sun
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent : true
}) )
scene.add(sunAtmo)

//Mercury
const mercury = new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: mercuryColorTexture},
        color: {value: new THREE.Vector3(0.9,0.9,0.9)}
    }
}))

mercDummy.add(mercury)
scene.add(mercDummy)
mercury.position.x = 32


// Venus
const venus = new THREE.Mesh(new THREE.SphereGeometry(4,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: venusColorTexture},
        color: {value: new THREE.Vector3(1,0.7,0.2)}
    }
}))
venusDummy.add(venus)
scene.add(venusDummy)
venus.position.x = 44

// Mars
const mars = new THREE.Mesh(new THREE.SphereGeometry(1.2,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: marsColorTexture},
        color: {value: new THREE.Vector3(1,0.8,0.8)}
    },
}))
marsDummy.add(mars)
scene.add(marsDummy)
mars.position.x = 78

// Jupiter
const jupiter = new THREE.Mesh(new THREE.SphereGeometry(13.2,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: jupiterColorTexture},
        color: {value: new THREE.Vector3(0.5,0.3,0.1)}
    },
}))
jupDummy.add(jupiter)
scene.add(jupDummy)
jupiter.position.x = 100


// Saturn
const saturn = new THREE.Mesh(new THREE.SphereGeometry(11.2,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: saturnColorTexture},
        color: {value: new THREE.Vector3(0.9,0.7,0.1)}
    },
}))
satDummy.add(saturn)
scene.add(satDummy)


const saturnRingAround = new THREE.Mesh(new THREE.TorusGeometry(18.2, 3.5,2,100), new THREE.MeshBasicMaterial({
    map: saturnRingTexture, alphaMap : saturnRingAlphaTexture, transparent : true
}))

saturnRingAround.frustumCulled = false
saturn.add(saturnRingAround)
saturnRingAround.rotateX(90)
saturn.position.x = 138

// Uranus
const uranus = new THREE.Mesh(new THREE.SphereGeometry(6.2,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: uranusColorTexture},
        color: {value: new THREE.Vector3(0.2,0.2,0.9)}
    },
}))
uranDummy.add(uranus)
scene.add(uranDummy)
uranus.position.x = 176

// Neptune
const neptune = new THREE.Mesh(new THREE.SphereGeometry(6.2,32,32), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        colorTexture: {value: neptuneColorTexture},
        color: {value: new THREE.Vector3(0.3,0.4,0.8)}
    },
}))
nepDummy.add(neptune)
scene.add(nepDummy)
neptune.position.x = 200

/**
 *
 * Orbit rings
 */

const ringMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide})
const mercRing = new THREE.Mesh(new THREE.TorusGeometry(32.2,0.13,2, 100), ringMaterial)
mercRing.rotateX(Math.PI /2)
scene.add(mercRing)

const venusRing  = new THREE.Mesh(new THREE.TorusGeometry(44.2,0.13,2, 100), ringMaterial)
venusRing.rotateX(Math.PI /2)
scene.add(venusRing)

const earthRing  = new THREE.Mesh(new THREE.TorusGeometry(62.2,0.13,2, 100), ringMaterial)
earthRing.rotateX(Math.PI /2)
scene.add(earthRing)

const marsRing  = new THREE.Mesh(new THREE.TorusGeometry(78.2,0.13,2, 100), ringMaterial)
marsRing.rotateX(Math.PI /2)
scene.add(marsRing)

const jupiterRing  = new THREE.Mesh(new THREE.TorusGeometry(100.2,0.13,2, 100), ringMaterial)
jupiterRing.rotateX(Math.PI /2)
scene.add(jupiterRing)

const saturnRing  = new THREE.Mesh(new THREE.TorusGeometry(138.2,0.13,2, 100), ringMaterial)
saturnRing.rotateX(Math.PI /2)
scene.add(saturnRing)

const uranusRing  = new THREE.Mesh(new THREE.TorusGeometry(176.2,0.13,2, 100), ringMaterial)
uranusRing.rotateX(Math.PI /2)
scene.add(uranusRing)

const neptuneRing  = new THREE.Mesh(new THREE.TorusGeometry(200.2,0.13,2, 100), ringMaterial)
neptuneRing.rotateX(Math.PI /2)
scene.add(neptuneRing)


/**
 * Handling resizing
 */
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Black screen fading out when loading finished
 */
const overlayGeometry = new THREE.PlaneGeometry(2,2,1,1)
const overlayMaterial = new THREE.ShaderMaterial({
    transparent : true,
    uniforms:
        {
            uAlpha: { value: 1 } // Alpha of blackscreen
        },
    vertexShader:  `void main()
    {
        gl_Position =  vec4(position, 1.0); 
     }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


loadingManager.onProgress= (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})` // Updating loading bar
}
let sceneReady = false
loadingManager.onLoad= () =>{

    window.setTimeout( () => { // Waiting 6 seconds before fading into the actual scene
        gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0}) // Tween that fades out the black screen

        loadingBarElement.classList.add('ended')
        loadingBarElement.style.transform = ''
        sceneReady = true

        //Making Planet labels visible

        document.getElementById('mercury').classList.add('visible')
        document.getElementById('venus').classList.add('visible')
        document.getElementById('earth').classList.add('visible')
        document.getElementById('mars').classList.add('visible')
        document.getElementById('jupiter').classList.add('visible')
        document.getElementById('saturn').classList.add('visible')
        document.getElementById('uranus').classList.add('visible')
        document.getElementById('neptune').classList.add('visible')


    }, 600)
}



// Renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.render(scene, camera)

/**
 *
 * Structure to hold labels and corresponding planets
 */

const planetLabels = [ {
    planet : mercury,
    text : document.getElementById('mercury'),
    position : new THREE.Vector3(0,1,0)
}, {
    planet : venus,
    text : document.getElementById('venus'),
    position : new THREE.Vector3(0,1,0)
}, {
    planet : earth,
    text : document.getElementById('earth'),
    position : new THREE.Vector3(0,1,0)
}, {
    planet : mars,
    text : document.getElementById('mars'),
    position : new THREE.Vector3(0,1,0)
}, {
    planet : jupiter,
    text : document.getElementById('jupiter'),
    position : new THREE.Vector3(0,1,0)
}, {
    planet : saturn,
    text : document.getElementById('saturn'),
    position : new THREE.Vector3(0,1,0)
}, {
    planet : uranus,
    text : document.getElementById('uranus'),
    position : new THREE.Vector3(0,1,0)
}, {
    planet : neptune,
    text : document.getElementById('neptune'),
    position : new THREE.Vector3(0,1,0)
}
]

/**
 *
 * Animation
 */
const tick = () =>
{
    controls.update()
    if (sceneReady){
        for (const point of planetLabels){ // Updating Label position
            point.position.setFromMatrixPosition(point.planet.matrixWorld)
            point.position.project(camera)
            point.position.x = (point.position.x * sizes.width/2) + sizes.width/2
            point.position.y = (-(point.position.y * sizes.height/2) + sizes.height/2) - 30
            point.text.style.top = `${point.position.y}px`
            point.text.style.left = `${point.position.x}px`
        }

    }

    sun.rotateY(0.004)

    mercDummy.rotateY(0.04)
    mercury.rotateY(0.004)

    venusDummy.rotateY(0.015)
    venus.rotateY(0.015)

    earthDummy.rotateY(0.01)
    earth.rotateY(0.02)

    marsDummy.rotateY(0.008)
    mars.rotateY(0.018)

    jupDummy.rotateY(0.0025)
    jupiter.rotateY(0.04)

    satDummy.rotateY(0.001)
    saturn.rotateY(0.038)

    uranDummy.rotateY(0.0004)
    uranus.rotateY(0.03)

    nepDummy.rotateY(0.0001)
    neptune.rotateY(0.032)


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()