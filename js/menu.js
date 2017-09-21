console.log(THREE);

// var global

var blogM;
var mouse, raycaster;
var blogEvent = [];

function init() {
    
    //Scene
    
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var clock = new THREE.Clock; 
    
    //Geometry
    

    
    //Lights
    
    var pointLight = getPointLight(1, 'rgb(255, 220, 180)');
    pointLight.position.y = 50;
    pointLight.position.z = 50;
    
    //Helper
    
    var sphHelper = getSphere(1);
    var gridHelper = getGrid(200, 50);
        gridHelper.visible = false;
    
    //Camera
    
    var camera = new THREE.PerspectiveCamera(
        45, // FOV
        window.innerWidth/window.innerHeight, // aspectRatio
        1, // nearPlane
        1000 // farPlane
    );        
        
    //External Geometry
    
    var manager = new THREE.LoadingManager();
            manager.onProgress = function( item, loaded, total ) {
                        console.log( item, loaded, total );
            };
    
    var onProgress = function( xhr ) {
        if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
          console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
          }
        };
        var onError = function( xhr ) {
          console.error( xhr );
        };
    
    //Blog
    
    var blogLoader = new THREE.FBXLoader(manager);
    var textureLoader = new THREE.TextureLoader();
        
        blogLoader.load('/asset/Blog/blog.fbx', function ( object ) {
            var colorMap = textureLoader.load('/asset/Blog/blog.jpg');
            var faceMaterial = getMaterial('rgb(255, 255, 255)');
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = faceMaterial;
                    faceMaterial.roughness = 1;
                    faceMaterial.map = colorMap;
                    faceMaterial.metalness = 0;
                }
            blogMesh = object;
            blogMesh.position.x = -60;
            scene.add(blogMesh);
            blogMesh.name = 'blog01';
            update(renderer, scene, camera, controls, clock);
            });
        });
    


    // Rig
    
    //CameraRig
    var cameraYpositionRig = new THREE.Group();
    var cameraZpositionRig = new THREE.Group();
    cameraZpositionRig.add(camera);
    cameraYpositionRig.add(cameraZpositionRig);
    scene.add(cameraYpositionRig);
    
    cameraZpositionRig.position.z = 115;
    cameraYpositionRig.position.y = 13;
    
    gui.add(cameraYpositionRig.position, 'y', 0, 200);
    gui.add(cameraZpositionRig.position, 'z', 0, 200);

    // Add to scene
    
    pointLight.add(sphHelper);
    scene.add(pointLight);
    scene.add(gridHelper);
    
    //Renderer
    
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(0, 0 , 0)');
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    
    //OrbitControls
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableKeys = false;
        
    //Resize
    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    return scene;
}
  

//getPointLight

    function getPointLight(intensity, color) {
        color = color === undefined ? 'rgb(255, 255, 255)' : color;
        var light = new THREE.PointLight(color, intensity);
        light.castShadow = true;

        return light;
    }

// getSphere

    function getSphere(size) {
        var geometry = new THREE.SphereGeometry(size, 24, 24);
        var material = new THREE.MeshBasicMaterial ({
            color: 'rgb(255,255,255)'
        });
        var mesh = new THREE.Mesh(
            geometry,
            material
        );

        return mesh;

    }

//getGrid

    function getGrid(size, divisions){
        var gridHelper = new THREE.GridHelper(size, divisions);

        return gridHelper;
    }

// getMaterial

    function getMaterial(color) {
        var selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
        var materialOptions = {
                color: color === undefined ? 'rgb(255, 255, 255)' : color,
        };

        return selectedMaterial;

    }

//onDocumentMouseMove

//onDocumentMouseDown 

// Update

    function update(renderer, scene, camera, controls, clock) {
            renderer.render(
                scene,
                camera
            )
            
            controls.update();
            
            var timeElapsed = clock.getElapsedTime();
        
            blogM = scene.getObjectByName('blog01');
                blogM.position.y = (Math.sin(timeElapsed * 2) + 1) * 2 + 0.005;
        
            requestAnimationFrame(function() {
                update(renderer, scene, camera, controls, clock);
            })
        }

var scene = init();
