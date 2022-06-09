// global epsilon variable
var epsilon = false;
// Populate explanation
async function getExplanationType(){
    // e0 - no explanation
    // e1 - placebo explanation
    // e2 - flowchart
    // e3 - feature importance
    // e4 - average group rating
    // e5 - film similarity
    var username = window.location.hash.substring(1)
    username = parseInt(username)
    $.get("/getPreviousExplanations", function(result){
        var usersExplanation = -1;
        for (var i of result) {
            if (i["userId"] == username) {
                usersExplanation = parseInt(i["button"][1]);
                break;
            }
        }

        if (usersExplanation == -1) {
            usersExplanation = 0
            if (result.length != 0) {
                var prevExplanation = parseInt(result[0]["button"][1])
                usersExplanation = (prevExplanation + 1) % 6
            }
            track("e" + String(usersExplanation))
        }

        // if 0 we don't need to change anything
        if (usersExplanation == 0) {
            return;
        }
        else if (usersExplanation == 1) {
            loadExplanation1();
            return;
        }
        else if (usersExplanation == 2) {
            loadExplanation2();
            return;
        }
        else if (usersExplanation == 3) {
            loadExplanation3();
            return;
        }
        else if (usersExplanation == 4) {
            loadExplanation4();
            return;
        }
        else if (usersExplanation == 5) {
            loadExplanation5();
            return;
        }
    });
}


async function loadExplanation1(){
    var explanationText = document.getElementById("explanationText");
    explanationText.innerHTML = "<b>These recommendations are generated by our algorithms.</b>";
    return;
}

async function loadExplanation2(){
    var explanationText = document.getElementById("explanationText");
    explanationText.innerHTML = "<b>The figure below explains how your recommendations are generated</b>";
    flowchartImg = document.getElementById("flowchartImg")
    if (flowchartImg) {
        return;
    }

    var flowchartImg = document.createElement("img");
    flowchartImg.setAttribute("id", "flowchartImg");
    flowchartImg.setAttribute("class", "img-fluid");
    flowchartImg.setAttribute("max-width", "100%");
    flowchartImg.setAttribute("height", "auto");
    flowchartImg.setAttribute("src", "./images/Explanations/explanation_flowchart.png");
    flowchartImg.setAttribute("alt", "A flowchart describing the explanation process");

    document.getElementById("explanationSection").appendChild(flowchartImg);
    return;
}

async function loadExplanation3(){
    var explanationText = document.getElementById("explanationText");
    explanationText.innerHTML = "<b>The figure below shows the importance of the features of the film in making this recommendation.</b>";
    importanceImg = document.getElementById("importanceImg")
    if (importanceImg) {
        return;
    }
    var username = window.location.hash.substring(1)
    username = parseInt(username)
    $.get("/getRecommendations/" + username, function(result){
        var cluster = result[0]["cluster"]
    
        var tableImg = document.createElement("img");
        tableImg.setAttribute("id", "importanceImg");
        tableImg.setAttribute("class", "img-fluid");
        tableImg.setAttribute("max-width", "100%");
        tableImg.setAttribute("height", "auto");
        tableImg.setAttribute("src", "./images/Explanations/cluster" + cluster + "_importance.png");
        tableImg.setAttribute("alt", "A table describing the explanation process");
    
        document.getElementById("explanationSection").appendChild(tableImg);
        return;
    });
}

async function loadExplanation4(){
    var username = window.location.hash.substring(1)
    username = parseInt(username)

    $.get("/getRatingsByUser/" + username, function(result){
        if (result.length == 0) {
            var explanationText = document.getElementById("explanationText");
            explanationText.innerHTML = "<b>An explanation cannot be generated for the below recommendation as you did not provide any ratings.</b>";
            return;
        }
        else {
            $.get("/getHighestRated/" + username, function(result){
                const cluster = result.data[0].cluster
                const rating = result.data[0].rating
                var explanationText = document.getElementById("explanationText");
                explanationText.innerHTML = "<b>You are receiving the below recommendation because you have an average rating of " + String(rating) + " for the group that this film belongs to (group " + String(cluster) + ").</b>";
                return;
            })
        }
    })
}

async function loadExplanation5(){
    var username = window.location.hash.substring(1)
    username = parseInt(username)
    $.get("/getHighestRated/" + username, async function(result){
        var cluster = parseInt(result.data[0].cluster)
        var group = cluster + 1

        $.get("/getRatingsByUser/" + username, function(userRatings){
            if (userRatings.length == 0) {
                var explanationText = document.getElementById("explanationText");
                explanationText.innerHTML = "<b>An explanation cannot be generated for the below recommendation as you did not provide any ratings.</b>";
                return;
            }
        })

        $.get("/getHighestRatedSimilarity/" + cluster, function(similarity){
                var rec_film = $('#m1Title').html()
                rec_film = parseInt((rec_film.substring(rec_film.indexOf("id:") + 4)))

                var hiRatingsID = [];
                $.get("/getRatingsByUserAndCluster/" + username + "/" + group, function(ratings){
                    for (var i = 5; i >= 1; i--) {
                        for (var j of ratings) {
                            if (parseInt(j.substring(3,4)) == i) {
                                hiRatingsID.push(j.substring(5))
                            }
                        }
                    }
                    var hiRatingID = hiRatingsID[Math.floor(Math.random() * hiRatingsID.length)]
                    for (var i of similarity) {
                        if ((i["movie1_id"] == hiRatingID && i["movie2_id"] == rec_film) | (i["movie1_id"] == rec_film && i["movie2_id"] == hiRatingID)){
                            $.get("/getMovieByID/" + hiRatingID, function(result){
                                var percentSimilarity = (i["similarity"] * 100).toFixed(3)
                                var explanationText = document.getElementById("explanationText");
                                explanationText.innerHTML = "<b>You are receiving the below recommendation because it has a similarity rating of " + percentSimilarity  + "% with the movie you rated previously, " + result[0]["title"] + ".</b>";
                                return;
                            })
                            break; 
                        }
                    }
                })
            })
    })
}

async function getEpsilonExplanation(){
    flowchartImg = document.getElementById("flowchartImg")
    importanceImg = document.getElementById("importanceImg")

    if (flowchartImg) {
        flowchartImg.parentNode.removeChild(flowchartImg);
    }
    if (importanceImg) {
        importanceImg.parentNode.removeChild(importanceImg);
    }

    var explanationText = document.getElementById("explanationText");
    explanationText.innerHTML = "<b>You are receiving the below recommendation to allow you to explore something different.</b>"

    return;

}

//Populates the movies
async function load_recommendation(){
    var explanationText = document.getElementById("explanationText");
    explanationText.innerHTML = "";
    var username = window.location.hash.substring(1)
    username = parseInt(username)
    var e = 0.2;
    var randomGreedy = Math.random();
    // get rated films
    let ratedFilms = await getRatedFilms()
    $.get("/getRecommendations/" + username, function(result){
        // Get highest rated cluster so we don't choose random film for epsilon greedy in this
        var cluster = result[0]["cluster"]
        //Seeing if it should explore with probability e
        // Don't Explore
        if (randomGreedy > e) {
            epsilon = false;
            // Generate random number and ensure we don't get same film or rated film
            var random = Math.floor(Math.random() * (result.length));
            while (result[random]["title"] + ' - id: ' +result[random]['id'] === $('#m1Title').text() || ratedFilms.includes(result[random]['id'])) {
                var random = Math.floor(Math.random() * (result.length));
            }
            
            //Movie 1 Data
            $('#m1Title').html(result[random]["title"] + ' - id: ' +result[random]['id']);
            $('#m1Description').html(result[random]["description"]);
            $('#m1Image').attr("href", result[random]["imageURL"]);
            track("fs" + result[random]['id'])
            cutDescription();
        // Explore
       } else {
        $.get('/getAllMovies', async function(result){
            console.log("explore")
            await getEpsilonExplanation()
            track("Xplore");
            // Generate random number and ensure we don't get same film or rated film
            var random = Math.floor(Math.random() * (result.length));
            while (
                    result[random]["title"] + ' - id: ' + result[random]['id'] === $('#m1Title').text() 
                    || ratedFilms.includes(result[random]['id'])
                    || result[random]["cluster"] === cluster
            ) {
                 var random = Math.floor(Math.random() * (result.length));
             }

                //Movie 1 Data
                $('#m1Title').html(result[random]["title"] + ' - id: ' +result[random]['id']);
                $('#m1Description').html(result[random]["description"]);
                $('#m1Image').attr("href", result[random]["imageURL"]);
                track("fs" + result[random]['id'])
                cutDescription();
           })
       }

       // Reset Likert scale
       document.getElementById("grForm").reset();
       document.getElementById("wtfForm").reset();

    // get explnation
       if (randomGreedy > e) {
        getExplanationType();
       }
       

    });
};

// Hide description partially
function cutDescription() {
    var cutoff = 50;
    var text = $('#m1Description').text();
    var rest = text.substring(cutoff);
    if (text.length > cutoff) {
        var space = rest.indexOf(' ');
        cutoff += Math.max(space, 0);
    }
    rest = text.substring(cutoff);
    var visibleText = $('#m1Description').text().substring(0, cutoff);
    $('#m1Description')
        .html(visibleText + ('<span>' + rest + '</span>'))
    $('#m1Description span').hide();
}

// Get a list of ids of all the films the current user has rated
async function getRatedFilms () {
    var username = window.location.hash.substring(1)
    username = parseInt(username)
    // regex
    var searchPattern = new RegExp("^g[1-5]");
    ratedFilms = []

    const resultReq = await fetch('/getUserBehaviour')
    let result = await resultReq.json();
    for (const i of result) {
            if (i["userId"] === username & searchPattern.test(i["button"])) {
                firstM = i["button"].indexOf("m") + 1;
                ratedFilms.push(parseInt(i["button"].substring(firstM, i["button"].length)))
        }
    }
    
    return ratedFilms;
}


//Buttons to see explanations for movies
$(function(){
    //Once Movie 1 button is clicked
    $('#m1ExplanationBtn').click(function(){
        //Shows the m1Explanation div
        $('#m1Explanation').toggle(500);
        //Changes the text of the button everytime it is clicked
        $(this).text($(this).text() == 'See Explanation' ? 'Hide Explanation' : 'See Explanation');
    });

    //Once Movie 2 button is clicked
    $('#m2ExplanationBtn').click(function(){
        //Shows the m1Explanation div
        $('#m2Explanation').toggle(500);
        //Changes the text of the button everytime it is clicked
        $(this).text($(this).text() == 'See Explanation' ? 'Hide Explanation' : 'See Explanation');
    });

    //Once Movie 3 button is clicked
    $('#m3ExplanationBtn').click(function(){
        //Shows the m1Explanation div
        $('#m3Explanation').toggle(500);
        //Changes the text of the button everytime it is clicked
        $(this).text($(this).text() == 'See Explanation' ? 'Hide Explanation' : 'See Explanation');
    });
})

//get User Behaviour Database data
function getUserBehaviourDatabase(){
    $.get('/getUserBehaviour', function(result){
        console.log(result);
    })
}

//get Users Database data
function getUserDatabase(){
    $.get('/getUsers', function(result){
        console.log(result);
    })
}

// Show/Hide description
function moreDesc() {
    $('#m1Description').find('span').toggle();
    $('#m1Description').find('a:last').hide();
    $('#m1SeeMore').text(function(i, text){
        if (text != "See Less") {
            track("m1SeeMore")
        }
        return text === "See Less" ? "See More" : "See Less";
    }) 
}

// Load page
window.addEventListener('load', async function () {
    load_recommendation()

    const tqButtonClick = document.getElementById('tqButton');
    tqButtonClick.addEventListener('click', async function () {
        const trackComplete = await track("tq"); 
        if (trackComplete) {
            location.href= "https://durham.onlinesurveys.ac.uk/trust-in-recommendation-systems"
        }
        
    });
});



//track user behaviour
async function track(id) {
    //sends data to database
    await $.post("/postUserBehaviour", 
        {
            button: id, 
        });
    return 1
    };