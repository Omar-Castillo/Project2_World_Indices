((win) => {
    const constants = {
        mapLink: 'data/world_map.json',
        datasetLink: 'public/data/population_data.csv',
        root: '#chart',

        width: 1360,
        height: 750,
        margins: {
            top: 20,
            bottom: 40,
            right: 100,
            left: 100
        },
    
        startYear: 1960,
        endYear: 2018,
        defaultYear: 2017,
        numCountries: 25,
        populationThresholds: [
            5000000,
            50000000,
            100000000,
            1354000000
        ],

        legend: {
            xpos: 250,
            ypos: 750 * 0.65
        },

        titleY: 20,
        sliderY: 60,
        sidebarY: 100,
        mapChartX: 50,
        mapChartY: 50,
        mapScale: 170,

        colors: ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'] // light -> dark
    };

    constants.years = _.range(constants.startYear, constants.endYear + 1);
    constants.widthMargins = constants.width - constants.margins.left - constants.margins.right;
    constants.heightMargins = constants.height - constants.margins.top - constants.margins.bottom;

    win.chart = {};
    win.chart.constants = constants;

})(window);