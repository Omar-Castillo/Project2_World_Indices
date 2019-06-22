(async (win) => {
    const constants = win.chart.constants;
    const utils = win.chart.utils;

    const mapUtils = {};

    // map projection
    const projection = d3.geoAitoff()
        .translate([
            constants.width / 2 + constants.mapChartX,
            constants.height / 2 + constants.mapChartY
        ])
        .scale(constants.mapScale);

    // geo path function to create the map
    const path = d3.geoPath(projection);

    let countryFeatures;

    // draw the map
    mapUtils.drawMap = (svg, worldMap) => {
        const topoFeatures = topojson.feature(
            worldMap,
            worldMap.objects.ne_110m_admin_0_countries
        ).features;

        const topoMesh = topojson.mesh(
            worldMap,
            worldMap.objects.ne_110m_admin_0_countries,
            (a, b) => (a !== b)
        );

        const countries = svg.append('g')
            .attr('class', 'world-map');

        // land mass
        countryFeatures = countries.append('g')
            .attr('class', 'countries')
            .selectAll('path')
            .data(topoFeatures)
            .enter().append('path')
            .attr('d', path)
            .attr('class', d => {
                const country_code = d.properties.ADM0_A3_IS;
                return `country ${country_code}`;
            });

        // borders
        countries.append('path')
            .attr('class', 'country-borders')
            .attr('d', path(topoMesh) );
    };

    // update the map colors based on new data
    mapUtils.updateMap = (data, colorScale) => {
        countryFeatures.style('fill', d => {
            const country_code = d.properties.ADM0_A3_IS;
            let country = data.filter(k => k.country_code === country_code)[0];
            if (country_code === 'KOS') {
                country = data.filter(k => k.country_code === 'XKX')[0];
            }
            return !country || country.value === 0 ? '#000' : colorScale(country.value);
        });
    };

    win.chart.mapUtils = mapUtils;
})(window);