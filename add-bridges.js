export function addBridgeLayers(mapType, map) {
    if (mapType == "standard") {
        map.addLayer(
            {
                source: "bridges-source",
                id: "bridge-point-layer",
                type: "circle",
                paint: {
                    "circle-color": "#3f8f50",
                    "circle-radius": ["interpolate", ["exponential", 1.56], ["zoom"], 0, 0.5, 6.5, 3],
                    "circle-opacity": 0.5,
                },
                maxzoom: 6.5,
            },
            "bridge-rail-tracks"
        );
        map.addLayer(
            {
                source: "bridges-source",
                id: "bridge-blur-small-layer",
                type: "circle",
                paint: {
                    "circle-color": "#3f8f50",
                    "circle-radius": ["interpolate", ["exponential", 1.56], ["zoom"], 0, 2, 7, 5],
                    "circle-blur": 1,
                    "circle-opacity": 0.5,
                },
                layout: {
                    visibility: "none",
                },
                layout: {},
                maxzoom: 6.5,
            },
            "bridge-rail-tracks"
        );
        map.addLayer(
            {
                source: "bridges-source",
                id: "bridge-blur-large-layer",
                type: "circle",
                paint: {
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 5, 6.5, 10],
                    "circle-color": "#3f8f50",
                    "circle-blur": 3,
                    "circle-opacity": 0.5,
                },
                maxzoom: 6.5,
                layout: {
                    visibility: "none",
                },
                layout: {},
            },
            "bridge-rail-tracks"
        );
        map.addLayer(
            {
                source: "bridges-source",
                id: "pin-shadow-layer",
                type: "circle",
                paint: {
                    "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, 10, 22, 40],
                    "circle-blur": 3,
                    "circle-translate": ["interpolate", ["linear"], ["zoom"], 7, ["literal", [0, 4]], 22, ["literal", [0, 55]]],
                    "circle-translate-anchor": "viewport",
                    "circle-pitch-scale": "viewport",
                    "circle-pitch-alignment": "map",
                },
                minzoom: 6.5,
            },
            "bridge-rail-tracks"
        );
        map.addLayer(
            {
                source: "bridges-source",
                id: "bridge-pin-layer",
                type: "symbol",
                paint: {},
                layout: {
                    "icon-image": ["match", ["get", "StageName"], ["Confirmed"], "orange-confirmed", ["Under Construction"], "orange-construction", ["Complete"], "green-2px", "orange-2px"],
                    "icon-size": ["interpolate", ["linear"], ["zoom"], 7, 0.1, 22, 1],
                    "icon-allow-overlap": true,
                    "symbol-z-elevate": true,
                },
                minzoom: 6.5,
            },
            "bridge-rail-tracks"
        );
    } else {
        console.log("Map type not recognized");
    }
}