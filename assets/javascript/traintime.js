
// 1. Initialize Firebase  ======================================================================
  var config = {
    apiKey: "AIzaSyD-vo-rcPMN9TECDvEMAaVfB54rfI9S78M",
    authDomain: "intropresence-aff1a.firebaseapp.com",
    databaseURL: "https://intropresence-aff1a.firebaseio.com",
    projectId: "intropresence-aff1a",
    storageBucket: "intropresence-aff1a.appspot.com",
    messagingSenderId: "252481291562"
  };
  firebase.initializeApp(config);

var database = firebase.database();


// 2. Button for adding train info =================================================================
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input ==========================================================
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain =$("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  var bikeAllowed = $("#bike-input").val().trim();

  // Creates local "temporary" object for holding train data  ===================================
  var newEmp = {
    name: trainName,
    dest: destination,
    start: firstTrain,
    freq: frequency,
    bike: bikeAllowed
  };

  // Uploads train data to the database ======================================================================
  database.ref().push(newEmp);

  // Logs everything to console    
  console.log(newEmp.name);
  console.log(newEmp.dest);
  console.log(newEmp.start);
  console.log(newEmp.freq);
  console.log(newEmp.bike);

  alert("Employee successfully added");

  // Clears all of the text-boxes ======================================================================
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
  $("#bike-input").val("");
});

// 3. Create Firebase event for adding Train info to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable. ======================================================================
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTrain  = childSnapshot.val().start;
  var frequency  = childSnapshot.val().freq;
  var bikeAllowed = childSnapshot.val().bike;


  // Train Info to console log ======================================================================
  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);
  console.log(bikeAllowed);


  // 4. Calculate train times using moment.js.  =================================================
  
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  nextTrain = nextTrain.format("hh:mm A")
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

  // Create the new row ======================================================================
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain),
    $("<td>").text(bikeAllowed)
  );

  // Append the new row to the table  ======================================================================
  $("#train-table > tbody").append(newRow);
});

