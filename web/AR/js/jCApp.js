  

//setup action button

var buttonAction = document.getElementById( 'FUpdate' );
    buttonAction.addEventListener( 'click', function ( event ) {
        localStorage.setItem('forceUpdate', 'doUpdate');
        location.reload();
    }, false);



//Web SQL Setup
var thisJSON;
var rapJSON;
var compyJSON;
var rexJSON;
var microJSON;
var diloJSON;
var triJSON;
var apatoJSON;
var pterJSON;

var rex2JSON;
var rap2JSON;

var db = openDatabase('jurassicCART', '1.0', 'ArgonJS Info', 40 * 1024 * 1024);
var msg;

if(localStorage.getItem('forceUpdate') == 'doUpdate' || localStorage.getItem('tableLoaded') == null){
	db.transaction(function (tx) {
	  tx.executeSql('DROP TABLE LOGS');
	  localStorage.setItem('tableLoaded', 'no');
	});
}

//Create Table if Doesn't Exist
if(localStorage.getItem('tableLoaded') == null || localStorage.getItem('tableLoaded') == 'no'){
 db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, name, jsonString)');
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (1, "pter", ?)', [getJSONString("pter")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (2, "raptor", ?)', [getJSONString("raptor")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (3, "apato", ?)', [getJSONString("apato")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (4, "micro", ?)', [getJSONString("micro")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (5, "compy", ?)', [getJSONString("raptor")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (6, "tri", ?)', [getJSONString("raptor")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (7, "rex", ?)', [getJSONString("rex")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (8, "rex2", ?)', [getJSONString("rex2")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (9, "dilo", ?)', [getJSONString("dilo")]);
    msg = '<p>Log message created and row inserted.</p>';
  	localStorage.setItem('tableLoaded', 'yes');
  	localStorage.setItem('forceUpdate', 'no');
 });
}

//Call Current Model Selection and Return JSON String
db.transaction(function (tx) {
   tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
      var len = results.rows.length, i;
      msg = "<p>Found rows: " + len + "</p>";  
      /*
      if(localStorage.getItem('currFileName') == null){
           thisJSON = results.rows.item(0).jsonString; 
      }
      else{
          for (i = 0; i < len; i++){
               if(results.rows.item(i).name == localStorage.getItem('currFileName')){
                   thisJSON = results.rows.item(i).jsonString;
               }
          }
       }
       */

          for (i = 0; i < len; i++){
               //if(results.rows.item(i).name == localStorage.getItem('currFileName')){
               		switch(results.rows.item(i).name){
               			case 'pter':
               				pterJSON = results.rows.item(i).jsonString;
               				break;
               			case 'raptor':
               				rapJSON = results.rows.item(i).jsonString;
               				break;
               			case 'apato':
               				apatoJSON = results.rows.item(i).jsonString;
               				break;
               			case 'micro':
               				microJSON = results.rows.item(i).jsonString;
               				break;
               			case 'compy':
               				compyJSON = results.rows.item(i).jsonString;
               				break;
               			case 'tri':
               				triJSON = results.rows.item(i).jsonString;
               				break;
               			case 'rex':
               				rexJSON = results.rows.item(i).jsonString;
               				break;
               			case 'rex2':
               				rex2JSON = results.rows.item(i).jsonString;
               				break;
               			case 'dilo':
               				diloJSON = results.rows.item(i).jsonString;
               				break;
               			default:
               				break;

               		}
                   //thisJSON = results.rows.item(i).jsonString;
              // }
          }
      //INI app with JSON String
      iniArgon(pterJSON, rapJSON, apatoJSON, microJSON, compyJSON, triJSON, rexJSON, rex2JSON, rap2JSON, diloJSON);
   }, null);

});


function getJSONString (name){
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", 'models_json/'+name+'.json', false);
    xhReq.send(null);
    return JSON.stringify(JSON.parse(xhReq.responseText));
}

  
function iniArgon(pterJSON, rapJSON, apatoJSON, microJSON, compyJSON, triJSON, rexJSON, rex2JSON, rap2JSON, diloJSON){
	// setup Threestrap for Argon
	var options = THREE.Bootstrap.createArgonOptions( Argon.immersiveContext );
	var three = THREE.Bootstrap( options );

	// add light to our scene
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	  light.position.set( 0, -20, -20 ).normalize();
	  three.scene.add( light );
	var pointLight = new THREE.PointLight( 0xffffff, 4, 1000 );
	three.camera.add(pointLight);


	function iniVuforia(){
	    Argon.immersiveContext.setRequiredCapabilities('Vuforia');

	    Argon.Vuforia.initialize({ 
	    	licenseKey: "AYiLVi//////AAAAAOBt7RwW80jfqLaZWtZ+Y/YfYffUDHVNkBf8fVts8YbHhb1hO3j+859gUjA8utjNY6qi11yZjG13ElQh7YQrR8W74HXK3jDEutQXRjyKvr+dQWxSCvnxTz0lpaZb3tu1gmCEXzwZ1QdtOBsGJqlINcSnLsOB7cu+HbTFs97J8a+jlB64Kr7euserB6rBrIXD7o/RZYi18dRXu5AoGPI2OWb0u7lLOOgYChJ9MRmf3nkPjKm4dxF11m7RMhyIEz1CTOsgEwctaOTolzM04aHu4ZWCjUnIs/czp9R8NGCnDdllRLXSDKIKaIr/sTTkuhx5cLgyBL+KhYu49a7IUlKtmKkAGfkGVAmkyiEcPehFgdaE",
	    	startCamera: true, 
	    }) 
	    .then(function(api) { 
	        // load, activate, and use our dataSet 
	        api.loadDataSetFromURL('dataset_xml/JCTest.xml').then(function (dataSet) { 
	        	dataSet.activate() 
	        	setupRaptorContent(dataSet.trackables.VeloceClaw_Symbol) 
	        	setupApatoContent(dataSet.trackables.Apatosaurus_Symbol) 
	        	setupMicroContent(dataSet.trackables.microceratusglyph) 
	        	setupPterContent(dataSet.trackables.Pterosaur_Symbol)  
	        	setupCompyContent(dataSet.trackables.compyGlyph) 
	        	setupTriContent(dataSet.trackables.Triceratops_Symbol) 
	        	setupRexContent(dataSet.trackables.Tyrano_Symbol) 
	        	setupRex2Content(dataSet.trackables.cart)
	        	setupDiloContent(dataSet.trackables.Dilophosaurus)
	        	setupRexContent(dataSet.trackables.Tyrano_Symbol)
	        })
	        .then(api.startObjectTracker) 
	        .then(api.hintMaxSimultaneousImageTargets.bind(api, 2)) 
	    });

	}
	iniVuforia();

	/*
	function setupStonesContent( stonesEntity ) { 
	    // create an Object3D from the stones entity 
	    var stones = three.argon.objectFromEntity(stonesEntity); 
	    // create a box 
	    var box = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshNormalMaterial()); 
	    box.position.y = 25 
	    var boxSpin = 0 
	    // add and spin the box when the stones trackable is found 
	    stones.addEventListener('argon:found', function() { 
	    	stones.add(box) 
	    	boxSpin = 10 
	    }); 
	    // remove the box when the stones trackable is lost 
	    stones.addEventListener('argon:lost', function() { 
	    	stones.remove(box) 
	    }); 
	    // animate the box 
	    three.on('update', function() { 
	    	box.rotation.y += boxSpin * three.Time.delta 
	    	if (boxSpin > 0) boxSpin -= 10 * three.Time.delta 
	    	else boxSpin = 0 
	    }); 
	}
*/
	// setup Raptor
	var modelPromise = getRaptorModel(rapJSON); 

	function setupRaptorContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getRaptorModel().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getRaptorModel().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getRaptorModel(mJSON) {
	    
	    return modelPromise = modelPromise || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}


	//setup Apato
	var modelPromiseApato = getModelApato(apatoJSON);

	function setupApatoContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelApato().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelApato().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelApato(mJSON) {
	    
	    return modelPromiseApato = modelPromiseApato || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}


	//setup Micro
	var modelPromiseMicro = getModelMicro(microJSON);

	function setupMicroContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelMicro().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelMicro().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelMicro(mJSON) {
	    
	    return modelPromiseMicro = modelPromiseMicro || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}

	//setup Pter
	var modelPromisePter = getModelPter(pterJSON);

	function setupPterContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelPter().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelPter().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelPter(mJSON) {
	    
	    return modelPromisePter = modelPromisePter || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}


	//setup Compy
	var modelPromiseCompy = getModelCompy(compyJSON);

	function setupCompyContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelCompy().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelCompy().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelCompy(mJSON) {
	    
	    return modelPromiseCompy = modelPromiseCompy || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}


	//setup Tri
	var modelPromiseTri = getModelCompy(triJSON);

	function setupTriContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelTri().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelTri().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelTri(mJSON) {
	    
	    return modelPromiseTri = modelPromiseTri || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}

	//setup Rex
	var modelPromiseRex = getModelRex(rexJSON);

	function setupRexContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelRex().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelRex().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelRex(mJSON) {
	    
	    return modelPromiseRex = modelPromiseRex || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}

	//setup Rex2
	var modelPromiseRex2 = getModelRex2(rex2JSON);

	function setupRex2Content( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelRex2().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelRex2().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelRex2(mJSON) {
	    
	    return modelPromiseRex2 = modelPromiseRex2 || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}

	//setup Dilo
	var modelPromiseDilo = getModelDilo(diloJSON);

	function setupDiloContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelDilo().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelDilo().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelDilo(mJSON) {
	    
	    return modelPromiseDilo = modelPromiseDilo || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}

	//setup Rex
	var modelPromiseRex = getModelRex(rexJSON);

	function setupDiloContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelRex().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelRex().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelRex(mJSON) {
	    
	    return modelPromiseRex = modelPromiseRex || new Promise(function(resolve, reject) { 
			// load the model 
	    	
	    	//Convert Model JSON String to actual JSON Object
	        var modelJSON = JSON.parse(mJSON);

	        var loader = new THREE.JSONLoader(); 
	    	loader.loadJSON( modelJSON, function ( geometry, materials ) { 
	        	materials[0].morphTargets = true 
	        	var faceMaterial = new THREE.MeshFaceMaterial( materials ) 
	        	var morphMesh = new THREE.MorphAnimMesh( geometry, faceMaterial ) 
	        	morphMesh.duration = 5000 
	        	morphMesh.time = 0 
	        	morphMesh.scale.set(0.1,0.1,0.1) 
	        	morphMesh.position.set(0,0,0) 
	        	morphMesh.matrixAutoUpdate = false 
	        	morphMesh.updateMatrix() 
	        	// animate the model 
	        	three.on('update', function() { 
	        		morphMesh.updateAnimation( 1000 * three.Time.delta ) 
	        	}) 
	        	resolve(morphMesh) 
	    	}, 'models_json/') 
	    }) 
	}
}