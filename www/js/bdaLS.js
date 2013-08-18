/*	JS file for the BDA lobster and spearfishing app.
*	Provides all the functionality for the app. Saving catches to a localdb, uploading,
*	integration to phonegap, etc
*
*
*/

var userSignedIn=new Boolean(false);
  // Wait for Cordova to load
		    document.addEventListener("deviceready", onDeviceReady, false);
		   
			$(document).on("mobileinit", function(){
				$.mobile.defaultDialogTransition = "none";
				$.mobile.defaultPageTransition = "none";
			});
			
//Create the catch DB if not already created
			// Cordova is ready
		    function onDeviceReady() {
		       today();
		       console.log("BOOM! loaded on ready!");
		       var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		       db.transaction(populateDB, errorCB, successCB);
		       //Create the fish database 
		       var spDB= window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		       spDB.transaction(populateSpeciesDB, errorSpeciesCB, successSpeciesCB);
		       //Create the user database 
		       var userDB= window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		       userDB.transaction(populateUserDB, errorUserCB, successUserCB);
		      
		      //Make the interface a bit pretty and UI easier to use
		      hideForLobsterGPS();
		      hideForFishGPS(); 
		    }
		   
//user Database		    
		     // Populate the database of all the species.
		     //Need to make this a one time thing
		    function populateUserDB(tx) {
		        //tx.executeSql('DROP TABLE IF EXISTS USER');
		    	tx.executeSql('CREATE TABLE IF NOT EXISTS USER (userID INTEGER PRIMARY KEY AUTOINCREMENT, firstName,  lastName, email, lobsterLicence, spearfishLicence, lionfishPermit)');
		        }
		    
		     // If DB was created, then load the saved results into the catch table
		    function successUserCB() {
		    	var userDB= window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		        userDB.transaction(queryUserDB, errorUserCB);
		        console.log("User DB created successfully");
		    }
		    
		     // Query the database
		    function queryUserDB(tx) {
		    	console.log("loading user details...");
		        tx.executeSql('SELECT * FROM USER', [], queryUserSuccess, errorUserCB);
		    }
		
		    // Load the database into the catch table
		    function queryUserSuccess(tx, results) {
		        var len = results.rows.length;
		        console.log("Found " + len + " users in the database!");
		        if(len){
		        		userSignedIn = true;
		        		$("#appEnabled").show();
						$("#appDisabled").hide();
						$("#syncCatchButton").show();
		        }else{
		        	//There isn't anyone. need to hide the sync to DEP button under catch history and show the message on the first page!
		        		$("#appEnabled").hide();
						$("#appDisabled").show();
						$("#syncCatchButton").hide();
						userSignedIn = false;
		        }
		       
		        for (var i=0; i<len; i++){
		        	console.log("User ID: " + results.rows.item(i).firstName);
		            populateUserInputScreen(results.rows.item(i).firstName, results.rows.item(i).lastName, results.rows.item(i).email, results.rows.item(i).lobsterLicence, results.rows.item(i).spearfishLicence, results.rows.item(i).lionfishPermit);
		        }
		        
		    }
		    
		     // Transaction error callback
		    function errorUserCB(err) {
		        console.log("Error in Users: "+err.code);
		    }
		    
		    //Places the saved information into the Sign in window for the user
			function populateUserInputScreen(firstName, lastName, email, lobster, spearfish, lionfish)
			{		
				document.getElementById("firstName").value=firstName;
				document.getElementById("lastName").value=lastName;
				document.getElementById("email").value=email;
				document.getElementById("lobsterLicence").value=lobster;
				document.getElementById("spearfishingLicence").value=spearfish;
				document.getElementById("lionfishPermit").value=lionfish;
			}		   


//Update user's details			    
		    function saveUser(){
		    	var userDB = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				userDB.transaction(updateUser, errorUserUpdate, queryUserDB);
		    }
		    
		    function updateUser(tx) {
		    	if(userSignedIn){
		    		tx.executeSql('DROP TABLE IF EXISTS USER');
		    		tx.executeSql('CREATE TABLE IF NOT EXISTS USER (userID INTEGER PRIMARY KEY AUTOINCREMENT, firstName,  lastName, email, lobsterLicence, spearfishLicence, lionfishPermit)');
		        
		    		var sql = 'INSERT INTO USER (userID, firstName, lastName, email, lobsterLicence, spearfishLicence, lionfishPermit) VALUES ("' + 
					'1", "' + 
					document.getElementById("firstName").value + '", "' + 
					document.getElementById("lastName").value + '", "' + 
					document.getElementById("email").value  + '", "' +
					document.getElementById("lobsterLicence").value + '", "' +
					document.getElementById("spearfishingLicence").value + '", "' +
					document.getElementById("lionfishPermit").value + '")';
					alert("here: " + sql);
		    		tx.executeSql(sql);
		    	}else{
		    		var sql = 'INSERT INTO USER (userID, firstName, lastName, email, lobsterLicence, spearfishLicence, lionfishPermit) VALUES ("' + 
					'1", "' + 
					document.getElementById("firstName").value + '", "' + 
					document.getElementById("lastName").value + '", "' + 
					document.getElementById("email").value  + '", "' +
					document.getElementById("lobsterLicence").value + '", "' +
					document.getElementById("spearfishingLicence").value + '", "' +
					document.getElementById("lionfishPermit").value + '")';
					alert("here: " + sql);
		    		tx.executeSql(sql);
		    	}
		    }
		    
		    function errorUserUpdate(err) {
		        console.log("Error updating User: "+err.code);
		    }
		    
		     function userUpdateSuccessful(tx, results) {
				//document.getElementById("firstName").reset();
   				 today();	//re-populate today's date
				var userDB = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				userDB.transaction(queryUserDB, errorUserCB);
			}
	/*	    
		    function userUpdateSuccessful(tx, results) {
   				today();	//re-populate today's date
				var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				userDB.transaction(queryDB2, errorLobsterAdd);
			}		   
		   */
	/////////////////	/////////////////	/////////////////	/////////////////	/////////////////	/////////////////
		/////////////////	/////////////////	/////////////////	/////////////////	/////////////////
			/////////////////	/////////////////	/////////////////	/////////////////	/////////////////	/////////////////
	/////////////////	/////////////////	/////////////////	/////////////////	   
		   
		    
		    
//Species Database		    
		     // Populate the database of all the species.
		     //Need to make this a one time thing
		    function populateSpeciesDB(tx) {
		        tx.executeSql('DROP TABLE IF EXISTS SPECIES');
		    	tx.executeSql('CREATE TABLE IF NOT EXISTS SPECIES (sID INTEGER PRIMARY KEY AUTOINCREMENT, depID, speciesName, type, bagLimit, minLength,  notes)');
		        tx.executeSql('INSERT INTO SPECIES ( depID, speciesName, type, bagLimit, minLength,  notes) VALUES  ("SP", "Spiny Lobster",    "l", "2", "3.635", "The are spiny little buggers!")');
		     	tx.executeSql('INSERT INTO SPECIES ( depID, speciesName, type, bagLimit, minLength,  notes) VALUES  ("SL", "Slipper Lobster",  "l", "2", "3", "Wear them on your feet!")');
		     	tx.executeSql('INSERT INTO SPECIES ( depID, speciesName, type, bagLimit, minLength,  notes) VALUES  ("GC", "Guinea Chick",     "l", "2", "3", "hello chickas!")');
		     	tx.executeSql('INSERT INTO SPECIES ( depID, speciesName, type, bagLimit, minLength,  notes) VALUES  ("1", "Black Rockfish",    "f", "1", "37", "You find them in the rocks!")');
		     	tx.executeSql('INSERT INTO SPECIES ( depID, speciesName, type, bagLimit, minLength,  notes) VALUES  ("2", "Monkey Rockfish",   "f", "2", "32", "Catch them with banannas!")');  
		    }
		    
		     // If DB was created, then load the saved results into the catch table
		    function successSpeciesCB() {
		    	var spDB= window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		        spDB.transaction(querySpeciesDB, errorSpeciesCB);
		        console.log("Species DB created successfully");
		    }
		    
		     // Query the database
		    function querySpeciesDB(tx) {
		    	console.log("loading species list...");
		        tx.executeSql('SELECT * FROM SPECIES', [], querySpeciesSuccess, errorSpeciesCB);
		    }
		
		    // Load the database into the catch table
		    function querySpeciesSuccess(tx, results) {
		        var len = results.rows.length;
		        //console.log("Found " + len + " species in the database!");
		        for (var i=0; i<len; i++){
		        	//console.log("Specie ID: " + results.rows.item(i).sID);
		             addToSpeciesList(results.rows.item(i).sID, results.rows.item(i).speciesName, results.rows.item(i).bagLimit, results.rows.item(i).minLength);
		        }
		    }
		    
		     // Transaction error callback
		    function errorSpeciesCB(err) {
		        console.log("Error in Species: "+err.code);
		    }
		    
		    //Function adds rows to the catch table for the user.
			function addToSpeciesList(id, speciesName, bagLimit, minLength)
			{	
				var list = document.getElementById('#speciesList');
				var buildList = '<li><a onclick="fishDetail(' + id + ');" href="#fishDetail">'
				+ '<img src="img/fish/' + id + '.png">' 
				+ '<h2>' + speciesName+'</h2>'
				+ '<p>Min Length: ' + minLength + ' inches</p>'
				+ '<p>Bag Limit: ' + bagLimit + ' per day</p>'
				+ '</a></li>';
				
			//	console.log("JQ: " + buildList);
						
				$('#speciesList').append(buildList).trigger("create");	
				$('#speciesList:visible').listview('refresh');
		
			}

//Fish Details Page			
			//Onclick function that handles when a user clicks on a particular fish, it will update the fish details page
			function fishDetail(sID){
				//$("#speciesParticulars").html("<br>"); //clear the div first
				var spDB= window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);			
				spDB.transaction(function(tx){ querySpeciesDetails(tx, sID) }, errorSpeciesCB);
		        console.log("Fetching fish info for id: " + sID);
			}
			
			 // Query the database for a particular fish's details
		    function querySpeciesDetails(tx, sID) {
		    	var query = 'SELECT * FROM SPECIES WHERE sID="' + sID + '"'
		    	console.log("In query: " + query);
		        tx.executeSql(query, [], querySpeciesDetailsGood, errorSpeciesCB);
		    }
		    
			 // Load the database into the catch table
		    function querySpeciesDetailsGood(tx, results) {
		        var len = results.rows.length;
		        console.log("Found " + len + " species in the database!");
		        for (var i=0; i<len; i++){
		        	console.log("Look up Specie ID: " + results.rows.item(i).sID + ' name: ' + results.rows.item(i).speciesName);
		            buildSpeciesDiv(results.rows.item(i).sID, results.rows.item(i).speciesName, results.rows.item(i).bagLimit, results.rows.item(i).minLength, results.rows.item(i).notes);
		        }
		    }	    
			
			function buildSpeciesDiv(sID, speciesName, bagLimit, minLength,  notes){
				
				var newDetails = '<img src="img/fish/' + sID + '.png" title="' + speciesName + '">' 
				+ '<h2>' + speciesName+'</h2>'
				+ '<h4>Min Length: ' + minLength + ' inches</h4>'
				+ '<h4>Bag Limit: ' + bagLimit + ' per day</h4>'
				+ '<h4>Details:</h4>'
				+ '<p>' + notes + '</p>';
				
				console.log("JQ: " + newDetails);
				$("#speciesParticulars").html(newDetails);
				//document.getElementById("#speciesParticulars").innerHTML=newDetails;
				
			}
			
			
//Catch Table database		
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
		    	console.log("getting previous data");
		        tx.executeSql('SELECT * FROM CATCHES', [], querySuccess, errorCB);
		    }
		
		    // Load the database into the catch table
		    function querySuccess(tx, results) {
		        var len = results.rows.length;
		        for (var i=0; i<len; i++){
		        	console.log("output. Len: " + i + " of " + len);
		             addHTMLRow(results.rows.item(i).id, results.rows.item(i).species, results.rows.item(i).sex, results.rows.item(i).length, results.rows.item(i).weight, results.rows.item(i).grid, results.rows.item(i).lat, results.rows.item(i).long, results.rows.item(i).dateCaught, results.rows.item(i).notes);
		        }
		    }
		
			function syncCatchDatabase(){
				//Sync the local database to the online one.
				
				
			}
		
//Add new lobster catch			    
		    function addLobster(){
		    	var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
				db.transaction(addLobsterRow, errorLobsterAdd, goodLobsterAdd);
		    }
		    
		    function addLobsterRow(tx) {
		    	var sexOfLobster = "Female";
				if(document.getElementById("lobsterMale").checked)
				{
					sexOfLobster = "Male";
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
		    
//Catch Table			
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
				
				$("#myTable").table("refresh");
			}
			
			//function autopopulates the date for the Add Lobster and Add Fish pages
			function today() {
			    var date1 = new Date().toISOString().substring(0, 10),
			        field = document.querySelector('#lobsterDate');
			    field.value = date1;
				 var date2 = new Date().toISOString().substring(0, 10),
			        field = document.querySelector('#fishDate');
			    field.value = date2;			
			}
			
			//Function is called after the confirmation window for adding/saving a lobster
			function submitLobster(){
				addLobster();
			}
		
		//Function is called after the confirmation window for adding/saving a fish
			function submitFish(){
				addFish();
			}
		
		//Delete the database and re-instate it
		function clearDatabase(){
			today();
		    var db = window.openDatabase("BdaLS", "1.0", "BDA Lobster Spear", 200000);
		    db.transaction(dropTable, errorCB, successCB);
		}

		function dropTable(tx){
				tx.executeSql('DROP TABLE IF EXISTS CATCHES');
		    	tx.executeSql('CREATE TABLE IF NOT EXISTS CATCHES (id INTEGER PRIMARY KEY AUTOINCREMENT, species, sex, length, weight, grid, lat, long, dateCaught, notes)');
		}

		function goodTableDrop(){
			//Clear the history of catches table
			successCB();
			//Remove the table.
			var table = document.getElementById("#myTable");
			while(table.rows.length > 0) {
			  table.deleteRow(0);
			}
		}
		
		function hideForLobsterGPS(){
			$("#lobsterMap").hide();
			$("#lobsterGPS").show();
			$("#lobsterGrid").hide();
		}
		function hideForLobsterMap(){
			$("#lobsterMap").show();
			$("#lobsterGPS").hide();
			$("#lobsterGrid").hide();
		}
		function hideForLobsterGrid(){
			$("#lobsterMap").hide();
			$("#lobsterGPS").hide();
			$("#lobsterGrid").show();
		}
		
		function hideForFishGPS(){
			$("#fishMap").hide();
			$("#fishGPS").show();
			$("#fishGrid").hide();
		}
		function hideForFishMap(){
			$("#fishMap").show();
			$("#fishGPS").hide();
			$("#fishGrid").hide();
		}
		function hideForFishGrid(){
			$("#fishMap").hide();
			$("#fishGPS").hide();
			$("#fishGrid").show();
		}
		
		