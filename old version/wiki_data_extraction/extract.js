var listOfPages;
var Data1;
var collectedData = [];
var failedCounter = 0;
var coordinatRequestsCounter = 0;
var totaalcoordinatRequestsCounter = 0;
var categories = ["World_Heritage_in_Danger", "World_Heritage_Sites_by_year_of_inscription", "World_Heritage_Sites_in_Africa", "World_Heritage_Sites_in_North_Africa", "World_Heritage_Sites_in_Albania", "World_Heritage_Sites_in_Central_America", "World_Heritage_Sites_in_North_America", "World_Heritage_Sites_in_South_America", "World_Heritage_Sites_in_the_Caribbean", "Lists_of_World_Heritage_Sites_in_the_Americas", "World_Heritage_Sites_in_the_Arab_states", "World_Heritage_Sites_in_Argentina", "World_Heritage_Sites_in_Armenia", "World_Heritage_Sites_in_Eastern_Asia", "World_Heritage_Sites_in_Northern_and_Central_Asia", "World_Heritage_Sites_in_Southeast_Asia", "World_Heritage_Sites_in_Southern_Asia", "World_Heritage_Sites_in_Western_Asia", "World_Heritage_Sites_in_Austria", "World_Heritage_Sites_in_Azerbaijan", "World_Heritage_Sites_in_Bangladesh", "World_Heritage_Sites_in_Belarus", "World_Heritage_Sites_in_Belgium", "World_Heritage_Sites_in_Bosnia_and_Herzegovina", "World_Heritage_Sites_in_Brazil", "World_Heritage_Sites_in_Bulgaria", "World_Heritage_Sites_in_China", "World_Heritage_Sites_in_Cambodia", "World_Heritage_Sites_in_Canada", "World_Heritage_Sites_in_Chile", "World_Heritage_Sites_in_Colombia", "World_Heritage_Sites_in_Croatia", "World_Heritage_Sites_in_Cuba", "World_Heritage_Sites_in_Cyprus", "World_Heritage_Sites_in_the_Czech_Republic", "World_Heritage_Sites_in_Egypt", "World_Heritage_Sites_in_Ethiopia", "World_Heritage_Sites_in_Denmark", "World_Heritage_Sites_in_Eastern_Europe", "World_Heritage_Sites_in_Northern_Europe", "World_Heritage_Sites_in_Southern_Europe", "World_Heritage_Sites_in_Western_Europe", "World_Heritage_Sites_in_France", "World_Heritage_Sites_in_Georgia_(country)", "World_Heritage_Sites_in_Germany", "World_Heritage_Sites_in_Greece", "World_Heritage_Sites_in_Haiti", "World_Heritage_Sites_in_Hungary", "World_Heritage_Sites_in_India", "World_Heritage_Sites_in_Indonesia", "World_Heritage_Sites_in_Iran", "World_Heritage_Sites_in_Iraq", "World_Heritage_Sites_in_the_Republic_of_Ireland", "World_Heritage_Sites_in_Israel", "World_Heritage_Sites_in_Italy", "World_Heritage_Sites_in_Japan", "World_Heritage_Sites_in_Jordan", "World_Heritage_Sites_in_Kazakhstan", "World_Heritage_Sites_in_South_Korea", "World_Heritage_Sites_in_Kyrgyzstan", "World_Heritage_Sites_in_Luxembourg", "World_Heritage_Sites_in_North_Macedonia", "World_Heritage_Sites_in_Madagascar", "World_Heritage_Sites_in_Malaysia", "World_Heritage_Sites_in_Malta", "World_Heritage_Sites_in_Mexico", "World_Heritage_Sites_in_Mongolia", "World_Heritage_Sites_in_Montenegro", "World_Heritage_Sites_in_Morocco", "World_Heritage_Sites_in_Nepal", "World_Heritage_Sites_in_the_Netherlands", "World_Heritage_Sites_in_Oceania", "World_Heritage_Sites_in_Pakistan", "World_Heritage_Sites_in_the_State_of_Palestine", "World_Heritage_Sites_in_Peru", "World_Heritage_Sites_in_the_Philippines", "World_Heritage_Sites_of_Poland", "World_Heritage_Sites_in_Portugal", "World_Heritage_Sites_in_Romania", "World_Heritage_Sites_in_Russia", "World_Heritage_Sites_of_Sri_Lanka", "World_Heritage_Sites_in_Scotland", "World_Heritage_Sites_in_Serbia", "World_Heritage_Sites_in_Slovenia", "World_Heritage_Sites_in_South_Africa", "World_Heritage_Sites_in_the_Soviet_Union", "World_Heritage_Sites_in_Spain", "World_Heritage_Sites_in_Sweden", "World_Heritage_Sites_in_Switzerland", "World_Heritage_Sites_in_Syria", "World_Heritage_Sites_in_Tajikistan", "World_Heritage_Sites_in_Tanzania", "World_Heritage_Sites_in_Thailand", "World_Heritage_Sites_in_Tunisia", "World_Heritage_Sites_in_Turkey", "World_Heritage_Sites_in_Turkmenistan", "World_Heritage_Sites_in_Ukraine", "World_Heritage_Sites_in_the_United_Kingdom", "World_Heritage_Sites_in_the_United_States", "World_Heritage_Sites_in_Uzbekistan", "World_Heritage_Sites_in_Vietnam", "World_Heritage_Sites_in_Afghanistan", "World_Heritage_Sites_in_Yemen"]
var WHSCounter = 0;
var counterCategorie = 0;
var counterCoordinats = 0;
var dataArray = [];

// "Category%3AWorld_Heritage_Sites_in_France"
// getPages("Category%3AWorld_Heritage_in_Danger");
// getPages("Category%3AWorld_Heritage_Sites_in_Africa");

console.log(categories.length);
for (c in categories) {
    // categories[i]
    getPages("Category%3A" + categories[c], categories[c]);

}

// getPages("Category%3AWorld_Heritage_Sites_in_France");
function getPages(catName, name) {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmlimit=500&format=json&cmtitle=" + catName, function () { }).done(function (jsonDataContainer) {
        Data = jsonDataContainer.query.categorymembers;
        WHSCounter = WHSCounter + Data.length;
        console.log(Data.length + " " + name);
        var nbr = 0;
        var firstTime = true;
        for (i in Data) {
            dataArray.push(Data[i].title)
        }
        counterCategorie++
        if (categories.length == counterCategorie) {
            console.log(WHSCounter);
            batchProces()
            
        }
    });
}

var unvalidPageTitlesArray = [];
var dubbletitlesArray = [];
function batchProces() {
    var sortedDataArray = dataArray.sort();
    console.log(sortedDataArray);
    for (i in sortedDataArray) { //pages
        if (sortedDataArray[i+1] == sortedDataArray[i]) {
            dubbletitlesArray.push(sortedDataArray[i])
        } else {
            if (/List of/i.test(sortedDataArray[i]) || /Category:/i.test(sortedDataArray[i]) || /Template:/i.test(sortedDataArray[i])) {
                unvalidPageTitlesArray.push(sortedDataArray[i])
            } else {
                getCoordinats(sortedDataArray[i]);
            }
        }
    }
    console.log(sortedDataArray);
    console.log(unvalidPageTitlesArray);
    console.log(dubbletitlesArray);
}



function getCoordinats(title) {
    // var urlSafeTitle = encodeURIComponent(title);//translate title to a url safe string
    var urlSafeTitle = title.replace(/ /g,"_");//translate title to a url safe string
    // var urlSafeTitle = title.split(' ').join('_');//translate title to a url safe string
    var queryUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&format=json&titles=" + urlSafeTitle; // request url
    $.getJSON(queryUrl, function () { }).done(function (jsonDataContainer) { // perform the request
        var collectedPageInfo = jsonDataContainer.query.pages[Object.keys(jsonDataContainer.query.pages)[0]] // only get te relevant part
        coordinatRequestsCounter++; //keep track of the number of request that have been done

        collectedData.push(collectedPageInfo); //push page info to array

        if (collectedPageInfo.coordinates === undefined) { // when no coordiants where returnd
            failedCounter++;
        }

        if (WHSCounter == coordinatRequestsCounter) { //when all request where done
            console.log(WHSCounter + " WHS found");
            console.log(collectedData);
            console.log(failedCounter + " Pages did not have lon/lat");
            // var downloadData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(collectedData));
            // $('<a href="data:' + doqnloadData + '" download="data.json">download JSON</a>').appendTo('#container');
            // $("body").append('<a href="data:' + downloadData + '" download="data.json">download JSON</a>')
            transformJsonToGoejson(collectedData)
        }
    });
}






function transformJsonToGoejson(jsonObject) {
    // console.log(jsonObject);
    var newGeojson = {
        "type": "FeatureCollection",
        "features": []
    };
    var failedConversionCounter = 0;
    for (i in jsonObject) {
        // configuration needed
        var chequForCoordinates = jsonObject[i].coordinates         //where in te Json should the coordinats be?
        if (chequForCoordinates != undefined) {
            // configuration needed
            const lon = jsonObject[i].coordinates[0].lon;           //where in te Json is the Longitude
            const lat = jsonObject[i].coordinates[0].lat;           //where in te Json is the Latitude
            const properties = jsonObject[i];                       //where in the Json is the object with the Prperties

            var feature = {
                "type": "Feature",
                "properties": properties,
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        lon,
                        lat
                    ]
                }
            };
            newGeojson.features.push(feature)
        } else { failedConversionCounter++ }
    }
    // console.log(newGeojson.features);
    $("body").append("<p>" + newGeojson.features.length + " succesfull conversions" + "</p>");
    $("body").append("<p>" + failedConversionCounter + " conversions failed" + "</p>");
    createDownloadBtn(newGeojson);
}

function createDownloadBtn(data) {
    var downloadData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    $("body").append('<a href="data:' + downloadData + '" download="data.geojson">download ".geojson" file</a>')
}
