(async (win) => {
    const constants = win.chart.constants;
    const margins = constants.margins;

    const utils = {};

    utils.valueFormat = d3.format(',.0f');
    utils.yearFormat = d3.timeFormat('%Y');

    // initialize year stream
    utils.initStream = () => {
        utils.eventStream = new rxjs.Subject();
    };

    // get the maximum population value of data. For legend
    utils.getMaxPopulation = (populationData) => {
        const allValues = _.chain(populationData)
            .map(d => d.years.map(k => k.value))
            .flatten()
            .value();

        return d3.max(allValues);
    };

    // parse the population data
    utils.parsePopData = row => {
        const keys = _.keys(row);
        const newObj = {
            country_code: row['Country Code'],
            country_name: row['Country Name'],
            years: []
        };
        constants.years.forEach(year => {
            const key = _.filter(keys, key => key.indexOf(year) !== -1)[0];
            const temp = {
                year,
                value: +row[key]
            };
            newObj.years.push(temp);
        });
        return newObj;
    };

    // parse the population data. (json from server)
    utils.parsePopJsonData = data => {
        return data.map(row => {
            const keys = _.keys(row);
            const newObj = {
                country_code: row['country_code'],
                country_name: row['country_name'],
                years: []
            };
            constants.years.forEach(year => {
                const key = _.filter(keys, key => key.indexOf(year) !== -1)[0];
                const temp = {
                    year,
                    value: +row[key]
                };
                newObj.years.push(temp);
            });
            return newObj;
        });
    };

    // filter the data by year
    utils.filterDataByYear = (data, year) => {
        return _.map(data, d => {
            const yearObj = _.filter(d.years, k => k.year === year)[0];
            return {
                country_code: d.country_code,
                country_name: d.country_name,
                year: yearObj.year,
                value: yearObj.value || 0
            };
        })
        .sort( (a, b) => a.value - b.value);
    };

    // create the title
    utils.createTitle = (svg) => {
        const chartTitle = svg.append('g')
            .attr('class', 'chart-title')
            .attr('transform', `translate(0, ${constants.titleY})`);
            // .append('text');

        const mainTitle = chartTitle.append('text');

        chartTitle.append('text')
            .attr('class', 'sub-title')
            .attr('y', 20)
            .text('Largest Countries by Population (millions)')

        mainTitle.append('tspan')
            .attr('class', 'title-population')
            .text('Population');

        const titleYear = mainTitle.append('tspan')
            .attr('class', 'title-year')
            .attr('dx', 10)
            .text(constants.defaultYear);

        return { titleYear };
    };

    // update the title with currently selected year
    utils.updateTitleYear = (titleYear, year) => {
        titleYear.text(year);
    };

    // create the year slider
    utils.createYearSlider = (svg) => {
        const dataTime = constants.years.map(function (d) {
            return new Date(d, 0, 1);
        });

        const sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(constants.width - margins.left - margins.right)
            .tickFormat(utils.yearFormat)
            // .tickValues(dataTime)
            .ticks(10)
            .default(new Date(constants.defaultYear, 0, 1))
            .on('onchange', val => {
                const yearSelected = +utils.yearFormat(sliderTime.value());
                utils.eventStream.next(yearSelected);
            });

        svg.append('g')
            .attr('class', 'year-slider')
            .attr('transform', `translate(0, ${constants.sliderY})`)
            .call(sliderTime);
    };

    // create the x, y and color scales
    utils.createScale = () => {
        const colorScale = d3.scaleThreshold()
            .range(constants.colors)
            .domain(constants.populationThresholds);

        const xScale = d3.scaleLinear()
            .range([0, constants.widthMargins]);

        const yScale = d3.scaleBand()
            .rangeRound([constants.height - margins.bottom - constants.sidebarY, 0]);

        return {
            colorScale,
            xScale,
            yScale
        };
    };

    // add the legend
    utils.addLegend = (svg, colorScale, maxPopulationValue) => {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${constants.legend.xpos}, ${constants.legend.ypos})`)

        const heading = legend.append('text')

        heading.append('tspan')
            .attr('x', 0)
            .text('Population');

        heading.append('tspan')
            .attr('x', 0)
            .attr('dy', 20)
            .text('(millions)');

        const legendGroup = legend
            .append('g')
            .attr('class', 'legend-rows')
            .attr('transform', `translate(0, 30)`)
            .selectAll('.legend-row')
            .data(colorScale.range())
            .enter().append('g')
            .attr('class', 'legend-row')
            .attr('transform', (d, i) => `translate(0, ${i * 35})`);

        legendGroup.append('rect')
            .attr('width', 30)
            .attr('height', 30)
            .style('fill', d => d);

        legendGroup.append('text')
            .attr('x', 35)
            .style('fill', d => d)
            .attr('y', 15)
            .style('font-size', 12)
            .text( (d, i) => {
                let value = colorScale.invertExtent(d);
                value = value.map(
                    k => k ? utils.valueFormat(k / 1000000) : 
                        (i === 0 ? 0 : utils.valueFormat(maxPopulationValue / 1000000)  )
                    )
                    .join(' - ');
                return value;
            });
    };

    win.chart.utils = utils;
})(window);