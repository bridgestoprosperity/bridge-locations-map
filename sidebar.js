let countriesByRegion = {
    Africa: [
        ["Uganda", [32.2903, 1.3733]],
        ["Rwanda", [29.8739, -1.9403]],
        ["Ethiopia", [40.4897, 9.145]],
        ["Swaziland", [31.4659, -26.5225]],
        ["Kenya", [37.9062, -0.0236]],
        ["Mozambique", [35.529562, -18.665695]],
        ["Sudan", [34.170558, 9.939442]],
        ["Zambia", [27.849332, -13.133897]],
    ],
    "South America": [
        ["Bolivia", [-63.5887, -16.2902]],
        ["Colombia", [-74.2973, 4.5709]],
        ["Peru", [-75.015152, -9.189967]],
    ],
    "Central America": [
        ["Panama", [-80.7821, 8.538]],
        ["Nicaragua", [-85.207229, 12.865416]],
        ["El Salvador", [-88.89653, 13.794185]],
        ["Guatemala", [-90.230759, 15.783471]],
        ["Haiti", [-72.285215, 18.971187]],
        ["Honduras", [-86.2419, 15.2]],
    ],
    "North America": [["United States", [-83.3925274, 35.8296429]]],
    Asia: [
        ["Nepal", [84.124, 28.3949]],
        ["Philippines", [121.774, 12.8797]],
        ["Timor-Leste", [125.727539, -8.874217]],
        ["Indonesia", [104.967408, -5.333297]],
    ],
};

export function addSidebar(map) {

    let sidebar = document.getElementById("side-bar");
    Object.keys(countriesByRegion).forEach((region) => {
        countriesByRegion[region].forEach((country) => {
            // country[0] is the country name, country[1] is the coordinates array [latitude, longitude]
            let countryName = country[0];
            let countryCoordinates = country[1];

            // Fetch and setup the country SVG and text
            fetch(`/bridge-locations-map/countries/${countryName}.svg`)
                .then((response) => response.text())
                .then((svgData) => {
                    let countryContainer = document.createElement("div");
                    countryContainer.className = "country";
                    countryContainer.dataset.name = countryName; // Store the country name in a data attribute

                    let countryIconDiv = document.createElement("div");
                    countryIconDiv.className = "country-icon";
                    countryIconDiv.innerHTML = svgData;

                    let countryTextDiv = document.createElement("div");
                    countryTextDiv.className = "country-text";
                    countryTextDiv.textContent = countryName;

                    countryContainer.appendChild(countryIconDiv);
                    countryContainer.appendChild(countryTextDiv);

                    sidebar.appendChild(countryContainer);

                    // Attach the click event listener to the whole container
                    countryContainer.addEventListener("click", function () {
                        map.flyTo({
                            center: countryCoordinates, // Use the coordinates stored in the data attribute
                            zoom: 5,
                        });
                    });
                })
                .catch((error) => console.error("Error fetching SVG:", error));
        });
    });
    // when sideber-button is clicked slide the sidebar in and out
    let sidebarButton = document.getElementById("sidebar-button");
    let sidebarOpen = true;
    sidebarButton.addEventListener("click", function () {
        if (sidebarOpen) {
            // sidebar.style.left = "-120px";
            sidebar.style.transform = "translateX(-120px)";
            sidebarOpen = false;
        } else {
            sidebar.style.transform = "translateX(0px)";
            sidebarOpen = true;
        }
    });
}
