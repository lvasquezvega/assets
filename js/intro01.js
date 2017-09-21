var intro = (function(){
    
    "use strict"
    
    var scene = new THREE.Scene(),
    renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(),
    AmbientLight01,
    PointLight01,
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
    
    var blogURL = [];
    var mixer;
    var mixer01;
    
    var id;


    //URLS

    
    // Init gui

    
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
    
    
    //CameraRig
    var cameraYpositionRig = new THREE.Group();
    var cameraZpositionRig = new THREE.Group();
    cameraZpositionRig.add(camera);
    cameraYpositionRig.add(cameraZpositionRig);
    scene.add(cameraYpositionRig);
     
    cameraZpositionRig.position.z = 115;
    cameraYpositionRig.position.y = 13;
        
    controls = new THREE.OrbitControls( camera , renderer.domElement );

    //Light
        
    PointLight01 = new THREE.PointLight( 'rgb(255, 220, 180)', 1);
    PointLight01.position.y = 50;
    PointLight01.position.z = 50;
    
    AmbientLight01 = new THREE.AmbientLight(0xffffff, 0.5);
    AmbientLight01.visible = false;
    
        
    //Animation
        
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
    
    var blogLoader = new THREE.FBXLoader(manager);
    var textureLoader = new THREE.TextureLoader();
        
        blogLoader.load('/asset/Blog/blog.fbx', function ( object ) {
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
            object.position.x = -60;
            object.name="blog";
            object.children["0"].userData = { URL: "http://myurl.com" };
            Meshes.add(object);
            animate();
        });
    group.add(Meshes);           
    scene.add(group);
        
        
    //Envolope
        
    var envelopeLoader = new THREE.FBXLoader(manager);
        
        envelopeLoader.load('/asset/Envelope/envelope_letter.fbx', function ( object ) {
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

            object.scale.set(0.8,0.8,0.8);
            console.log(object);
            object.name="envelope";
            object.children["0"].userData = { URL: "http://google.es" };
            
            var animationClip = object.animations[ 0 ];
            mixer = new THREE.AnimationMixer( object );
			mixer.clipAction( animationClip ).play();
                        
            Meshes.add(object);

            

            
        });
    group.add(Meshes);           
    scene.add(group);                
      
    //Paper
        
    var paperLoader = new THREE.FBXLoader(manager);
        
        paperLoader.load('/asset/Envelope/paper.fbx', function ( object ) {
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
            object.position.z = 0;
            object.scale.set(0.8,0.8,0.8);
            object.name="paper";
            console.log(object);
            object.children["0"].userData = { URL: "http://google.es" };
            
            
            var animationClip = object.animations[ 0 ];
            mixer01 = new THREE.AnimationMixer( object );
			mixer01.clipAction( animationClip ).play();

            Meshes.add(object);


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
	//window.addEventListener( 'mousemove', onDocumentMouseUp, true );
    
        

    
    //SceneAdd    
    scene.add(AmbientLight01);
    scene.add(PointLight01);
    
    render();
    aniMouseUp();

        
    }
    
    //FUNCTIONS
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

        var intersects = raycaster.intersectObjects([scene], true);

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
        var intersects = raycaster.intersectObjects([scene], true);
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
        var intersects = raycaster.intersectObjects([scene], true);
        if (intersects.length > 0) {
            window.open(intersects[0].object.userData.URL);
            }
        }
    
    
    function onDocumentMouseUp(event) {
                
        event.preventDefault();
        
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
        
        checkIntersection02();
        
        }
        
        function checkIntersection02() {
        
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects([scene], true);
        if(intersects.length > 0) {
            aniMouseUp();
            } else {
            cancelAnimationFrame( id );
        }   
        }

    function animate(){
        
        var timeElapsed = clock.getElapsedTime();
        var blog = scene.getObjectByName('blog');
            blog.position.y = (Math.sin(timeElapsed * 2) + 1) * 2 + 0.005;
        
        var envelope = scene.getObjectByName('envelope');
            envelope.position.y = 5 + ((Math.sin(timeElapsed * 2) + 1) * 2 + 0.005);
        
        requestAnimationFrame( animate );
    }
    
    function aniMouseUp() {
                
        var delta = clock.getDelta();
        mixer01.update( delta );
        mixer.update( delta );
         
        requestAnimationFrame( aniMouseUp );
        
        
    }

    function render(){

        renderer.render(scene, camera);
        requestAnimationFrame( render );
        controls.update();
        composer.render();

    }
    
    window.onload = initScene;
    
    return {
        scene: scene
    }
    
})();
