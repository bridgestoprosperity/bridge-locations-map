import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/scss/bootstrap.scss";
import "./custom-style.css";
import { parse } from "papaparse";
import { addBridgeLayers } from "./add-bridges";
import { addSidebar } from "./sidebar";
import { addToolbar } from "./add-toolbar";

// map stuff
mapboxgl.accessToken = "pk.eyJ1IjoiYnJpZGdlc3RvcHJvc3Blcml0eSIsImEiOiJjajRpd2sxeGQwMjU5MnhxajJkNzZnODZtIn0.UrOwxq6A1Zl2yvwzYxBudQ";
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/bridgestoprosperity/cltoqo59801dy01pth4rje7h5", // style URL
    center: [29.8739, -1.9403], // starting position [lng, lat]
    zoom: 4, // starting zoom
    hash: true,
});

map.on("load", () => {
    // Iterate over each region and then each country within that region
    addSidebar(map);
    addToolbar(map);
    fetch("https://public-b2p-geodata.s3.amazonaws.com/webmap-bridges/webmap-bridges.csv")
        .then((response) => response.text())
        .then((csv) => {
            // Parse the CSV into JSON
            var data = parse(csv, { header: true }).data;
            // create a json object that is how many bridges are in each country
            let countryBridgeCount = {};
            data.forEach((item) => {
                if (countryBridgeCount[item.Country__c]) {
                    countryBridgeCount[item.Country__c]++;
                } else {
                    countryBridgeCount[item.Country__c] = 1;
                }
            });

            var geojsonBridges = {
                type: "FeatureCollection",
                features: data.map((item) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [parseFloat(item.GPS__Longitude__s), parseFloat(item.GPS__Latitude__s)],
                    },
                    properties: item,
                })),
            };

            map.addSource("bridges-source", {
                type: "geojson",
                data: geojsonBridges,
            });
            addBridgeLayers("standard", map);

            let bridgeCard = document.getElementById("bridge-card");
            let closeBridgeCardButton = document.getElementById("bridge-card-button-img");
            map.on("mouseenter", "bridge-pin-layer", function (e) {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "bridge-pin-layer", function () {
                map.getCanvas().style.cursor = "";
            });
            map.on("click", "bridge-pin-layer", function (e) {
                bridgeCard.style.transform = "translateX(-350px)";
                let bridgeData = e.features[0].properties;
                let bridgeCardTitle = document.getElementById("bridge-card-title");
                let bridgeCardText = document.getElementById("bridge-card-text");
                console.log("bridgeData", bridgeData);
                bridgeCardTitle.textContent = bridgeData.Bridge_Name__c;
                // bridgeCardText.textContent = bridgeData.Country__c + "\n" + "Individuals Served" + bridgeData.Individuals_Directly_Served__c;

                // make briegeCardText a list of teh bridge data
                bridgeCardText.innerHTML = "";
                let bridgeCardDataTitles = ["Country", "Status", "Individuals Served", "Bridge Type"]
                let bridgeCardDataText = [bridgeData.Country__c, bridgeData.StageName, parseInt(bridgeData.Individuals_Directly_Served__c), bridgeData.Bridge_Type__c.slice(0, bridgeData.Bridge_Type__c.length - 7)]


                for (let i = 0; i < bridgeCardDataTitles.length; i++) {
                    let listItem = document.createElement("p");
                    listItem.textContent = bridgeCardDataTitles[i] + ": " + bridgeCardDataText[i];
                    bridgeCardText.appendChild(listItem);
                }

                // Object.keys(bridgeData).forEach((key) => {
                //     let listItem = document.createElement("p");
                //     listItem.textContent = key + ": " + bridgeData[key];
                //     bridgeCardText.appendChild(listItem);
                // });

            });

            closeBridgeCardButton.addEventListener("click", function () {
                bridgeCard.style.transform = "translateX(0px)";
            });
            map.on("mousemove", (e) => {
                hoverHandler(e);
            });
            let hoveredCountry = "";
            let bridgeCountDiv = document.getElementById("bridge-data");
            function hoverHandler(latLon) {
                const features = map.queryRenderedFeatures(latLon.point);

                if (features[0]?.layer.id === "bridge-pin-layer") {
                    if (features[0].properties.Bridge_Name__c == undefined) {
                        bridgeCountDiv.textContent = "Unknown Bridge Name";
                    } else {
                        bridgeCountDiv.textContent = "Bridge Name: " + features[0].properties.Bridge_Name__c;
                    }
                } else if (features[0]?.layer.id === "bridge-blur-large-layer" || 
                           features[0]?.layer.id === "bridge-blur-small-layer" || 
                           features[0]?.layer.id === "bridge-point-layer") {
                    if (features[0].properties.Bridge_Name__c == undefined) {
                        bridgeCountDiv.textContent = "Unknown Bridge Name";
                    } else {
                        bridgeCountDiv.textContent = "Bridge Name: " + features[0].properties.Bridge_Name__c;
                    }
                } else if (features[0]?.layer.id === "country-mask") {
                    hoveredCountry = features[0].properties.name_en;
                    if (countryBridgeCount[hoveredCountry] == 1) {
                        bridgeCountDiv.textContent = hoveredCountry + " " + countryBridgeCount[hoveredCountry] + " bridge";
                    } else if (countryBridgeCount[hoveredCountry] > 1) {
                        bridgeCountDiv.textContent = hoveredCountry + " " + countryBridgeCount[hoveredCountry] + " bridges";
                    }
                } else {
                    bridgeCountDiv.textContent = "";
                }
            }
        })

        .catch((error) => console.error("custom error", error));
});


