let currentStyle = 'sat'; 

const mapStyles = {
    "sat": "mapbox://styles/bridgestoprosperity/clsm6z32n006r01r66wneetw9",
    "standard": "mapbox://styles/bridgestoprosperity/clsm6tzex006c01q10jbu3ozg",
    "topo": "mapbox://styles/bridgestoprosperity/clsm73nnn006s01r694ju6arf",
    "simple": "mapbox://styles/bridgestoprosperity/clsm7azgy006d01q156wocy1q"
};
function addPointLayer(map) {
    map.addLayer({
        id: "points",
        type: "circle",
        source: "points-source",
        paint: {
            "circle-radius": 10,
            "circle-stroke-width": 2,
            "circle-color": "#f51f1f",
            "circle-stroke-color": "#ba0101",
        }
    });
}
// Variable to keep track of the current style

function changeMapStyle(styleValue) {
    // Check if the selected style is different from the current style
    if (currentStyle !== styleValue) {
        map.setStyle(mapStyles[styleValue]);
        // Update the current style
        currentStyle = styleValue;
        // Wait for the style to fully load before adding the point layer
        map.once('style.load', function() {
            // Ensure the source and layer are added back
            addSourceAndLayer();
        });
    }
}



function addSourceAndLayer() {
    if (!map.getSource("points-source")) {
        map.addSource("points-source", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [30.059877, 0.735176]
                        },
                    }
                ]
            }
        });
    }
    addPointLayer(map, [30.059877, 0.735176]);
}





mapboxgl.accessToken = "pk.eyJ1IjoiYnJpZGdlc3RvcHJvc3Blcml0eSIsImEiOiJjajRpd2sxeGQwMjU5MnhxajJkNzZnODZtIn0.UrOwxq6A1Zl2yvwzYxBudQ";
const map = new mapboxgl.Map({
    style: mapStyles.sat,
    container: "map", 
    center: [30.058521, 0.736345], 
    zoom: 16.41, 
    pitch: -21.7,
    bearing: 71,
    hash: true
});

map.on("load", addSourceAndLayer);

document.getElementById("map-menu").addEventListener("click", function(e) {
    e.preventDefault();
    if (e.target.classList.contains('dropdown-item')) {
        const styleValue = e.target.getAttribute('data-value');
        changeMapStyle(styleValue);
    }
});

// Animation Code
document.getElementById("animate-button").addEventListener("click", function(e) {
    e.preventDefault();
    // jump map to 16.99/0.719129/30.065654/-21.7/71
    map.jumpTo({
        center: [30.065654, 0.719129],
        zoom: 16.99,
        pitch: 71,
        bearing: -21.7
        });
    map.flyTo({
        center: [30.051756, 0.754706],
        zoom: 16.99,
        pitch: 73,
        bearing: 160,
        speed: 0.1,
        curve: 0.5
    });
});