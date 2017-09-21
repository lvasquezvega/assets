var example = (function(){
    
    "use strict";
    
    var scene = new THREE.Scene(),
        renderer = new THREE.WebGLRenderer(),
        light = new THREE.AmbientLight(0xffffff, 0.7),
        camera,
        blog;

    function initScene() {

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("webgl-container").appendChild(renderer.domElement);
        
        window.addEventListener( 'resize', function(){
            var width = window.innerWidth;
            var height = window.innerHeight;
            renderer.setSize( width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        scene.add(light);

        // camera
        
        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        )

        camera.position.set(0, 0, 150);

        scene.add(camera);
        
        //Outline
        
        var composer = new THREE.EffectComposer(renderer);
        var renderPass = new THREE.RenderPass(scene, camera);
        renderPass.renderToScreen = true;
        composer.addPass(renderPass);
        
        //controls 
        
        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableZoom = false;
        controls.enablePan = false;

        // Add Text
        
        var loader = new THREE.FontLoader();

        loader.load( 'json/helvetiker_regular.typeface.json', function ( font ) {

              
            var material = new THREE.MeshLambertMaterial({
               color: 0xffff00 
            });
       
            var textGeom = new THREE.TextGeometry( 'Blog!', {
                font: font,
                size: 1.8,
                height: 0.8,
                curveSegments: 0,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelSegments: 0
            });
            
            var textBlog = new THREE.Mesh( textGeom, material );
            textBlog.position.set(-43.5,15,-3);
            group01.add( textBlog );
        });
        
        // Blog
            
            var loader = new THREE.TextureLoader();
            loader.load('FBX/blog.jpg', function ( texture ) {
                
            var material = new THREE.MeshLambertMaterial({
                map: texture 
            });

            var loader = new THREE.JSONLoader();
                loader.load('FBX/blog.js', function(geometry, materials ) {
                var blog = new THREE.Mesh( geometry, material );
            
                        blog.position.set(-40,0,0);
                        blog.rotation.set(89.3, 0.03, 0);
                        group01.add( blog );
                            render();

                            }
                        );

                    },
                );
        
        // Blog + Text GRP
    
            var group01 = new THREE.Object3D();
            group01.position.set(-25,0,0);
            scene.add(group01); 
            
            };
    

    
    function render() {

        //scene.rotation.x += 0.02;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    return {
        scene: scene
    }
    
})();