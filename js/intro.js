var intro = (function(){
    
    "use strict"
    
    var scene = new THREE.Scene(),
    renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(),
    AmbientLight01,
    PointLight01,
    plane01,
    camera,
    controls;
    
    var raycaster = new THREE.Raycaster();
    var clock = new THREE.Clock; 

    var mouse = new THREE.Vector2();
    var selectedObjects = [];
    var selectedURLs = [];
    
    var composer, effectFXAA, outlinePass;
    var Meshes = new THREE.Object3D();
    var group = new THREE.Object3D();

    var mixers = [];
    var obj = [];
    
    var id;

    //URLS
    
    function initScene(){

    //Renderer
        
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor('rgb(0, 0 , 0)');
    renderer.setPixelRatio( 1 );
    document.getElementById('webgl-container').appendChild(renderer.domElement);
           
    //Camera

    camera = new THREE.PerspectiveCamera(
            45, // FOV
            window.innerWidth/window.innerHeight, // aspectRatio
            1, // nearPlane
            1000 // farPlane                              
    )
    
    camera.position.z = 40;
    camera.position.y = 5;
        
    //CameraRig
    var cameraYpositionRig = new THREE.Group();
    var cameraZpositionRig = new THREE.Group();
    cameraZpositionRig.add(camera);
    cameraYpositionRig.add(cameraZpositionRig);
    scene.add(cameraYpositionRig);
     
    cameraZpositionRig.position.z = 80;
    cameraYpositionRig.position.y = 25;
        
    controls = new THREE.OrbitControls( camera , renderer.domElement );
    
    var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);

    //Light
        
    PointLight01 = new THREE.PointLight( 'rgb(255, 220, 180)', 1);
    PointLight01.position.y = 50;
    PointLight01.position.z = 50;
    
    AmbientLight01 = new THREE.AmbientLight(0xffffff, 0.5);
    AmbientLight01.visible = false;
    
        
    //Geometry
        
    plane01 = getPlane01(400,200);
        plane01.rotation.x = 90 * (Math.PI/180);
    scene.add(plane01);
    
        
    //LoadingManager
        
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
    
    var loader = new THREE.FBXLoader(manager);
    var textureLoader = new THREE.TextureLoader();
        
        loader.load('/asset/Blog/blog.fbx', function ( object ) {
            var colorMap = textureLoader.load('/asset/Blog/blog.jpg');
            var faceMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = faceMaterial;
                    faceMaterial.roughness = 0;
                    faceMaterial.map = colorMap;
                    faceMaterial.metalness = 0;
                }
            });
            object.position.x = -70;
            object.name="blog";
            object.children["0"].userData = { URL: "http://myurl.com" };
            Meshes.add(object);
        });
    group.add(Meshes);           
    scene.add(group);
    
        
    //Envolope
            
        loader.load('/asset/Envelope/envelope_letter.fbx', function ( object ) {
            var colorMap = textureLoader.load('/asset/Envelope/envelope_color.png');
            var faceMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh, THREE.SkinnedMesh) {
                    child.material = faceMaterial;
                    faceMaterial.roughness = 0;
                    faceMaterial.map = colorMap;
                    faceMaterial.metalness = 0;
                    faceMaterial.side = THREE.DoubleSide;
                    faceMaterial.morphTargets = true;
                    faceMaterial.skinning = true;
                }
            });
            object.position.x = 60;
            object.scale.set(0.8, 0.8, 0.8);
            object.position.y = 5;
            object.name = "envelope";
            object.children[103].userData = { URL: "http://google.es" };
            object.mixer = new THREE.AnimationMixer(object);
            mixers.push(object.mixer);
            var action = object.mixer.clipAction(object.animations[0]);
            
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true;
            
            action.play();
            Meshes.add(object);
      
        });               
        
    //Paper
                
        loader.load('/asset/Envelope/paper.fbx', function ( object ) {
            var colorMap = textureLoader.load('/asset/Envelope/envelope_color.png');
            var faceMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh, THREE.SkinnedMesh) {
                    child.material = faceMaterial;
                    faceMaterial.roughness = 0;
                    faceMaterial.map = colorMap;
                    faceMaterial.metalness = 0;
                    faceMaterial.side = THREE.DoubleSide;
                    faceMaterial.morphTargets = true;
                    faceMaterial.skinning = true;
                }
            });
            object.position.x = 60;
            object.position.y = 5;
            object.scale.set(0.8,0.8,0.8);
            object.name="paper";
            object.children["0"].userData = { URL: "http://google.es" };
            
            object.mixer = new THREE.AnimationMixer(object);
            mixers.push(object.mixer);
            var action = object.mixer.clipAction(object.animations[0]);
            
            action.clampWhenFinished = true;
            action.enable = true;
            
            action.play();

            Meshes.add(object);
            console.log(action.play())


        });
    group.add(Meshes);
    scene.add(group);        
        
    // postprocessing
    composer = new THREE.EffectComposer( renderer );

    var renderPass = new THREE.RenderPass( scene, camera );
    composer.addPass( renderPass );

    outlinePass = new THREE.OutlinePass( new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outlinePass.edgeStrength = 2;
    outlinePass.edgeThickness = 1;
    outlinePass.pulsePeriod = 3;
    outlinePass.visibleEdgeColor = {r: 1, g: 1, b: 1};
    composer.addPass( outlinePass );
        
    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    composer.addPass( effectFXAA );

	window.addEventListener( 'resize', onWindowResize, false );
    //window.addEventListener( 'mousedown', onDocumentMouseDown, false);
    window.addEventListener( 'mousemove', onTouchMove );
	window.addEventListener( 'touchmove', onTouchMove );
	//window.addEventListener( 'mousemove', onDocumentMouseUp );
    
    //threex
        
    domEvents.addEventListener(Meshes, 'click', function (event) {
        aniMouseUp();
        
        console.log('you clicked on the mesh')
        
    }, false)
   
    //SceneAdd    
    scene.add(AmbientLight01);
    scene.add(PointLight01);

    animate();  
        
    }
    
    //FUNCTIONS
    
    //getPlane
    
    function getPlane01(width, height){
        var geometry = new THREE.PlaneGeometry(width, height);
        var material = new THREE.MeshStandardMaterial ({
            color: 'rgb(120,120,120)',
            side: THREE.DoubleSide
        });
        var mesh = new THREE.Mesh (
            geometry,
            material
        )
        mesh.receiveShadow = true;
        
        return mesh;
    }
    
    //onTouchMove
    
    function onTouchMove(event) {
        var x, y;

        if (event.changedTouches) {

            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;

        } else {

            x = event.clientX;
            y = event.clientY;

        }

        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        checkIntersection();
        cursorpointer();

    }

    function addSelectedObject(object) {
        selectedObjects = [];
        selectedObjects.push(object);
    }


    function checkIntersection() {

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects([Meshes], true);

        if (intersects.length > 0) {
            var selectedObject = intersects[0].object;
            addSelectedObject(selectedObject);
            outlinePass.selectedObjects = selectedObjects;
        } else {
            outlinePass.selectedObjects = [];
        }

    }
        
    function cursorpointer() {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects([Meshes], true);
        if(intersects.length > 0) {
            $('html,body').css('cursor', 'pointer');
        } else {
            $('html,body').css('cursor', 'default');
        }

    }


    function onWindowResize() {
        var width = window.innerWidth || 1;
        var height = window.innerHeight || 1;
        var devicePixelRatio = window.devicePixelRatio || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    }

    
    
    function onDocumentMouseDown(event) {
                var x, y;

        if (event.changedTouches) {

            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;

        } else {

            x = event.clientX;
            y = event.clientY;

        }

        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        checkIntersection01();
        
        }
        
        function checkIntersection01() {
        
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects([Meshes], true);
        if (intersects.length > 0) {
            window.open(intersects[0].object.userData.URL);
            }
        }
    
    
    function onDocumentMouseUp(event) {
        aniMouseUp();
    }
             
    function animate(){
        
        requestAnimationFrame( animate );
        
       
        var timeElapsed = clock.getElapsedTime();
        
        group.position.y = (Math.sin(timeElapsed * 2) + 1) * 2 + 0.005;
               
        render();
    
     
    }
    
    function aniMouseUp() {
        var delta = clock.getDelta();
        if (mixers.length > 0) {
            for (var i = 0; i < mixers.length; i++) {
                mixers[i].update(delta);
            }
        }
    }

    function render(){

        renderer.render(scene, camera);
        controls.update();
        composer.render();

    }
    
    window.onload = initScene;
    
    return {
        scene: scene
    }
    
})();
