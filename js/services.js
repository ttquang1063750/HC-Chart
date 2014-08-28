var HCChartServices  = (function () {
        function HCChartServices() {}
        /**
         * Return the single instance for the whole application
         */
        HCChartServices.instance = function () {
            if (!HCChartServices._instance)
                HCChartServices._instance = new HCChartServices();
            return HCChartServices._instance;
        };

        /**
         * Get value from an share data entry
         */
        HCChartServices.prototype.readFileFromButton = function (buttonSelector,onSuccess,onError) {
            var bar = $("."+buttonSelector),
                progress = bar.children();
            var reader;
            function errorHandler(evt) {
                switch(evt.target.error.code) {
                    case evt.target.error.NOT_FOUND_ERR:
                        alert('File Not Found!');
                        break;
                    case evt.target.error.NOT_READABLE_ERR:
                        alert('File is not readable');
                        break;
                    case evt.target.error.ABORT_ERR:
                        break;
                    default:
                        alert('An error occurred reading this file.');
                }
            }
            function updateProgress(evt) {
                // evt is an ProgressEvent.
                if (evt.lengthComputable) {
                    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
                    console.log(percentLoaded);
                    // Increase the progress bar length.
                    if (percentLoaded < 100) {
                        progress.css({
                            "width":percentLoaded + '%'
                        });
                        progress.text(percentLoaded + '%');
                    }
                }
            }

            function handleFileSelect(evt) {
                if(evt.target.files[0].type != "text/csv"){
                    onError(evt.target.files[0].type);
                    return;
                }
                reader = new FileReader();
                reader.onerror = errorHandler;
                reader.onprogress = updateProgress;
                reader.onabort = function(e) {
                    console.log('onabort',e);
                };
                reader.onloadstart = function(e) {
                    $(".file-input-wrapper").removeClass("active");
                    bar.prev().addClass("active");
                    bar.addClass("loading");
                };
                reader.onload = function(e) {
                    var result = d3.csv.parse(e.target.result);
                    progress.css({
                        "width":'100%'
                    });
                    progress.text("100%");
                    setTimeout(function(){
                        bar.removeClass("loading");
                        onSuccess(result);
                    },200);

                }

                // Read in the image file as a binary string.
                reader.readAsBinaryString(evt.target.files[0]);
            }

            document.getElementById(buttonSelector).addEventListener('change', handleFileSelect, false);
        };
        HCChartServices.prototype.ScatterPlot = function(data){
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                keys = _.keys(data[0]);
            var sepalLength = keys[0],
                sepalWidth = keys[1],
                species = keys[2];
            var x = d3.scale.linear()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.category10();

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = d3.select("scatter-plot").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            data.forEach(function(d) {
                d[sepalLength] = +d[sepalLength];
                d[sepalWidth] = +d[sepalWidth];
            });

            x.domain(d3.extent(data, function(d) { return d[sepalWidth]; })).nice();
            y.domain(d3.extent(data, function(d) { return d[sepalLength]; })).nice();

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Sepal Width (cm)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Sepal Length (cm)")

            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function(d) { return x(d[sepalWidth]); })
                .attr("cy", function(d) { return y(d[sepalLength]); })
                .style("fill", function(d) { return color(d[species]); });

            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });
        }



        HCChartServices.prototype.Bivariate = function(data){
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                keys = _.keys(data[0]);

            var parseDate = d3.time.format("%Y%m%d").parse;

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var area = d3.svg.area()
                .x(function(d) { return x(d[keys[0]]); })
                .y0(function(d) { return y(d[keys[2]]); })
                .y1(function(d) { return y(d[keys[1]]); });

            var svg = d3.select("bivariate").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                data.forEach(function(d) {
                    d[keys[0]] = parseDate(d[keys[0]]);
                    d[keys[2]] = +d[keys[2]];
                    d[keys[1]] = +d[keys[1]];
                });

                x.domain(d3.extent(data, function(d) { return d[keys[0]]; }));
                y.domain([d3.min(data, function(d) { return d[keys[2]]; }), d3.max(data, function(d) { return d[keys[1]]; })]);

                svg.append("path")
                    .datum(data)
                    .attr("class", "area")
                    .attr("d", area);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Temperature (ºF)");
        }

        HCChartServices.prototype.BarChart = function(data){
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                key1 = _.keys(data[0])[0],
                key2 = _.keys(data[0])[1];

            var formatPercent = d3.format(".0%");

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(formatPercent);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d[key2] + "</span>";
                });


            var svg = d3.select("bar-chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);

                x.domain(data.map(function(d) { return d[key1]; }));
                y.domain([0, d3.max(data, function(d) { return d[key2]; })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Frequency");

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d[key1]); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d[key2]); })
                    .attr("height", function(d) {
                        return height - y(d[key2]);
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            function type(d){
                d[key2] = +d[key2];
                return d;
            }

        }
        return HCChartServices;
    })();
