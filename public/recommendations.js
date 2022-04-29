//Populates the movies
async function load_recommendation(){
    var e = 0.2;
    var randomGreedy = Math.random();
    $.get("/getRecommendations", function(result){
        var random = Math.floor(Math.random() * (result.length));
        while (result[random]["title"] + ' - id: ' +result[random]['id'] === $('#m1Title').text()) {
            var random = Math.floor(Math.random() * (result.length));
        }
        
        //Prints databse query to placeholder
        //Seeing if it should explore with probability e
        // Don't Explore
       if(randomGreedy > e){
            //Movie 1 Data
            $('#m1Title').html(result[random]["title"] + ' - id: ' +result[random]['id']);
            $('#m1Runtime').html( 'Runtime '+ result[random]["runtime"]+' mins');
            if(result[random]["budget"] == 0){
                $('#m1Budget').html('Budget: Unknown');
            }else{
                $('#m1Budget').html('Budget: ' + result[1]["budget"]);
            }
            if(result[random]["revenue"] == 0){
                $('#m1Revenue').html('Revenue: Unknown');
            }else{
                $('#m1Revenue').html('Revenue: ' + result[random]["revenue"]);
            }
            $('#m1AvgVote').html( 'Average Rating: ' + result[random]["vote_average"] + '/10');
            $('#m1VoteCount').html('Number of Ratings: ' + result[random]["vote_count"]);
            $('#m1Description').html(result[random]["description"]);
            $('#m1Image').attr("href", result[random]["imageURL"]);
            cutDescription();
        // Explore
       }
       else {
           $.get('/getAllMovies', function(result){
                //Movie 1 Data
                $('#m1Title').html(result[random]["title"] + ' - id: ' +result[random]['id']);
                $('#m1Runtime').html( 'Runtime '+ result[random]["runtime"]+' mins');
                if(result[random]["budget"] == 0){
                    $('#m1Budget').html('Budget: Unknown');
                }else{
                    $('#m1Budget').html('Budget: ' + result[random]["budget"]);
                }
                if(result[random]["revenue"] == 0){
                    $('#m1Revenue').html('Revenue: Unknown');
                }else{
                    $('#m1Revenue').html('Revenue: ' + result[random]["revenue"]);
                }
                $('#m1AvgVote').html( 'Average Rating: ' + result[random]["vote_average"] + '/10');
                $('#m1VoteCount').html('Number of Ratings: ' + result[random]["vote_count"]);
                $('#m1Description').html(result[random]["description"]);
                $('#m1Image').attr("href", result[random]["imageURL"]);
                cutDescription();
           })
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

window.addEventListener('load', async function (event) {
    load_recommendation();
});

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

function moreDesc() {
    $('#m1Description').find('span').toggle();
    $('#m1Description').find('a:last').hide();
    $('#m1SeeMore').text(function(i, text){
        return text === "See Less" ? "See More" : "See Less";
    }) 
}