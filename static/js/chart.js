(async (win) => {
    const constants = win.chart.constants;
    const utils = win.chart.utils;
    const mapUtils = win.chart.mapUtils;
    const sidebarUtils = win.chart.sidebar;

    const root = constants.root;
    const margins = constants.margins;

    // initially create the chart
    const initChart = async (flask) => {
        // get the data
        let worldMap;
        let populationData;
        if(flask) {
            worldMap = await d3.json(constants.mapLink);
            populationData = await d3.json('/data');
            populationData = utils.parsePopJsonData(populationData);
        } else {
            // reading data from csv file
            worldMap = await d3.json('public/' + constants.mapLink);
            populationData = await d3.csv(constants.datasetLink, utils.parsePopData);
        }

        // create the svg
        const svg = d3.select(root)
            .append('svg')
            .attr('width', constants.width)
            .attr('height', constants.height)
            .append('g')
                .attr('transform', `translate(${margins.left}, ${margins.top})`);

        const { titleYear } = utils.createTitle(svg);

        const { colorScale, xScale, yScale } = utils.createScale();

        const maxPopulationValue = utils.getMaxPopulation(populationData);
        utils.addLegend(svg, colorScale, maxPopulationValue);

        utils.createYearSlider(svg);
        mapUtils.drawMap(svg, worldMap);
        sidebarUtils.drawChart(svg);

        utils.initStream();

        // subscribe to year selected event stream
        const subscription = utils.eventStream.subscribe(
            (year) => {
                updateChart({
                    year: +year,
                    populationData,
                    svg, colorScale, xScale, yScale, titleYear
                });
            },
            (err) => { console.log('Error: ' + err); },
            () => { console.log('Completed') }
        );

        // update the chart once in the beginning
        utils.eventStream.next(constants.defaultYear);
    };

    const updateChart = ({ year, svg, colorScale, xScale, yScale, titleYear, populationData }) => {
        const data = utils.filterDataByYear(populationData, year);
        const sorted = _.sortBy(data, d => d.value).reverse()
            .slice(0, constants.numCountries)
            .reverse();

        xScale.domain(d3.extent(data, d => d.value));
        yScale.domain(sorted.map(d => d.country_code));

        utils.updateTitleYear(titleYear, year);
        mapUtils.updateMap(data, colorScale);
        sidebarUtils.updateChart({ data: sorted, colorScale, xScale, yScale });
    };

    // intitialize the chart
    win.chart.initChart = initChart;

})(window);