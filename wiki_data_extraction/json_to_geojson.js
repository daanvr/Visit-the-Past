

    console.log("Boot");
// $.getJSON("https://raw.githubusercontent.com/daanvr/test/master/query-6.json", function () { }).done(function (loadedData) {
//     console.log("loaded");
// });



function makeSPARQLQuery( endpointUrl, sparqlQuery, doneCallback ) {
	var settings = {
		headers: { Accept: 'application/sparql-results+json' },
		data: { query: sparqlQuery }
	};
	return $.ajax( endpointUrl, settings ).then( doneCallback );
}

const culturalHeritage = "Q210272" // 485.000x
const militaryFacility = "Q18691599"  // 58.780x
const ancientGreekTemple = "Q267596"  //117x
const ancientRomanTemple = "Q867143"  //124x
const archaeologicalSite = "Q839954"  //124.319x
const name = ""  //

queryWikiData("Q867143", true, false);

function queryWikiData(Qnumber, labels, limit) {
    var endpointUrl = 'https://query.wikidata.org/sparql',
        sparqlQuery = "SELECT ?item ?location ?img\n" +
            "WHERE {\n" +
            "  ?item wdt:P31/wdt:P279* wd:" + Qnumber + " . \n" +
            "   MINUS {?item wdt:P31 wd:Q1640824 . }\n" +
            "   MINUS {?item wdt:P31 wd:Q1772    . }\n" +
            "   MINUS {?item wdt:P31 wd:Q838948  . }\n" +
            "   MINUS {?item wdt:P31 wd:Q860861  . }\n" +
            "   MINUS {?item wdt:P31 wd:Q602202  . }\n" +
            "  OPTIONAL {?item wdt:P625 ?location}\n" +
            "  OPTIONAL {?item wdt:P18 ?img} \n";
        if (labels) {} else {
            sparqlQuery += "#";
        }
        sparqlQuery += "SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE], en\".   }\n" +
            "}\n";
        if (limit == false) {
            //no limit
        } else if (limit === Number) {
            sparqlQuery += "LIMIT " + limit;
        } else {
            sparqlQuery += "LIMIT 10";
        }
        
            // "#LIMIT 1";

        console.log(sparqlQuery);

    makeSPARQLQuery( endpointUrl, sparqlQuery, function( data ) {
            $( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
            console.log( data );
            // console.log( data.results.bindings[0].item.value );
            // console.log( data.results.bindings[0].location.value );
            // console.log( data.results.bindings[0].img.value );
            // console.log( data.results.bindings[1].item.value );
            // console.log( data.results.bindings[1].location.value );
            // console.log( data.results.bindings[1].img.value );
        transformJsonToGoejson(data);
        }
    );
}




function transformJsonToGoejson(data) {
    // console.log(data);
    var newGeojson = {
        "type": "FeatureCollection",
        "features": []
    };
    var failedConversionCounter = 0;
    for (i in data.results.bindings) {
        $("#counter").text(i)
        // configuration needed
        var chequForCoordinates = data.results.bindings[i].location //where in te Json should the coordinats be?
        if (chequForCoordinates != undefined) {
            // configuration needed
            // console.log(data.results.bindings[i].location.value);
            // console.log(data.results.bindings[i].img.value);
            // console.log(data.results.bindings[i].item.value);

            var cleanLongLat = data.results.bindings[i].location.value.replace("Point(", "");
            cleanLongLat = cleanLongLat.replace(")", "");
            const lonlat = cleanLongLat.split(" ")
            const lon = lonlat[0];           //where in te Json is the Longitude
            const lat = lonlat[1];           //where in te Json is the Latitude
            var properties = {};
            if (data.results.bindings[i].item != undefined) {
                properties.q = data.results.bindings[i].item.value;
            }
            if (data.results.bindings[i].img != undefined) {
                properties.i = data.results.bindings[i].img.value;
            }
            // const properties = {
            //     "q": data.results.bindings[i].item.value,
            //     "i": data.results.bindings[i].img.value
            // };                       //where in the Json is the object with the Prperties

            var feature = {
                "type": "Feature",
                "properties": properties,
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        Number(lon),
                        Number(lat)
                    ]
                }
            };
            newGeojson.features.push(feature)
        } else { failedConversionCounter++ }
    }
    // console.log(newGeojson.features);
    // $("body").append("<p>" + newGeojson.features.length + " succesfull conversions" + "</p>");
    $("body").append("<p>" + failedConversionCounter + " conversions failed" + "</p>");
    $("body").append("<p>" + JSON.stringify(newGeojson) + "</p>");
    // createDownloadBtn(newGeojson);

}

// function createDownloadBtn(data) {
//     var downloadData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
//     $("body").append('<a href="data:' + downloadData + '" download="data.geojson">download ".geojson" file</a>')
// }

