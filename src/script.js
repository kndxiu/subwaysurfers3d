import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
/* Creating a new instance of the dat.GUI class. */
// import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    gsap,
    Linear,
    Power1
} from 'gsap'
import { degToRad } from 'three/src/math/MathUtils';
import { GridHelper } from 'three';

// Buttons

const goUp = document.getElementById("goUp")
const goLeft = document.getElementById("goLeft")
const goRight = document.getElementById("goRight")
const goDown = document.getElementById("goDown")

let coin, character, characterLoaded, floor, train, trainLoaded
let gameTimeVal = 0
let coins = 0
let playing = true
// Loader

const gltfLoader = new GLTFLoader()

const fontLoader = new THREE.FontLoader()

let tl = gsap.timeline()

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Lights

const hLight = new THREE.HemisphereLight(0xffeeb1, 0x80820, 1.5)
scene.add(hLight)

const sLight = new THREE.SpotLight(0xffa95c, 4)
sLight.castShadow = true
sLight.shadow.mapSize.height = 1024 * 4
sLight.shadow.mapSize.width = 1024 * 4
scene.add(sLight)

const aLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(aLight)


// Objects
const geometry = new THREE.BoxGeometry( 4, 0.7, 0.5 )
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff
});
const trainHitBox = new THREE.Mesh( geometry, material )
trainHitBox.position.y = 1

const geometry1 = new THREE.SphereGeometry( 0.4 )
const material1 = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0
});
const characterHitBox = new THREE.Mesh( geometry1, material1 )
characterHitBox.position.y = 0.7
scene.add( characterHitBox )
scene.add(trainHitBox)

gltfLoader.load('/models/character/scene.gltf', function(gltf) {
        character = gltf.scene
        character.scale.set(0.65, 0.65, 0.65)
        scene.add(character)
        characterLoaded = true
        scene.traverse(function(charModel) {
            if (charModel.isMesh) {
                charModel.castShadow = true
                charModel.receiveShadow = true
            }
        })
        character.position.set(2.5, 0, -4.5)
        goUp.addEventListener("click", () => {
            // tl.add("up")
            // .to(character.position, {"z": character.position.z + 1, ease: Power1, duration: 0.1, stagger: .1}, "up")
            // .to(character.rotation, {"y": 0, ease: Power1, duration: 0.1, stagger: .1}, "up")
            if(playing === true){
                if(character.position.z < 4.5)
                    character.position.z = character.position.z + 1
                character.rotation.y = 0
                checkPos()
            }
        })
        goDown.addEventListener("click", () => {
            // tl.add("down")
            // .to(character.position, {"z": character.position.z - 1, ease: Power1, duration: 0.1, stagger: .1}, "down")
            // .to(character.rotation, {"y": THREE.Math.degToRad(180), ease: Power1, duration: 0.1, stagger: .1}, "down")
            if(playing === true){
                if(character.position.z > -4.5)
                    character.position.z = character.position.z - 1
                character.rotation.y = THREE.Math.degToRad(180)
                checkPos()
            }
        })
        goLeft.addEventListener("click", () => {
            // tl.add("left")
            // .to(character.position, {"x": character.position.x + 1, ease: Power1, duration: 0.1, stagger: .1}, "left")
            // .to(character.rotation, {"y": THREE.Math.degToRad(90), ease: Power1, duration: 0.1, stagger: .1}, "left")
            if(playing === true){
                if(character.position.x < 4.5)
                    character.position.x = character.position.x + 1
                character.rotation.y = THREE.Math.degToRad(90)
                checkPos()
            }
        })
        goRight.addEventListener("click", () => {
            // tl.add("right")
            // .to(character.position, {"x": character.position.x - 1, ease: Power1, duration: 0.1, stagger: .1}, "left")
            // .to(character.rotation, {"y": THREE.Math.degToRad(-90), ease: Power1, duration: 0.1, stagger: .1}, "left")
            if(playing === true){
                if(character.position.x > -4.5)
                    character.position.x = character.position.x - 1
                character.rotation.y = THREE.Math.degToRad(-90)
                checkPos()
            }
        })

        window.addEventListener("keydown", (e) => {
            if(event.keyCode === 87 || event.keyCode === 38){
                if(playing === true){
                    if(character.position.z < 4.5)
                        character.position.z = character.position.z + 1
                    character.rotation.y = 0
                    checkPos()
                }
            }
            if(event.keyCode === 83 || event.keyCode === 40){
                if(playing === true){
                    if(character.position.z > -4.5)
                        character.position.z = character.position.z - 1
                    character.rotation.y = THREE.Math.degToRad(180)
                    checkPos()
                }
            }
            if(event.keyCode === 65 || event.keyCode === 37){
                if(playing === true){
                    if(character.position.x < 4.5)
                        character.position.x = character.position.x + 1
                    character.rotation.y = THREE.Math.degToRad(90)
                    checkPos()
                }
            }
            if(event.keyCode === 68 || event.keyCode === 39){
                if(playing === true){
                    if(character.position.x > -4.5)
                        character.position.x = character.position.x - 1
                    character.rotation.y = THREE.Math.degToRad(-90)
                    checkPos()
                }
            }
        })
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }

)

gltfLoader.load('/models/coin/scene.gltf', function(gltf) {
        coin = gltf.scene
        coin.scale.set(3.25, 3.25, 3.25)
        scene.add(coin)
        scene.traverse(function(coinModel) {
            if (coinModel.isMesh) {
                coinModel.castShadow = true
                coinModel.receiveShadow = true
                if (coinModel.material.map) {
                    coinModel.material.map.anisotropy = 16
                }
                trainHitBox.castShadow = false
                characterHitBox.castShadow = false
            }
        })
        tl.to(coin.rotation, {"y":THREE.Math.degToRad(360), ease:Linear.easeNone, repeat:-1, duration: 2})
        coin.position.set(Math.floor(Math.random() * 9) - 4 + ".5", 0, Math.floor(Math.random() * 9) - 4 + ".5")
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

gltfLoader.load('/models/directionHelper/scene.gltf', function(gltf) {
        const plane = gltf.scene
        plane.scale.set(1, 1, 1)
        plane.position.y = 0.5
        plane.rotation.y = THREE.Math.degToRad(180)
        scene.add(plane)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

gltfLoader.load('/models/floor/floor.gltf', function(gltf) {
        floor = gltf.scene
        floor.scale.set(1, 1, 1)
        floor.position.y = -0.25
        floor.rotation.y = THREE.Math.degToRad(-90)
        scene.add(floor)
        scene.traverse(function(floorModel) {
            if (floorModel.isMesh) {
                floorModel.castShadow = true
                floorModel.receiveShadow = true
                if (floorModel.material.map) {
                    floorModel.material.map.anisotropy = 16
                }
                trainHitBox.castShadow = false
                characterHitBox.castShadow = false
            }
        })
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

gltfLoader.load('/models/train/scene.gltf', function(gltf) {
        train = gltf.scene
        train.scale.set(0.08, 0.08, 0.08)
        train.position.y = 15
        train.rotation.y = THREE.Math.degToRad(90)
        scene.add(train)
        scene.traverse(function(trainModel) {
            if (trainModel.isMesh) {
                trainModel.castShadow = true
                trainModel.receiveShadow = true
                if (trainModel.material.map) {
                    trainModel.material.map.anisotropy = 16
                }
            }
        })
        // gui.add(train.position, 'x').min(-10).max(10).step(0.01)
        trainLoaded = true
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)


function checkPos(){
    if(coin.position.x == character.position.x && coin.position.z == character.position.z){
        coins++
        coin.position.set(Math.floor(Math.random() * 9) - 4 + ".5", 0, Math.floor(Math.random() * 9) - 4 + ".5")
    }
}

fontLoader.load('./fonts/Digital-7_Regular.json', function (font) {
    let replaced = false

    let textGeometry = new THREE.TextGeometry(`Score: ${coins}`, {
        font: font,
        size: 1,
        height: 1
    })

    let textMesh = new THREE.Mesh(textGeometry, [
        new THREE.MeshBasicMaterial({
            color: 0x00ff00
        })
    ])

    let textGeometry2 = new THREE.TextGeometry(`Score: ${coins}`, {
        font: font,
        size: 1,
        height: 1
    })

    let textMesh2 = new THREE.Mesh(textGeometry2, [
        new THREE.MeshBasicMaterial({
            color: 0x00ff00
        })
    ])

    function updateScore(){
        if(replaced === false){
            textGeometry2 = new THREE.TextGeometry(`Score: ${coins}`, {
                font: font,
                size: 0.65,
                height: 1
            })
            
            textMesh2 = new THREE.Mesh(textGeometry, [
                new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                })
            ])
            
            textMesh2.scale.set(.3, .3, .3)
            textMesh2.position.x = -2.9
            textMesh2.position.y = 4.15
            textMesh2.position.z = 0.30
            textMesh2.rotation.y = THREE.Math.degToRad(180 - 13)

            scene.add(textMesh2)
            scene.remove(textMesh)
        }
        else{
            textGeometry = new THREE.TextGeometry(`Score: ${coins}`, {
                font: font,
                size: 0.65,
                height: 1
            })

            textMesh = new THREE.Mesh(textGeometry2, [
                new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                })
            ])
        
            textMesh.scale.set(.3, .3, .3)
            textMesh.position.x = -2.9
            textMesh.position.y = 4.15
            textMesh.position.z = 0.30
            textMesh.rotation.y = THREE.Math.degToRad(180 - 13)

            scene.remove(textMesh2)
            scene.add(textMesh)
        }

        replaced = !replaced
        setTimeout(() => {
            updateScore()
        }, 20);
    }
    updateScore()

    function gameTime(){
        gameTimeVal = gameTimeVal + 1
        setTimeout(() => {
            gameTime()
        }, 1000);
    }

    gameTime()
})

function restart(){
    if(characterLoaded === true){
        character.position.set(2.5, 0, -4.5)
        character.rotation.set(0, 0, 0)
        playing = true
        document.getElementById("overlay").classList.remove("vis")
        character.scale.set(0.65, 0.65, 0.65)
        gameTimeVal = 0
    }
}

function die(){
    if(characterLoaded === true){
        character.rotation.x = THREE.Math.degToRad(90)
        character.rotation.y = THREE.Math.degToRad(180)
        character.scale.x = 1.2
        character.scale.z = 0.3
        document.getElementById("score").innerHTML = `Score: ${coins}`
        document.getElementById("gameTime").innerHTML = `Game time: ${gameTimeVal}s`
        document.getElementById("overlay").classList.add("vis")
        document.getElementById("restartBtn").addEventListener("click", () => {
            restart()
        })
        coins = 0
        gameTimeVal = 0
    }
}

function trainRoulette(){
    let willRun = Math.floor(Math.random() * 2)
    if(willRun == 0){
        if(trainLoaded === true){
            let tunnel = Math.floor(Math.random() * 3)
            let side = Math.floor(Math.random() * 2)
            if(tunnel == 0){
                train.position.z = 2.9
            }
            else if(tunnel == 1){
                train.position.z = 0
            }
            else if(tunnel == 2){
                train.position.z = -3.1
            }
            train.position.y = 0
            if(side == 0){
                train.position.x = 12
                const clock = new THREE.Clock()
                function runTrain1(){
                    if(train.position.x > -12){
                        const elapsedTime = clock.getElapsedTime()
                        train.position.x = 12 - (10 * elapsedTime)
                        requestAnimationFrame(runTrain1)
                    }
                    if(train.position.x <= -12){
                        train.position.y = 15
                    }
                }
                runTrain1()
            }
            else if(side == 1){
                train.position.x = -12
                const clock = new THREE.Clock()
                function runTrain0(){
                    if(train.position.x < 12){
                        const elapsedTime = clock.getElapsedTime()
                        train.position.x = -(12 - (10 * elapsedTime))
                        requestAnimationFrame(runTrain0)
                    }
                    if(train.position.x >= 12){
                        train.position.y = 15
                    }
                }
                runTrain0()
            }
            console.log(`TRAIN SPAWNED { \n    SIDE: ${side}\n    TUNNEL: ${tunnel}\n}`)
        }
    }

    setTimeout(() => {
        trainRoulette()
    }, 3000);
}

trainRoulette()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(2)
})

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 5000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = -5
scene.add(camera)
sLight.position.x = camera.position.x + 2
sLight.position.y = camera.position.y + 10
sLight.position.z = camera.position.z + 10

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotateSpeed = -1.25
controls.enablePan = false
controls.minDistance = 13
controls.maxDistance = 25
controls.minPolarAngle = THREE.Math.degToRad(60)
controls.maxPolarAngle = THREE.Math.degToRad(60)
controls.maxAzimuthAngle = THREE.Math.degToRad(-140)
controls.minAzimuthAngle = THREE.Math.degToRad(140)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2);
renderer.shadowMap.enabled = true
renderer.shadowMapSoft = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.3


/**
 * Animate
 */


const tick = () =>
{

    // Update objects
    if(trainLoaded === true && characterLoaded === true){
        trainHitBox.position.set(train.position.x, train.position.y + 1, train.position.z)
        characterHitBox.position.set(character.position.x, characterHitBox.position.y, character.position.z)
        characterHitBox.rotation.set(0, character.rotation.y, 0)
        const trainBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        trainBB.setFromObject(trainHitBox)

        const characterBB = new THREE.Sphere(characterHitBox.position, 1)
        if(trainBB.intersectsSphere(characterBB) && playing === true){
            playing = false
            die()
        }
    }
    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()