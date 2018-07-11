// Initializing our application on Firebase
// ===============================================================================================================================================

var config = {
    apiKey: "AIzaSyAA340TsjEt9xMesMiovSSKh2GaWaynRHU",
    authDomain: "enlighten-up-dc253.firebaseapp.com",
    databaseURL: "https://enlighten-up-dc253.firebaseio.com",
    projectId: "enlighten-up-dc253",
    storageBucket: "",
    messagingSenderId: "979543628414"
};
firebase.initializeApp(config);

// Setting an empty array of search terms that will be filled when the user submits one, or when the app randomly generates one
var searchTerm = []

// Priming Firebase with an array of successful and appropriate search terms
var fireBaseArray = ["dog", "business", "rainbow", "apples", "color", "duck", "doctor", "baseball", "football", "music", "garden", "bug", "facebook", "space", "school", "kitten", "windows", "tech", "baby", "pun", "life"];

// Creating an empty array for our random number generator to toggle through the array on Firebase when the user clicks "Surprise Me"
var randNum = []

// Globalizing the firebase database connection
var database = firebase.database();

// ===============================================================================================================================================

//Giphy API Function
function searchGiphy() {

    // Creating our query url to include the search term
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dWrzYW0BDnzwozrf1PSoC64gqeYLPSby&limit=1";

    // Performing a GET request to receive the JSON data back from Giphy
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        // Creating a placeholder gif in the event that giphy doesn't supply one to the app
        // Otherwise,
        // The first gif is selected and is appended to the webpage
        .then(function (response) {
            var results = response.data;
            if (results.length === 0) {
                $("#gifs").attr("src", ("https://media0.giphy.com/media/nYogYgSmIJaIo/giphy.gif"));
            } else {
                $("#gifs").attr("src", results[0].images.fixed_height.url);
            }
        });
}

// ===============================================================================================================================================

// Meme API Function
function searchMeme() {

    // Localizing our query url with the search term
    var queryURL = "http://version1.api.memegenerator.net//Instances_Search?q=" + searchTerm + "&pageIndex=1&pageSize=1&apiKey=b939f19b-e825-43d7-a423-a52dd5a7b20e";

    // Performing a GET request for the Meme JSON data
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        // Creating a placeholder meme if one isn't supplied to the app,
        // logging the response object to the console,
        // and appending the Meme's url to the webpage
        .then(function (response) {
            if (response.result.length === 0) {
                $("#memes").attr("src", ("https://i.imgflip.com/13xbh4.jpg"));
            }
            else {
                console.log(response);
                var memeImg = (response.result[0].instanceImageUrl);
                console.log(memeImg);
                $("#memes").attr("src", memeImg);
            }
        });
};

// ===============================================================================================================================================

// Dad Joke API function
function searchDad() {

    // Setting up our query url
    var queryURL = "https://icanhazdadjoke.com/search";

    // Performing a GET request for the Dad joke JSON results
    $.ajax({
        url: queryURL,
        data: { "term": searchTerm },
        type: 'get',
        headers: {
            Accept: "application/json"
        }
    })

        // Displaying a placeholder image if no joke is supplied
        // Otherwise,
        // Appending the initial dad joke as an image on the webpage
        .then(data => {
            if (data.results.length === 0) {
                $("#dadjoke").attr("src", ("https://icanhazdadjoke.com/j/xHQucUvszd.png"));
            } else {
                var img = (data.results[0]).id;
                console.log(img);
                $("#dadjoke").attr("src", ("https://icanhazdadjoke.com/j/" + img + ".png"));
            }
        });
}


// Guardian query URL assembly function
function buildGuardianURL() {

    // Create query url for the guardian API, including the search term and key
    var guardianURL = "https://content.guardianapis.com/search?q=" + searchTerm + "&api-key=049cc8da-ac2b-47db-985c-0fd76b832d2f";
    return guardianURL;

}

// Guardian API Function
function generateGuardian() {

    // Localizing the Guardian url
    var url = buildGuardianURL();

    // GET request to receive the Guardian articles in a JSON response
    $.ajax({
        url: url,
        method: "GET"
    })

        // Appending the results to the webpage as a link that directs the user to the article in a separate tab
        .then(function (response) {
            console.log(response);
            $("#newsDrop").text(response.response.results[0].webUrl);
            $("#newsDrop").on("click", function () {
                $("#newsDrop").attr("href", response.response.results[0].webUrl);
            })
        });
}
function myFunction() {
    database.ref().once("value", function (snapshot) {
        var x = Math.floor((Math.random() * snapshot.val().Array.length) + 0);
        console.log(x);
        //(snapshot.val().Array[x]);
        searchTerm = (snapshot.val().Array[x]);
        console.log(searchTerm);
        console.log(snapshot.val().Array);
    });
};

$("#random").on("click", function (event) {
    event.preventDefault();
    $("#trainName").val("");
    database.ref().set({
        Array: fireBaseArray
    });
    myFunction();
    searchGiphy();
    searchMeme();
    searchDad();
    generateGuardian();
    searchTerm = []
});

$("#update").on("click", function (event) {
    event.preventDefault();
    var gif = $("#trainName").val().trim();
    if (gif === "") {
        $('#\\#myModal').modal('show');
    } else {
        searchTerm = gif;
        fireBaseArray.push(gif);
        console.log(fireBaseArray);
        console.log(gif);
        searchGiphy();
        searchMeme();
        searchDad();
        generateGuardian();
        $("#trainName").val("");
    }
});