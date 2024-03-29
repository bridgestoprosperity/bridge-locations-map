export function addToolbar(map) {
    let mapStyleVar = "standard";
    let satButton = document.getElementById("sat-button");
    let standardButton = document.getElementById("standard-button");

    let circleLayers = ["bridge-point-layer", "bridge-blur-small-layer", "bridge-blur-large-layer"];

    satButton.addEventListener("click", function () {
        if (mapStyleVar === "standard") {
            map.setLayoutProperty("satellite-layer", "visibility", "visible");
            circleLayers.forEach((layer) => {
                map.setPaintProperty(layer, "circle-color", "#F5df4d");
            });
            map.setLayoutProperty("bridge-pin-layer", "icon-image", ["match", ["get", "StageName"], ["Confirmed"], "orange-confirmed", ["Under Construction"], "orange-construction", ["Complete"], "green-white-3px", "orange-white-3px"],)

            mapStyleVar = "satellite";
        }
    });
    standardButton.addEventListener("click", function () {
        if (mapStyleVar === "satellite") {
            map.setLayoutProperty("satellite-layer", "visibility", "none");
            circleLayers.forEach((layer) => {
                map.setPaintProperty(layer, "circle-color", "#3f8f50");
            });
            map.setLayoutProperty("bridge-pin-layer", "icon-image", ["match", ["get", "StageName"], ["Confirmed"], "orange-confirmed", ["Under Construction"], "orange-construction", ["Complete"], "green-2px", "orange-2px"],)
            mapStyleVar = "standard";
        }
    });

    let mapAspect = "2d";
    let twoDButton = document.getElementById("2d-button");
    let threeDButton = document.getElementById("3d-button");
    twoDButton.addEventListener("click", function () {
        if (mapAspect === "3d") {
            map.easeTo({ pitch: 0 });
            mapAspect = "2d";
        }
    });
    threeDButton.addEventListener("click", function () {
        if (mapAspect === "2d") {
            map.easeTo({ pitch: 70 });
            mapAspect = "3d";
        }
    });
}
