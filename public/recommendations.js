
//Populates the movies
$(function(){
    var e = 0.2;
    var randomGreedy = Math.random();
    $.get("/getRecommendations", function(result){
        var random = Math.floor(Math.random() * (6));
        //prints JSON into hello p placeholder
        //$('#hello').html(JSON.stringify(result));
        
        //Prints databse query to relevant placeholder
        //Movie 1 Data
        $('#m1Title').html(result[random]["title"] + ' - id: ' +result[0]['id']);
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

        //Movie 2 Data
        $('#m2Title').html(result[random+1]["title"] + ' - id: ' +result[1]['id']);
        $('#m2Runtime').html( 'Runtime '+ result[random+1]["runtime"]+' mins');
        if(result[random+1]["budget"] == 0){
            $('#m2Budget').html('Budget: Unknown');
        }else{
            $('#m2Budget').html('Budget: ' + result[random+1]["budget"])
        }
        if(result[random+1]["revenue"] == 0){
            $('#m2Revenue').html('Revenue: Unknown');
        }else{
            $('#m2Revenue').html('Revenue: ' + result[random+1]["revenue"]);
        }
        $('#m2AvgVote').html( 'Average Rating: ' + result[random+1]["vote_average"] + '/10');
        $('#m2VoteCount').html('Number of Ratings: ' + result[random+1]["vote_count"]);
        $('#m2Description').html(result[random+1]["description"]);
        $('#m2Image').attr("href", result[random+1]["imageURL"]);

        //Seeing if it should explore with probability e
        //Don't Explore
       if(randomGreedy > e){
            //Movie 3 Data
            $('#m3Title').html(result[random+2]["title"] + ' - id: ' +result[random+2]['id']);
            $('#m3Runtime').html( 'Runtime '+ result[random+2]["runtime"]+' mins');
            if(result[random+2]["budget"] == 0){
                $('#m3Budget').html('Budget: Unknown');
            }else{
                $('#m3Budget').html('Budget: ' + result[random+2]["budget"])
            }
            if(result[random+2]["revenue"] == 0){
                $('#m3Revenue').html('Revenue: Unknown');
            }else{
                $('#m3Revenue').html('Revenue: ' + result[random+2]["revenue"]);
            }
            $('#m3AvgVote').html( 'Average Rating: ' + result[random+2]["vote_average"] + '/10');
            $('#m3VoteCount').html('Number of Ratings: ' + result[random+2]["vote_count"]);
            $('#m3Description').html(result[random+2]["description"]);
            $('#m3Image').attr("href", result[random+2]["imageURL"]);
        //Explore
       }else{
           $.get('/getAllMovies', function(result){
               //Movie 3 Data
                $('#m3Title').html(result[random]["title"] + ' - id: ' +result[random]['id']);
                $('#m3Runtime').html( 'Runtime '+ result[random]["runtime"]+' mins');
                if(result[random]["budget"] == 0){
                    $('#m3Budget').html('Budget: Unknown');
                }else{
                    $('#m3Budget').html('Budget: ' + result[random]["budget"])
                }
                if(result[random]["revenue"] == 0){
                    $('#m3Revenue').html('Revenue: Unknown');
                }else{
                    $('#m3Revenue').html('Revenue: ' + result[random]["revenue"]);
                }
                $('#m3AvgVote').html( 'Average Rating: ' + result[random]["vote_average"] + '/10');
                $('#m3VoteCount').html('Number of Ratings: ' + result[random]["vote_count"]);
                $('#m3Description').html(result[random]["description"]);
                $('#m3Image').attr("href", result[random]["imageURL"]);
                //$('#m3Explanation').html('This was chosen as we wanted to explore your preferences.');
           })
       }

       //Filling in Explanation data
       document.getElementById('m1ExplanationImage').src = result[random]["imageURL"];
       //Getting user age and gender to fill in explanation
       $.get('/userAgeAndGender', function(resultUser){
           if(resultUser[0] == "<18" && resultUser[1] == "female"){
               document.getElementById('m1GenderAndAge').src = "./images/Explanations/female.png";
           }else if(resultUser[0] == "18-29" && resultUser[1] == "female"){
                document.getElementById('m1GenderAndAge').src = "./images/Explanations/female29.png"
           }else if(resultUser[0] == "30-44" && resultUser[1] == "female"){
                document.getElementById('m1GenderAndAge').src = "./images/Explanations/female44.png"
           }else if(resultUser[0] == "45+" && resultUser[1] == "female"){
                document.getElementById('m1GenderAndAge').src = "./images/Explanations/female45.png"
           }else if(resultUser[0] == "<18" && resultUser[1] == "male"){
                document.getElementById('m1GenderAndAge').src = "./images/Explanations/male18.png";
           }else if(resultUser[0] == "18-29" && resultUser[1] == "male"){
                document.getElementById('m1GenderAndAge').src = "./images/Explanations/male29.png"
           }else if(resultUser[0] == "30-44" && resultUser[1] == "male"){
                document.getElementById('m1GenderAndAge').src = "./images/Explanations/male44.png"
           }else if(resultUser[0] == "45+" && resultUser[1] == "male"){
                document.getElementById('m1GenderAndAge').src = "./images/Explanations/male45.png"
           }
       })

       //Filling in highest rated movie group for explanation
       document.getElementById('m1Highest').src= result[random+3]["imageURL"];

       //Filling in lowest rated movie group for explanation
       $.get('/lowestRated', function(result){
           document.getElementById('m1Lowest').src = result[random]["imageURL"];
       })

    });

})

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