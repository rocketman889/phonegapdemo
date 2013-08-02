/*	JS file for the BDA lobster and spearfishing app.
*	Provides all the functionality for the app. Saving catches to a localdb, uploading,
*	integration to phonegap, etc
*
*
*/

  // Wait for Cordova to load
		    document.addEventListener("deviceready", onDeviceReady, false);
			
//Create the catch DB if not already created
			// Cordova is ready
		    function onDeviceReady() {
		       today();
		       var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		       db.transaction(populateDB, errorCB, successCB);
		       //Create the fish database 
		       //var spDB= window.openDatabase("Species", "1.0", "BDA Lobster Spear", 200000);
		       //spDB.transaction(populateSpeciesDB, errorSpeciesCB, successSpeciesCB);
		    }
		    
		     // Populate the database 
		    function populateDB(tx) {
		      //  tx.executeSql('DROP TABLE IF EXISTS CATCHES');
		    	tx.executeSql('CREATE TABLE IF NOT EXISTS CATCHES (id INTEGER PRIMARY KEY AUTOINCREMENT, species, sex, length, weight, grid, lat, long, dateCaught, notes)');
		        
		       // tx.executeSql('INSERT INTO CATCHES ( species, sex, length, weight, grid, lat, long, dateCaught, notes) VALUES  ("1", "male", "6", "0", "F5", "32.245", "-64.8677", "2013-06-06", "BIG ONE!!")');
		      // tx.executeSql('INSERT INTO CATCHES ( data) VALUES ( "Second row")');
		    }
		    
		     // If DB was created, then load the saved results into the catch table
		    function successCB() {
		    	var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		        db.transaction(queryDB, errorCB);
		       console.log("DB created successfully");
		    }
		    
		     // Query the database
		    function queryDB(tx) {
		        tx.executeSql('SELECT * FROM CATCHES', [], querySuccess, errorCB);
		    }
		
		    // Load the database into the catch table
		    function querySuccess(tx, results) {
		        var len = results.rows.length;
		        for (var i=0; i<len; i++){
		             addHTMLRow(results.rows.item(i).id, results.rows.item(i).species, results.rows.item(i).sex, results.rows.item(i).length, results.rows.item(i).weight, results.rows.item(i).grid, results.rows.item(i).lat, results.rows.item(i).long, results.rows.item(i).dateCaught, results.rows.item(i).notes);
		        }
		    }
		
		
//Add new lobster catch			    
		    function addLobster(){
		    	var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				db.transaction(addLobsterRow, errorLobsterAdd, goodLobsterAdd);
		    }
		    
		    function addLobsterRow(tx) {
		    	var sexOfLobster = "female";
				if(document.getElementById("lobsterMale").checked)
				{
					sexOfLobster = "male";
				}
		    	var sql = 'INSERT INTO CATCHES (species, sex, length, weight, grid, lat, long, dateCaught, notes) VALUES ("' + 
		    	document.getElementById("lobsterType").value + '", "' + 
		    	sexOfLobster + '", "' +
		    	document.getElementById("lobsterLength").value + '", ' + 
		    	"0" + ', "' +
		    	document.getElementById("lobsterGridV").value + document.getElementById("lobsterGridH").value + '", "' +
		    	document.getElementById("lobsterLat").value  + '", "' +
		    	document.getElementById("lobsterLong").value + '", "' +
		    	document.getElementById("lobsterDate").value + '", "' +
		    	document.getElementById("lobsterNotes").value + '")';
		    	//alert("here: " + sql);
		    	tx.executeSql(sql);
		    }
		    
		    function errorLobsterAdd(err) {
		        console.log("Error adding lobster: "+err.code);
		    }
		    
		    function goodLobsterAdd(tx, results) {
				document.getElementById("addLobster").reset();
   				 today();	//re-populate today's date
				var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				db.transaction(queryDB2, errorLobsterAdd);
			}
		 
//Add new FISH catch			    
		    function addFish(){
		    	var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				db.transaction(addFishRow, errorFishAdd, goodFishAdd);
		    }
		    
		    function addFishRow(tx) {
		    	
		    	var sql = 'INSERT INTO CATCHES (species, sex, length, weight, grid, lat, long, dateCaught, notes) VALUES ("' + 
		    	document.getElementById("fishType").value + '", "' + 
		    	"-" + '", "' +
		    	document.getElementById("fishLength").value + '", "' + 
		    	document.getElementById("fishWeight").value + '", "' + 
		    	document.getElementById("fishGridV").value + document.getElementById("fishGridH").value + '", "' +
		    	document.getElementById("fishLat").value  + '", "' +
		    	document.getElementById("fishLong").value + '", "' +
		    	document.getElementById("fishDate").value + '", "' +
		    	document.getElementById("fishNotes").value + '")';
		    	//alert("here: " + sql);
		    	tx.executeSql(sql);
		    }
		    
		    function errorFishAdd(err) {
		        console.log("Error adding fish: "+err.code);
		    }
		    
		    function goodFishAdd(tx, results) {
				document.getElementById("addFish").reset();
   				 today();	//re-populate today's date
				var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				console.log("This error is a bad query :S");
				db.transaction(queryDB2, errorFishAdd);
			}
			
		 // Query the database
		    function queryDB2(tx) {
		        tx.executeSql('SELECT MAX(id) AS id, species, sex, length, weight, grid, lat, long, dateCaught, notes FROM CATCHES', [], querySuccess2, errorCB2);
		    }
		    
		    // Query the success callback
		    function querySuccess2(tx, results) {
		         var len = results.rows.length;
		        for (var i=0; i<len; i++){
		        	
		             addHTMLRow(results.rows.item(i).id, results.rows.item(i).species, results.rows.item(i).sex, results.rows.item(i).length, results.rows.item(i).weight, results.rows.item(i).grid, results.rows.item(i).lat, results.rows.item(i).long, results.rows.item(i).dateCaught, results.rows.item(i).notes);
		        }
		    }
		
		    // Transaction error callback
		    function errorCB2(err) {
		        console.log("Error processing SQL baby: "+err.code);
		    }
		 // Transaction error callback
		    function errorCB(err) {
		        console.log("Error at ondevice load: "+err.code);
		    }
		    
			
			//Function adds rows to the catch table for the user.
			function addHTMLRow(id, species, sex, length, weight, grid, latt, longg, date, notes)
			{
				var x=document.getElementById('myTable').insertRow(-1);
				var c1=x.insertCell(0);
				var c2=x.insertCell(1);
				var c3=x.insertCell(2);
				var c4=x.insertCell(3);
				var c5=x.insertCell(4);
				var c6=x.insertCell(5);
				var c7=x.insertCell(6);
				var c8=x.insertCell(7);
				var c9=x.insertCell(8);
				var c10=x.insertCell(9);
				c1.innerHTML=id;
				c2.innerHTML='<a href="#">' + species + '</a>';
				c3.innerHTML=sex;
				c4.innerHTML=length;
				c5.innerHTML=weight;
				c6.innerHTML=grid;
				c7.innerHTML=latt;
				c8.innerHTML=longg;
				c9.innerHTML=date;
				c10.innerHTML=notes;
			}
			
			//function autopopulates the date for the Add Lobster and Add Fish pages
			function today() {
			    var date = new Date().toISOString().substring(0, 10),
			        field = document.querySelector('#lobsterDate');
			    field.value = date;
				 var date = new Date().toISOString().substring(0, 10),
			        field = document.querySelector('#fishDate');
			    field.value = date;			
			}
			
			//Function is called after the confirmation window for adding/saving a lobster
			function submitLobster(){
				addLobster();
			}
		
		//Function is called after the confirmation window for adding/saving a fish
			function submitFish(){
				addFish();
			}
		
