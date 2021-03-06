var selectedQ = undefined;
var QnbrGeojson = {
    'type': 'FeatureCollection',
    'features': [
    ]
};
var resultsFromQuery = [];
var ResultsObject = {};
var results; // results form commons.wikimedia img search from category
var imgSlideIndex = 1;
var mapIsActive = false;

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFhbnZyIiwiYSI6ImNpdTJmczN3djAwMHEyeXBpNGVndWtuYXEifQ.GYZf7r9gTfQL3W-GpmmJ3A';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/daanvr/ck6w0ou1w0a1f1ipltfr1cx6k', // stylesheet location
    center: [14, 40], // starting position [lng, lat]
    zoom: 4,
    hash: true
});

//location search
map.addControl(
    new MapboxGeocoder({
        accessToken: "pk.eyJ1IjoiZGFhbnZyIiwiYSI6ImNpdTJmczN3djAwMHEyeXBpNGVndWtuYXEifQ.GYZf7r9gTfQL3W-GpmmJ3A",
        mapboxgl: mapboxgl,
        position: 'top-left'
    }), 'top-left'
);

// Zoom and rotation constroles.
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// Fullscreen constroles.
map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

// Add geolocate control to the map.
// map.addControl(
//     new mapboxgl.GeolocateControl({
//         positionOptions: {
//             enableHighAccuracy: true
//         },
//         trackUserLocation: true
//     })
// );

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}


$("#topRight").click(toggleInfoBackground);
$("#websiteInfoBackground").click(toggleInfoBackground);


$(".bluredCoverImgBackground").click(
    hideWelcomCoverPage
);
$("#coverContainer").click(
    hideWelcomCoverPage
);

function hideWelcomCoverPage() {
    $(".bluredCoverImgBackground").toggleClass("transparent");
    $("#coverContainer").toggleClass("transparent");

    setTimeout(function () {
        $(".bluredCoverImgBackground").hide();
        $("#coverContainer").hide();
    }, 500);
}

function toggleInfoBackground() {
    $("#map").toggleClass("squished");
    closeFullscreen();
}

var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

function buildAllVisibleItems() {
    $('#itemBottomPositioner').animate({
        scrollLeft: 0
    }, 250);
    var features = map.queryRenderedFeatures({ layers: ['QnbrLayer'] });

    // function compare(a, b) {
    //     if (a.properties.toename < b.properties.toename) {
    //         return 1;
    //     }
    //     if (a.properties.toename > b.properties.toename) {
    //         return -1;
    //     }
    //     return 0;
    // }

    // features.sort(compare);

    console.log(features);


    $("#horisontalScrollcontainer").html("");
    var QnbrDone = {};
    for (i in features) {
        var Q = features[i].properties.Qnbr;
        if (QnbrDone[ResultsObject[Q].imgthum] === undefined) {
            QnbrDone[ResultsObject[Q].imgthum] = true;
            if (ResultsObject[Q].imgthum != undefined) {
                var html = '<img ondblclick="openGalleryVieuw(\'' + ResultsObject[Q].qnumber + '\');" onclick="selectNew(\'' + ResultsObject[Q].qnumber + '\');" onmouseover="setMarker(' + ResultsObject[Q].geo + ')" onmouseout="setMarker()" src="' + ResultsObject[Q].imgthum + '" alt="' + ResultsObject[Q].label + '" class="itemImg">';
                $("#horisontalScrollcontainer").append(html);
            }
        } else {
            console.log("duplicate prevented");
        }
    }
    console.log(QnbrDone);
}

function flyTo(lon, lat, zoom) {
    if (zoom === undefined) { zoom = 10 };
    map.flyTo({
        center: [
            lon,
            lat
        ],
        zoom: zoom,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
};

map.on('load', function () {
    mapIsActive = true;

    map.addSource('QnbrSource', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
            ]
        }
    });

    map.addLayer({
        "id": "QnbrLayer",
        "type": "circle",
        "source": "QnbrSource",
        // "source-layer": "QnbrSource",
        "layout": {},
        "paint": {
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                8,
                4,
                22,
                20
            ],
            "circle-color": "hsla(108, 0%, 100%, 0.63)",
            "circle-stroke-color": "hsla(350, 0%, 0%, 0.52)",
            "circle-stroke-width": 0.5
        }
    });

    map.on('mousemove', 'QnbrLayer', function (e) {
        var hoverdQID = e.features[0].properties.Qnbr;
        if (ResultsObject[hoverdQID].imgthum != undefined) {
            var html = '<img src="' + ResultsObject[hoverdQID].imgthum + '" alt="' + ResultsObject[hoverdQID].label + '" class="popupImg">';
            popup
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(map);

            map.getCanvas().style.cursor = 'pointer';
        } else {
            var html = '<p class="popupText">No image</p>';
        }
        // console.log(e);
    });

    map.on('mouseleave', 'QnbrLayer', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    map.on('click', function (e) {
        // var lng = e.lngLat.lng;
        // var lat = e.lngLat.lat;
        // var zoom = 10;
        // var gid = e.features[0].properties.gid;
        selectNew(undefined);
        console.log("test332211")
    });
    map.on('click', 'QnbrLayer', function (e) {
        // var lng = e.lngLat.lng;
        // var lat = e.lngLat.lat;
        // var zoom = 10;
        // var gid = e.features[0].properties.gid;
        selectNew(e.features[0].properties.Qnbr);
    });


    map.on('moveend', function () {
        buildAllVisibleItems()
    });




});




function scrollToItem(gid) {
    // console.log("test@2");
    // var offset = $(".city-" + gid).offset(); // Contains .top and .left
    // offset.left -= 20;
    // console.log(offset.left);
    // $('#horisontalScrollcontainer').animate({ //scroles higlited item into vieuw
    //     scrollRight: offset.left
    // });

    // console.log($(".city-" + gid).offsetParent());
    // console.log("positon: " + $(".city-" + gid).position().left);
    // console.log("get: " + $(".city-" + gid).get(0).offsetLeft);
    // console.log("offset: " + $(".city-" + gid).offset().left);
    // console.log("horisontalScrollcontainer offset: " + $("#horisontalScrollcontainer").offset().left);
    // console.log("Calc: " + Math.abs($("#horisontalScrollcontainer").offset().left) + $(".city-" + gid).offset().left);

    // var position = $(".city-" + gid).get(0).offsetLeft;
    // var position = Math.abs($("#horisontalScrollcontainer").offset().left) + $(".city-" + gid).offset().left;
    // $('#itemBottomPositioner').animate({
    //     scrollLeft: position
    // }, 1000);

    // $(".city-" + gid)[0].scrollIntoView({
    //     behavior: "smooth", // or "auto" or "instant"
    //     block: "start" // or "end"
    // });

}

// function showEbikeRange(gid) {
//     var filterVal = ["all", ["match", ["get", "Name"], [gid], true, false]];
//     map.setFilter("zone-polygonen-border", filterVal);
//     map.setFilter("ebike-polygonen", filterVal);
//     map.setFilter("bike-polygonen", filterVal);
// };

function buildGeojsonFromQueryResults() {
    for (i in resultsFromQuery) {
        addPointToQnbrGeojson(resultsFromQuery[i].geo, resultsFromQuery[i].qnumber)
    }
    if (mapIsActive) {
        map.getSource('QnbrSource').setData(QnbrGeojson);
        $("#loadingBox").hide();
        setTimeout(function () {
            buildAllVisibleItems()
        }, 500);
    } else {
        map.on('load', function () {
            map.getSource('QnbrSource').setData(QnbrGeojson);
            $("#loadingBox").hide();
            buildAllVisibleItems()
        });
    }
}

function addPointToQnbrGeojson(LngLat, Qnbr) {
    // console.log("show point");
    // for (i in LngLat) {
    var point = {
        "type": "Feature",
        "properties": {
            'Qnbr': Qnbr
        },
        "geometry": {
            "type": "Point",
            "coordinates": LngLat
        }
    };


    QnbrGeojson.features.push(point)
    // }
}


runQuery();
function runMegaQuery() {
    function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
        var settings = {
            headers: { Accept: 'application/sparql-results+json' },
            data: { query: sparqlQuery }
        };
        return $.ajax(endpointUrl, settings).then(doneCallback);
    }

    var endpointUrl = 'https://query.wikidata.org/sparql',
        sparqlQuery = "#defaultView:Map\n" +
            "SELECT DISTINCT ?item ?itemLabel ?itemDescription ?geo ?img ?commons ?instanceOf ?instanceOfLabel ?sitelink WHERE {\n" +
            "  # \"instance of\" \"Roman amphitheatre\" or(UNION) \"Greek theatre\" or one of it's subclasses(/wdt:P279*)\n" +
            "  {?item wdt:P31/wdt:P279* wd:Q7362268.} #Roman amphitheatre\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q2860319} #Greek Theater\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q69391739} #Greek colony\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q24933318} #Galo-roman amphiteaters\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q6581615} #Thermae\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q19757} #Roman theatre\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q867143} #Roman temple\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q918230} #Roman villa\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q2202509} #Roman city\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q782970} #domus \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q252021} #villa rustica\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q180927} #mastaba \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q2270185} #Mesoamerican pyramids \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q1456099} #step pyramid\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q731966} #nymphaeum \n" +
            "  UNION {?item wdt:P361/wdt:P279* wd:Q38888} #Olympia \n" +
            "  UNION {?item wdt:P361/wdt:P279* wd:Q43332} #Pompeii \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q6581615} #thermae  \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q1473950} #stepwell \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q3411290} #smooth-sided pyramid\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q200141} #necropolis v\n" +
            // "  UNION {?item wdt:P31/wdt:P279* wd:Q427287} #Wat \n" +   //To many modern results
            "  UNION {?item wdt:P31/wdt:P279* wd:Q877152} #White elephant\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q12223988} #sphinx \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q66108498} #Wonder of the Ancient World\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q13466456} #house of millions of years\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q665247} #hypogeum \n" +
            "  UNION {?item wdt:P179/wdt:P279* wd:Q458082} #list of burials in the Valley of the Kings\n" +
            "  UNION {?item wdt:P179/wdt:P279* wd:Q690551} #list of Theban Tombs\n" +
            "  UNION {?item wdt:P136/wdt:P279* wd:Q6611811} #list of colossal sculpture in situ\n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q855747} #Egyptian temple \n" +
            "  UNION {?item wdt:P31/wdt:P279* wd:Q15661340} #ancient city \n" +
            "  UNION {?item wdt:P361/wdt:P279* wd:Q5788} #Petra  \n" +
            "  UNION {?item wdt:P5008/wdt:P279* wd:Q68074438} #WikiProject Livius \n" +
            "  UNION {?item wdt:P2596/wdt:P279* wd:Q220594} #Nabataeans  \n" +
            "  UNION {?item wdt:P361/wdt:P279* wd:Q163607} #Angkor \n" +
            "  UNION {?item wdt:P361/wdt:P279* wd:Q1493784} #Chemtou, archaeological site in Tunisia \n" +
            "  UNION {?item wdt:P361/wdt:P279* wd:Q3378708} #Pheradi Majius \n" +
            // "  UNION {?item wdt:P31/wdt:P279* wd:Q665247} #hypogeum \n" +
            // "  UNION {?item wdt:P31/wdt:P279* wd:Q665247} #hypogeum \n" +
            "  UNION {\n" +
            "    ?romanArchio wdt:P2596 wd:Q1747689. #everything Ancient Rome\n" +
            "    ?romanArchio wdt:P625 ?notRelavant. #Only keep thing with a location\n" +
            "    ?item wd:* ?romanArchio. #add them to item\n" +
            "  } # Anicent Roman Locations\n" +
            "    UNION {\n" +
            "    ?romanCity wdt:P31/wdt:P279* wd:Q2202509. #everything Ancient Rome\n" +
            "    ?romanCity wdt:P625 ?notRelavant. #Only keep archiological site\n" +
            "    ?item wd:* ?romanCity. #add them to item\n" +
            "  }  \n" +
            "  ?item wdt:P625 ?geo . #Filter on \"has a location\"\n" +
            "  OPTIONAL {?item wdt:P18 ?img}. # if result has a location, get it\n" +
            "  OPTIONAL {?item wdt:P373 ?commons}. # wiki commons img categorie\n" +
            "  OPTIONAL {?item wdt:P31 ?instanceOf}. #Hat is it part of?\n" +
            "  OPTIONAL { ?sitelink schema:about ?item.\n" +
            "    ?sitelink schema:isPartOf <https://en.wikipedia.org/>. }\n" +
            "\n" +
            "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
            "\n" +
            "}\n" +
            "LIMIT 10000";

    makeSPARQLQuery(endpointUrl, sparqlQuery, function (data) {
        // $('body').append($('<pre>').text(JSON.stringify(data)));
        // console.log(data);
        processQueryResults(data);

    }
    );

}
function runQuery(searchQnumber) {
    if (searchQnumber === undefined) {
        searchQnumber = "Q15661340";
    }
    function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
        var settings = {
            headers: { Accept: 'application/sparql-results+json' },
            data: { query: sparqlQuery }
        };
        return $.ajax(endpointUrl, settings).then(doneCallback);
    }

    var endpointUrl = 'https://query.wikidata.org/sparql',
        sparqlQuery = "#defaultView:Map\n" +
            "SELECT DISTINCT ?item ?itemLabel ?itemDescription ?geo ?img ?commons ?instanceOf ?instanceOfLabel ?sitelink WHERE {\n" +
            "  ?item wdt:P31/wdt:P279* wd:" + searchQnumber + ".\n" +
            // "  {?item wdt:P31/wdt:P279* wd:Q7362268.} #Roman amphitheatre\n" +
            // "  UNION {?item wdt:P31/wdt:P279* wd:Q2860319} #Greek Theater\n" +
            "  ?item wdt:P625 ?geo . #Filter on \"has a location\"\n" +
            "  OPTIONAL {?item wdt:P18 ?img}. # if result has a location, get it\n" +
            "  OPTIONAL {?item wdt:P373 ?commons}. # wiki commons img categorie\n" +
            "  OPTIONAL {?item wdt:P31 ?instanceOf}. #Hat is it part of?\n" +
            "  OPTIONAL { ?sitelink schema:about ?item.\n" +
            "    ?sitelink schema:isPartOf <https://en.wikipedia.org/>. }\n" +
            "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
            "}\n" +
            "LIMIT 10000";

    makeSPARQLQuery(endpointUrl, sparqlQuery, function (data) {
        // $('body').append($('<pre>').text(JSON.stringify(data)));
        // console.log(data);
        processQueryResults(data);

    }
    );

}
function processQueryResults(data) {
    //remove duplicates


    for (d in data.results.bindings) {
        var result = {};
        result.qnumber = qnumberExtraction(data.results.bindings[d].item.value);
        result.qnumberURL = data.results.bindings[d].item.value;
        if (data.results.bindings[d].sitelink != undefined) { result.wikipedia = data.results.bindings[d].sitelink.value; }
        if (data.results.bindings[d].geo != undefined) { result.geo = extractLngLat(data.results.bindings[d].geo.value); }
        if (data.results.bindings[d].img != undefined) { result.img = data.results.bindings[d].img.value; }
        if (data.results.bindings[d].img != undefined) { result.imgthum = data.results.bindings[d].img.value + "?width=300px"; }
        if (data.results.bindings[d].commons != undefined) { result.commons = data.results.bindings[d].commons.value; }
        if (data.results.bindings[d].commons != undefined) { result.commonsurl = "https://commons.wikimedia.org/wiki/Category:" + encodeURIComponent(data.results.bindings[d].commons.value); }
        if (data.results.bindings[d].itemLabel != undefined) { result.label = data.results.bindings[d].itemLabel.value; }
        if (data.results.bindings[d].itemDescription != undefined) { result.description = data.results.bindings[d].itemDescription.value; }
        if (data.results.bindings[d].instanceOf != undefined) { result.instanceof = [qnumberExtraction(data.results.bindings[d].instanceOf.value)]; }
        if (data.results.bindings[d].instanceOfLabel != undefined) { result.instanceofLabel = [data.results.bindings[d].instanceOfLabel.value]; }

        resultsFromQuery.push(result);//pushes every result into the array
        if (ResultsObject[result.qnumber] === undefined) {
            ResultsObject[result.qnumber] = result;
        } else {
            ResultsObject[result.qnumber].instanceof = $.merge(ResultsObject[result.qnumber].instanceof, result.instanceof);
            ResultsObject[result.qnumber].instanceof = onlyUniquesInArray(ResultsObject[result.qnumber].instanceof);
            ResultsObject[result.qnumber].instanceofLabel = $.merge(ResultsObject[result.qnumber].instanceofLabel, result.instanceofLabel);
            ResultsObject[result.qnumber].instanceofLabel = onlyUniquesInArray(ResultsObject[result.qnumber].instanceofLabel);

        }
        // buildResultsObject(result);
    }

    relatedInstanceop();
    console.log("query done");
    // console.log(ResultsObject);
    // console.log(resultsFromQuery);
    // buildGeojsonFromQueryResults();
    buildimgColumns();
}

function relatedInstanceop() {
    var allInstanceOfLabels = [];
    var objectOfallInstanceOfLabelsWithCounter = {}
    for (i in resultsFromQuery) {
        allInstanceOfLabels = $.merge(allInstanceOfLabels, resultsFromQuery[i].instanceofLabel)
    }
    for (a in allInstanceOfLabels) {
        if (objectOfallInstanceOfLabelsWithCounter[allInstanceOfLabels[a]] === undefined) {
            objectOfallInstanceOfLabelsWithCounter[allInstanceOfLabels[a]] = 1;
        } else {
            objectOfallInstanceOfLabelsWithCounter[allInstanceOfLabels[a]] = objectOfallInstanceOfLabelsWithCounter[allInstanceOfLabels[a]] + 1
        }
    }
    keysSorted = Object.keys(objectOfallInstanceOfLabelsWithCounter).sort(function(a,b){return objectOfallInstanceOfLabelsWithCounter[b]-objectOfallInstanceOfLabelsWithCounter[a]})
    var test = {}
    for (k in keysSorted) {
        test[keysSorted[k]] = objectOfallInstanceOfLabelsWithCounter[keysSorted[k]];
    }
    console.log(test);
    // console.log(objectOfallInstanceOfLabelsWithCounter);
    console.log(onlyUniquesInArray(allInstanceOfLabels))
}


function emptySearchResults() {
    resultsFromQuery = [];//empties result array
    ResultsObject = {};//empties result object
}

function onlyUniquesInArray(messyArray) {
    // var names = ["Mike", "Matt", "Nancy", "Adam", "Jenny", "Nancy", "Carl"];
    var uniqueArray = [];
    $.each(messyArray, function (i, el) {
        if ($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
    });
    return uniqueArray;
}

function buildResultsObject(result) {
    var Q = result.qnumber;
    if (ResultsObject[Q] != undefined) {
        if (ResultsObject[Q].wikipedia != results.wikipedia) {
            ResultsObject[Q].wikipedia = "";
        };
        if (ResultsObject[Q].geo != results.geo) {
            ResultsObject[Q].geo = "";
        };
        if (ResultsObject[Q].img != results.img) {
            ResultsObject[Q].img = "";
        };
        if (ResultsObject[Q].imgthum != results.imgthum) {
            ResultsObject[Q].imgthum = "";
        };
        if (ResultsObject[Q].commons != results.commons) {
            ResultsObject[Q].commons = "";
        };
        if (ResultsObject[Q].label != results.label) {
            ResultsObject[Q].label = "";
        };
        if (ResultsObject[Q].description != results.description) {
            ResultsObject[Q].description = "";
        };
        if (ResultsObject[Q].instanceof != results.instanceof) {
            ResultsObject[Q].instanceof = "";
        };

    } else {
        ResultsObject[Q] = result;
    }
}

function extractLngLat(dirtyGeo) {
    var cleanLongLat = dirtyGeo.replace("Point(", "");
    cleanLongLat = cleanLongLat.replace(")", "");
    const lonlat = cleanLongLat.split(" ");
    lonlat[0] = Number(lonlat[0]);
    lonlat[1] = Number(lonlat[1]);
    return lonlat;
}

function qnumberExtraction(QURL) {
    var value = QURL.replace("http://www.wikidata.org/entity/", "");
    return value;
}


function getCommonsCategoryImgs(pageTitle, Qdestination, vieuwDestination) {
    if (ResultsObject[Qdestination].commonsImgs != undefined) {
        resultsFromCommonsReady(Qdestination, vieuwDestination);
        return;
    }

    // pageTitle = encodeURIComponent(pageTitle)
    // var apiURL = "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&pageids=4606622&utf8=1&cmtitle=Category%3A" + pageTitle + "&cmtype=subcat%7Cfile&cmlimit=max"
    $(document).ready(function () {
        $.ajax({
            url: 'http://commons.wikimedia.org/w/api.php',
            data: {
                action: 'query',
                format: 'json',
                list: 'categorymembers',
                utf8: '1',
                cmtitle: 'Category:' + pageTitle + '',
                cmtype: 'subcat|file',
                cmlimit: 'max'
            },
            dataType: 'jsonp',
            success: processResult
        });
    });

    function processResult(apiResult) {
        var imgUrlPrefix = "http://commons.wikimedia.org/wiki/Special:FilePath/";
        var pageUrlPrefix = "http://commons.wikimedia.org/wiki/";
        var thumSufix = "?width=300px";
        var arrayOfImgs = [];
        for (r in apiResult.query.categorymembers) {
            if (apiResult.query.categorymembers[r].title.slice(0, 8) != "Category") {
                var imgObject = {
                    imgurl: imgUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title),
                    thumurl: imgUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title) + thumSufix,
                    pageurl: pageUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title)
                };
                arrayOfImgs.push(imgObject)
            }
        }

        var firstImgObject = {
            imgurl: ResultsObject[selectedQ].img,
            thumurl: ResultsObject[selectedQ].imgthum,
            // pageurl: pageUrlPrefix + encodeURIComponent(apiResult.query.categorymembers[r].title)
        };
        arrayOfImgs.unshift(firstImgObject);

        ResultsObject[Qdestination].commonsImgs = arrayOfImgs;
        //  for (var i = 0; i < apiResult.query.search.length; i++){
        //       $('#display-result').append('<p>'+apiResult.query.search[i].title+'</p>');
        //  }
        resultsFromCommonsReady(Qdestination, vieuwDestination);
    };
}

function resultsFromCommonsReady(Q, vieuwDestination) {
    console.log(ResultsObject[Q]);
    switch (vieuwDestination) {
        case "gallery":
            populateGalleryVieuw(Q);

            break;
        case "carousel":
            buildCarouselContent(Q);

            break;
        default:
            break;
    }

    // return results;
}

function buildCarouselContent(Q) {
    var imgs = ResultsObject[Q].commonsImgs;
    $(".imgCarouselImgsContainer").html("");
    // $(".singleImgSelection").hide()
    var nbrOfSlides = imgs.length;
    for (r in imgs) {
        var slideNbr = r;
        slideNbr++;
        var imgHtml = "";
        imgHtml += '<div class="imgSlides">';
        imgHtml += '<div class="numbertext">' + slideNbr + ' / ' + nbrOfSlides + '</div>';
        imgHtml += '<img onclick="openGalleryVieuw(\'' + Q + '\');" class="carouselImg" src="';
        imgHtml += imgs[r].thumurl;
        imgHtml += '">';
        // html += '<div class="text">Caption Text</div>';
        imgHtml += '</div>';
        // html += '';


        var dotHtml = "";
        dotHtml += '<span class="imgDot" onclick="currentSlide(';
        dotHtml += slideNbr;
        dotHtml += ')"></span>';

        $(".imgCarouselImgsContainer").append(imgHtml);
        // $("#imgDotContainer").append(dotHtml);
    }
    currentSlide(1);
    $("#slideshow-container").show();
    $(".singleImgSelection").hide();
}

var marker = new mapboxgl.Marker()
function setMarker(lng, lat) {
    if (lng != undefined && lat != undefined) {
        marker.setLngLat([lng, lat])
            .addTo(map);
    } else {
        marker.remove();
    }
}

function plusSlides(n) {
    showSlides(imgSlideIndex += n);
}

function currentSlide(n) {
    showSlides(imgSlideIndex = n);
}

function showSlides(n) {
    // var i;
    var slides = $(".imgSlides");
    // var dots = $(".imgDot");
    if (n > slides.length) { imgSlideIndex = 1 } //after last go to first    
    if (n < 1) { imgSlideIndex = slides.length } //befor first go to last
    slides.hide(); //hide all images
    // dots.removeClass("active"); // deactivate all dots
    slides[imgSlideIndex - 1].style.display = "block"; //show relevant img
    // dots[imgSlideIndex - 1].className += " active"; // acctivate relavent dot
}

$(document).keydown(function (e) {
    // console.log(e.keyCode);
    switch (e.keyCode) {
        case 37:
            plusSlides(-1);
            break;
        case 39:
            plusSlides(1);
            break;
        default: return;
    }
    e.preventDefault();

});


function openInNewWindow(url) {
    if (selectedQ === undefined) {
        var lngLat = map.getCenter();
        var lng = lngLat.lng;
        var lat = lngLat.lat;
    } else {
        var lng = ResultsObject[selectedQ].geo[0];
        var lat = ResultsObject[selectedQ].geo[1];
    }


    //selectedQ
    switch (url) {
        case "wikidata":
            url = "https://www.wikidata.org/wiki/" + selectedQ;
            break;
        case "wikipedia":
            url = "url-wikipedia";
            break;
        case "commons":
            url = "url-commons";
            break;
        case "commonsGallery":
            url = ResultsObject[selectedQ].commonsurl;
            break;
        case "googleMaps":
            url = "https://www.google.com/maps/@" + lat + "," + lng + ",1000m/data=!3m1!1e3";
            break;
        case "flickr":
            url = "https://www.flickr.com/map?&fLat=" + lat + "&fLon=" + lng + "&zl=15"
            break;
        case "wikishootme":
            url = "https://tools.wmflabs.org/wikishootme/#lat=" + lat + "&lng=" + lng + "&zoom=14";
            break;
        default:
            console.log("no url recognised")
            break;
    }
    console.log("open: " + url)
    window.open(url); //This will open the url in a new window.
}

// function getQueryVariable(variable) { // queries the content of the URL bare for the specified variable
//     var query = window.location.search.substring(1);
//     var vars = query.split('&');
//     console.log(vars);
//     for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split('=');
//         if (pair[0] == variable) {
//             return pair[1];
//         }
//     }

//     return false;
// }

// // console.log(window.location.search.substring(1));
// // console.log(window.location.href);
// // // console.log(new Url);
// // console.log(getUrlVars());

// // function setUrlVariables() {
// //     var currentUrl = 'http://www.example.com/hello.png?w=100&h=100&bg=white';
// //     var url = new URL(currentUrl);
// //     url.searchParams.set("w", "200"); // setting your param
// //     var newUrl = url.href;
// //     console.log(newUrl);
// // }

// function setUrlVariables() {
//     var currentUrl = window.location.href;
//     var url = new URL(currentUrl);
//     url.searchParams.set("w", "200"); // setting your param
//     var newUrl = url.href;
//     console.log(newUrl);
// }


// function getUrlVars() { //returns an object of all cureent URL variables
//     var vars = {};
//     var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
//         vars[key] = value;
//     });
//     return vars;
// }

// function setOrUpdateMapPossitionInUrl() {

// }

// openGalleryVieuw("Q179656");

function openGalleryVieuw(Q) {
    console.log("open gallery: " + Q)
    if (!Q) { //"false" measn close vieuw


        $("#clickForClose").addClass("transparent");
        $("#galleryContainer").addClass("transparent");
        $("#itemBottomPositioner").removeClass("transparent");
        $("#selectionContainer").removeClass("transparent");
        $("#LeftBtnContainer").removeClass("transparent");
        $(".mapboxgl-control-container").removeClass("transparent");
        toggleBlur(".mapboxgl-canvas-container", 0);

        setTimeout(function () {
            $("#clickForClose").hide();
            $("#galleryContainer").hide();
            $("#itemBottomPositioner").show();
            $("#selectionContainer").show();
            $("#LeftBtnContainer").show();
            $(".mapboxgl-control-container").show();
        }, 500);
    } else {
        if (Q === undefined && selectedQ != undefined) {
            Q = selectedQ;
        }
        selectedQ = Q;
        $("#clickForClose").removeClass("transparent");
        $("#galleryContainer").removeClass("transparent");
        $("#itemBottomPositioner").addClass("transparent");
        $("#selectionContainer").addClass("transparent");
        $("#LeftBtnContainer").addClass("transparent");
        $(".mapboxgl-control-container").addClass("transparent");
        toggleBlur(".mapboxgl-canvas-container", 3);

        setTimeout(function () {
            $("#clickForClose").show();
            $("#galleryContainer").show();
            $("#itemBottomPositioner").hide();
            $("#selectionContainer").hide();
            $("#LeftBtnContainer").hide();
            $(".mapboxgl-control-container").hide();
        }, 500);


        // $("#clickForClose").show();
        // $("#galleryContainer").show();
        // $("#itemBottomPositioner").hide();
        // $("#selectionContainer").hide();
        // $(".mapboxgl-control-container").hide();
        // toggleBlur(".mapboxgl-canvas-container", 3);
        // populateGalleryVieuw();
        getCommonsCategoryImgs(ResultsObject[Q].commons, Q, "gallery");
    }
}


function selectNew(Q) {
    if (Q === undefined) {
        selectedQ = undefined;
        $("#selectionContainer").hide();
        $(".singleImgSelection").hide();
        $("#slideshow-container").hide();
        $("#wikidata").hide();
        $("#commons").hide();
        console.log("unselected");
    } else {
        var data = ResultsObject[Q]
        selectedQ = Q;
        console.log("selected" + Q);

        $("#wikidata").show();
        $("#commons").show();
        $("#slideshow-container").hide();
        $("#selectionContainer").show();
        $(".singleImgSelection").attr("src", data.imgthum);
        $(".singleImgSelection").show();
        getCommonsCategoryImgs(data.commons, selectedQ, "carousel");
    };

    // if (data != undefined && lat != undefined) {
    //     flyTo(lng, lat, zoom); //camera flyes to selection
    //     showPoint(lng, lat); // highlight map point
    // };
}


function populateGalleryVieuw(Q) {
    var imgs = ResultsObject[Q].commonsImgs;
    selectGalleryImg(imgs[0].imgurl)
    console.log(imgs);
    $("#leftImgContainer").html("");
    for (r in imgs) {
        console.log(imgs.thumurl);
        var imgHtml = "";
        imgHtml += '<img class="smallImgGal" onclick="selectGalleryImg(\'';
        imgHtml += imgs[r].imgurl;
        imgHtml += '\')" src="';
        imgHtml += imgs[r].thumurl;
        imgHtml += '">';
        // html += '<div class="text">Caption Text</div>';
        // imgHtml += '</div>';
        // html += '';


        // var dotHtml = "";
        // dotHtml += '<span class="imgDot" onclick="currentSlide(';
        // dotHtml += slideNbr;
        // dotHtml += ')"></span>';

        $("#leftImgContainer").append(imgHtml);
        // $("#imgDotContainer").append(dotHtml);
    }
}

function selectGalleryImg(url) {
    $(".bigImgGal").attr('src', url)
}

function toggleBlur(element, blurFactor) {
    var filterVal = 'blur(' + blurFactor + 'px)';
    $(element)
        .css('filter', filterVal)
        .css('webkitFilter', filterVal)
        .css('mozFilter', filterVal)
        .css('oFilter', filterVal)
        .css('msFilter', filterVal);
}







function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function buildimgColumns() {
    if (!$('.column').length) {
        $(".moreImages").append("<div class='columnContainer'></div>");
        for (var i = 0; i < calcNbrOfCollums(); i++) {
            $(".columnContainer").append("<div class='column'></div>");
        }
    }
    populateColumns();
}
function populateColumns() {
    shuffle(resultsFromQuery);
    // console.log(resultsFromQuery);
    // cleanOutColumns();
    for (img in resultsFromQuery) {
        if (img > 500) {
            return;
        }
        var col = img % nbrOfColumns;
        // console.log(col);
        if (resultsFromQuery[img].imgthum != undefined) {
            var html =
                "<img onclick='selectImg(\"" +
                resultsFromQuery[img].qnumber +
                "\")' data-qnbr='" +
                resultsFromQuery[img].qnumber +
                "' src='" +
                resultsFromQuery[img].imgthum +
                "' class='img'>";

            $(".column").eq(col).append(html);
        }
    }
    $(".img").bind("error", function () {
        // Replacing image source
        $(this).hide();
    });
}

function cleanOutColumns() {
    $(".column").each(function () {
        // console.log(this);
        $(this).html("");
    });
}

var nbrOfColumns = 0;
function calcNbrOfCollums() {
    nbrOfColumns = ($("body").width() / 250).toFixed(0);
    return nbrOfColumns;
}

function selectImg(Q) {
    console.log(ResultsObject[Q]);
    cleanOutColumns();
    $(".selectedImg").html("");
    var html =
        "<a href='" +
        ResultsObject[Q].qnumberURL +
        "' target='_blank'>" +
        "<img data-qnbr='" +
        ResultsObject[Q].qnumber +
        "' src='" +
        ResultsObject[Q].img +
        "' class='bigImg'></a>";
    $(".selectedImg").append(html);
    var newQsearchArray = ResultsObject[Q].instanceof
    console.log(ResultsObject[Q].instanceof)
    console.log(ResultsObject[Q].instanceofLabel)
    emptySearchResults();
    for (s in newQsearchArray) {
        console.log("Query Start" + newQsearchArray[s])
        runQuery(newQsearchArray[s])
    }


    $(".bigImg").one("load", function () {
        // populateColumns();
    }).each(function () {
        if (this.complete) {
            $(this).trigger('load');
        }
    });
}

$("#searchTextImput").keyup(function () {
    console.log($("#searchTextImput").val())
    emptySearchResults();
    cleanOutColumns();
    runQuery($("#searchTextImput").val())
    $(".selectedImg").html("");
});