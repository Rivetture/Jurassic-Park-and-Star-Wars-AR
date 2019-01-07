  

//setup action button

var buttonAction = document.getElementById( 'FUpdate' );
    buttonAction.addEventListener( 'click', function ( event ) {
        localStorage.setItem('forceUpdate', 'doUpdate');
        location.reload();
    }, false);



//Web SQL Setup
var RCmodelJSON;
var DSJSON;
//LINE 16 IS Problem
var db = openDatabase('StarWars', '1.0', 'ArgonJS Info', 40 * 1024 * 1024);
var msg;
localStorage.setItem('forceUpdate', 'doUpdate');
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
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (1, "RCmodel", ?)', [getJSONString("RCmodel")]);
    tx.executeSql('INSERT INTO LOGS (id, name, jsonString) VALUES (2, "DS", ?)', [getJSONString("DS")]);
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
               			case 'RCmodel':
               				RCmodelJSON = results.rows.item(i).jsonString;
               				break;
               			case 'DS':
               				DSJSON = results.rows.item(i).jsonString;
               				break;
               			default:
               				break;

               		}
                   //thisJSON = results.rows.item(i).jsonString;
              // }
          }
      //INI app with JSON String
      iniArgon(RCmodelJSON,DSJSON);
   }, null);

});


function getJSONString (name){
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", 'models_json/'+name+'.json', false);
    xhReq.send(null);
    return JSON.stringify(JSON.parse(xhReq.responseText));
}

  
function iniArgon(RCmodelJSON,DSJSON){
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
	    	licenseKey: "AeBUvSv/////AAAAAQoq90gUAUV0mePQpaHffwg3FL2qpBMnOmNoMdZe665d+tSRuvTgsiYEPuptfAfjbHlRRUGAd0LKpsIzG0Pd0n7aSEPQorIW/p6BWq7Lz2dO61yburcku9SyFNWuU0qkN6W42QRUziWKkU8LLSDJwd4YO+553jGcSEIslkr8DvR+69OzWy3NlGxMjodEVm4TNusNGN1n/TZVjWh5kb75ngobvWa/HcQBUKfHLoKgC8eZsIH9ImG1bv8jZ6MQRpdeCXlTdG9jm8k6nDQJzF4Iam7/VmPFWCogMd4ibFv1B1G8zBJ1RBkExnYJhZGQCLYXBspNu2JhEZ9qP58pq6xHXBi5luTW4SecpIB48XgOTqsW",
	    	startCamera: true, 
	    }) 
	    .then(function(api) { 
	        // load, activate, and use our dataSet 
	        api.loadDataSetFromURL('dataset_xml/StarWars.xml').then(function (dataSet) { 
	        	dataSet.activate() 
	        	setupRCContent(dataSet.trackables.Cruiser_Symbol)
	        	setupDSContent(dataSet.trackables.DS_Symbol)
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
	var modelPromiseRC = getModelRCModel(RCmodelJSON); 

	function setupRCContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelRCModel().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelRCModel().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelRCModel(mJSON) {
	    
	    return modelPromiseRC = modelPromiseRC || new Promise(function(resolve, reject) { 
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




	var modelPromiseDS = getModelDSModel(DSJSON); 

	function setupDSContent( chipsEntity ) { 
		// create an Object3D from the chips entity 
	    var chips = three.argon.objectFromEntity(chipsEntity);
	    // add the model when the chips trackable is found 
	    chips.addEventListener('argon:found', function() { 
	    	getModelDSModel().then(function(model) { 
	        	chips.add(model) 
	     	}); 
	    }); 
	    // remove the model when the chips trackable is lost 
	    chips.addEventListener('argon:lost', function() { 
	    	getModelDSModel().then(function(model) { 
	    		chips.remove(model) 
	    	}); 
	    }); 
	}

	function getModelDSModel(mJSON) {
	    
	    return modelPromiseDS = modelPromiseDS || new Promise(function(resolve, reject) { 
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