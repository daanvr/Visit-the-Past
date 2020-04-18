//STOP ALLES: de Holly grail is gevonden: query.wikidata.org

//Mega query
"https://query.wikidata.org/#SELECT%20%3Fitem%20%3FitemLabel%20%3FitemDescription%20%3Flocation%20%3Fimg%20%3FuseLable%0AWHERE%20%7B%0A%20%20%3Fitem%20wdt%3AP31%2Fwdt%3AP279%2a%20wd%3AQ210272%20.%0A%20%20%20MINUS%20%7B%3Fitem%20wdt%3AP31%20wd%3AQ1640824%20.%20%7D%0A%20%20%20MINUS%20%7B%3Fitem%20wdt%3AP31%20wd%3AQ1772%20.%20%7D%0A%20%20%20MINUS%20%7B%3Fitem%20wdt%3AP31%20wd%3AQ838948%20.%20%7D%0A%20%20%20MINUS%20%7B%3Fitem%20wdt%3AP31%20wd%3AQ860861%20.%20%7D%0A%20%20%20MINUS%20%7B%3Fitem%20wdt%3AP31%20wd%3AQ602202%20.%20%7D%0A%0A%20%20%0A%20%20%23MINUS%20%7B%3Fitem%20wdt%3AP31%2Fwdt%3AP279%2a%20wd%3AQ1640824%20.%20%7D%0A%20%20%20%23MINUS%20%7B%3Fitem%20wdt%3AP31%2Fwdt%3AP279%2a%20wd%3AQ1772%20.%20%7D%0A%20%20%20%23MINUS%20%7B%3Fitem%20wdt%3AP31%2Fwdt%3AP279%2a%20wd%3AQ838948%20.%20%7D%0A%20%20%20%23MINUS%20%7B%3Fitem%20wdt%3AP31%2Fwdt%3AP279%2a%20wd%3AQ860861%20.%20%7D%0A%20%20%0A%20%20OPTIONAL%20%7B%3Fitem%20wdt%3AP625%20%3Flocation%7D%0A%20%20OPTIONAL%20%7B%3Fitem%20wdt%3AP18%20%3Fimg%7D%20%0A%20%20%23OPTIONAL%20%7B%3Fitem%20wdt%3AP366%20%3Fuse%7D%0A%20%20%0A%23%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2C%20en%22.%20%20%20%7D%0A%7D%0A%0A%23GROUP_CONCAT%28%3Fuse%20%3B%20separator%3D%22%2C%20%22%29.%0A%0A%23LIMIT%20100"

//Selected
Selected = [
    "?item wdt:P31/wdt:P279* wd:Q267596 .",  //ancient Greek temple  117x
    "?item wdt:P31/wdt:P279* wd:Q839954 .", //archaeological site 124.319x
    "?item wdt:P31/wdt:P279* wd:Q18691599. ", //Military facility 58.780x (bunkers, castels walls, ...)
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
]
//ToDo
//- add OSM tag
//- googlemaps ID
//-bunqers








//world hertiage 
"https://query.wikidata.org/#SELECT%20%3Fbuilding%20%3FbuildingLabel%20%3FbuildingDescription%20%3Flocation%20%3Fimg%0AWHERE%20%7B%0A%20%20%3Fbuilding%20wdt%3AP1435%20wd%3AQ9259%20.%0A%20%20OPTIONAL%20%7B%3Fbuilding%20wdt%3AP625%20%3Flocation%7D%0A%20%20OPTIONAL%20%7B%3Fbuilding%20wdt%3AP18%20%3Fimg%7D%20%0A%20%20OPTIONAL%20%7B%3Fbuilding%20wdt%3AP366%20%3Fuse%7D%0A%20%20%0A%20%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%7D%0A%7D"

//Roman amphiethaters
"https://query.wikidata.org/#SELECT%20%3Fbuilding%20%3FbuildingLabel%20%3FbuildingDescription%20%3Flocation%20%3Fimg%0AWHERE%20%7B%0A%20%20%3Fbuilding%20wdt%3AP31%20wd%3AQ7362268%20.%0A%20%20OPTIONAL%20%7B%3Fbuilding%20wdt%3AP625%20%3Flocation%7D%0A%20%20OPTIONAL%20%7B%3Fbuilding%20wdt%3AP18%20%3Fimg%7D%20%0A%20%20OPTIONAL%20%7B%3Fbuilding%20wdt%3AP366%20%3Fuse%7D%0A%20%20%0A%20%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%0A%20%20%7D%0A%7D"

wdt: // relation ship
exemple: "is instance of"
wd: // specific exemple
exemple: "roman thater"

Exemple list of items:
Q1473950 = "step wels"


//wikidata Qnumber to wikipedia link
"https://www.wikidata.org/w/api.php?action=wbgetentities&format=&props=sitelinks&ids=Q19675&sitefilter=frwiki"

//all instance of or children of them again.
wdt:P31/wdt:P279*

//query wikidata exemples
"https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples"
//query wikidata Q&A
"https://www.wikidata.org/wiki/Wikidata_talk:SPARQL_query_service/queries"


//ancient civilisations instances
var civilisations = [
    {
        "civilization": "http://www.wikidata.org/entity/Q8735",
        "civilizationLabel": "Medes",
        "civilizationDescription": "ancient Iranian civilization"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q11767",
        "civilizationLabel": "Mesopotamia",
        "civilizationDescription": "area of the Tigris–Euphrates river system"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q11768",
        "civilizationLabel": "Ancient Egypt",
        "civilizationDescription": "ancient civilization of Northeastern Africa"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q11772",
        "civilizationLabel": "Ancient Greece",
        "civilizationDescription": "civilization belonging to an early period of Greek history"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q28405",
        "civilizationLabel": "Gojoseon",
        "civilizationDescription": "ancient state, based in northern Korean peninsula and Manchuria"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q32047",
        "civilizationLabel": "Illyria",
        "civilizationDescription": "classical region in the western part of the Balkan Peninsula"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q35355",
        "civilizationLabel": "Sumer",
        "civilizationDescription": "ancient civilization and historical region in southern Mesopotamia"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q38060",
        "civilizationLabel": "Gaul",
        "civilizationDescription": "region of ancient Europe"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q41741",
        "civilizationLabel": "Thrace",
        "civilizationDescription": "A region in Southeast Europe"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q42534",
        "civilizationLabel": "Indus Valley Civilization",
        "civilizationDescription": "Bronze Age civilization in the Indian subcontinent"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q128904",
        "civilizationLabel": "Elam",
        "civilizationDescription": "ancient pre-Iranian civilization between 2700 and 539 BC"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q134178",
        "civilizationLabel": "Minoan civilization",
        "civilizationDescription": "Bronze Age Aegean civilization flourishing on the island of Crete and other Aegean islands  from c. 2600 to 1100 BC"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q173082",
        "civilizationLabel": "Dacia",
        "civilizationDescription": "Dacian kingdom"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q185068",
        "civilizationLabel": "Urartu",
        "civilizationDescription": "Iron Age kingdom located in a large region around Lake Van"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q244762",
        "civilizationLabel": "Mari",
        "civilizationDescription": "ancient Sumerian and Amorite city"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q768212",
        "civilizationLabel": "Turco-Mongol",
        "civilizationDescription": "A modern designation for many travelers who came under the rule of the Mongol Empire."
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q1364601",
        "civilizationLabel": "Gallo-Roman culture",
        "civilizationDescription": "Romanised culture of Gaul under the rule of the Roman Empire"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q2429397",
        "civilizationLabel": "Ancient Carthage",
        "civilizationDescription": "empire defined as the Phoenician city-state of Carthage and its sphere of influence, esp. during 7th to 3rd centuries BC"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q3327860",
        "civilizationLabel": "Gaelic Ireland",
        "civilizationDescription": "Gaelic political and social order that existed in Ireland from the prehistoric era until the early 17th century"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q3804085",
        "civilizationLabel": "Q3804085"
    },
    {
        "civilization": "http://www.wikidata.org/entity/Q4752820",
        "civilizationLabel": "Ancient Crete",
        "civilizationDescription": "ancient civilization on the island of Crete"
    }
];




// info wiki: https://www.mediawiki.org/wiki/Extension:GeoData#API

"https://en.wikipedia.org/w/api.php?action=query" //bas url for query

"&format=json" //get json back

//parameters of a geo search
"&list=geosearch" // performing a geo search
"&gscoord=52.262122%7C6.142892" //here to search
"&gsradius=10000" //search distance
"&gslimit=500" // get up to 500 results. the documentation sais it might be less than requested

// returned variables
"&gsprop=type%7Cname%7Cdim%7Ccountry%7Cregion" //details to return
"&gsprimary=all" // also more details?

var olympia = "21.629633903503418%7C37.638151462014896";

//search for wiki pages around olympia
"https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gslimit=500&gsprop=type%7Cname%7Cdim%7Ccountry%7Cregion&gsprimary=all&gscoord=37.638151462014896%7C21.629633903503418"

// search for coordinates of specific page
"https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&titles=List_of_Ancient_Greek_temples"

//List of ancien greec temples
"https://en.wikipedia.org/wiki/List_of_Ancient_Greek_temples"






// __________________________ Monuments bata base  _______________________________
"https://tools.wmflabs.org/heritage/api/" //helpfull tool to make api query
"https://tools.wmflabs.org/heritage/api/api.php?action=search&srcountry=nl&srlang=&srname=&sraddress=&srmunicipality=&userlang=en&format=html" //all monuments in NL
"https://tools.wmflabs.org/wlmuk/index_wd.html#" // tool to find monuments in the world in many DBs



"https://www.wikidata.org/wiki/Q19611482" //exemple page from WikiData
"https://www.mediawiki.org/wiki/API:Main_page"  // wiki API documentation 
"https://www.mediawiki.org/wiki/API:Lists/All#Allpages" // more documentation
"https://www.mediawiki.org/wiki/API:Properties"  // some more documetnation





//________________________________________ other ___________________________________________
"title": "Category:Coordinates on Wikidata" // wiki cathegorie 
"title": "Category:Landmarks in France"  // wiki categorie
"title": "Category:Articles with Geo"// wiki categorie
"title": "Category:Geographic coordinate lists" // wiki categorie
"title": "Category:Lists of World Heritage Sites" // wiki categorie
"title": "Category:Lists of coordinates" // wiki categorie
"title": "Category:Pages using Timeline"  // wiki categorie


//get PAGES of cathegorie
"https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Lists_of_World_Heritage_Sites&cmlimit=500"
//get SUBcategories from categorie
"https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Lists_of_World_Heritage_Sites&cmtype=subcat"
//get catheories from a known wikipedia page.
"https://en.wikipedia.org/w/api.php?action=query&titles=List_of_World_Heritage_Sites_in_Africa&prop=categories&cllimit=500"


//___________________ get all UNESCO World Hertiage Sites wikiepedia pages __________________
"title": "Category:Lists of World Heritage Sites" // pages of this categorie give pages like the one on the next line.
"title": "Category:World_Heritage_Sites_in_France"
"title": "Category:World_Heritage_Sites_in_Netherlands" // ? not tested





// Results: all pages from cathegorie World_Heritage_Sites_in_France
"https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category%3AWorld_Heritage_Sites_in_France&cmlimit=500&format=json"



//ancyent greec templs
"https://en.wikipedia.org/w/api.php?action=query&titles=List_of_Ancient_Greek_temples&prop=links&pllimit=max&plcontinue=226160|0|Lieutenant_General"