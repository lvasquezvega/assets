console.log(THREE);

function init() {
    
    // Scene
    
    var scene = new THREE.Scene();
    var clock = new THREE.Clock();
    
    // Lights
    
    var ambientLight = getAmbientLight(1);
    var pointLight = getPointLight(1, 'rgb(255, 220, 180)');
    pointLight.position.y = 50;
    pointLight.position.z = 50;
    pointLight.intensity = 2;    
    
    // LoadingManager
    

    

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
                blogMesh.name = 'blog';
                scene.add(blogMesh);
            });
                
        }, onProgress, onError );
    
    // Groups
    
    
    // Add Scene
    
    scene.add(ambientLight);
    scene.add(pointLight);
    
    // Camera
    
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        1,
        1000
    );
    
    camera.position.x = 10;
    camera.position.y = 20;
    camera.position.z = 100;
    
    camera.lookAt(new THREE.Vector3(0, 0 ,0));
    
    //GridHelper
    
    var size = 100;
    var divisions = 50;    
    var gridHelper = new THREE.GridHelper(size, divisions);
    var sphere = getSphere(1);
    
    pointLight.add(sphere);
    scene.add(gridHelper);
    
    //renderer
    
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120, 120 , 120)');
    document.getElementById('webgl-container').appendChild(renderer.domElement);
    
    // Create an event listener that resizes the renderer with the browser window.
    
    window.addEventListener('resize', function() {
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });
    
    // Add OrbitControls so that we can pan around with the mouse.
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    update(renderer, scene, camera, controls, clock );
    
    return scene;

}
    // function get



    // getAmbientLight

    function getAmbientLight(intensity) {
        var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);

        return light;
    }
    
    // getPointLight

    function getPointLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.PointLight(color, intensity);
	light.castShadow = true;
        
	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.001;

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

    // getMaterial

    function getMaterial(color) {
        var selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
        var materialOptions = {
            color: color === undefined ? 'rgb(255, 255, 255)' : color,
        };
        
        return selectedMaterial;
    }



    function update(renderer, scene, camera, controls, clock) {
        renderer.render(
            scene,
            camera
    );
        
        controls.update();
        
    
    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls, clock);
    })    
    }

    var scene = init();
