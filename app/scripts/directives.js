'use strict';
angular.module('Moodtracker.directives', ['d3'])

//Today's Data bar chart directive
.directive('d3Bars', ['$window', '$timeout', 'd3Service',
    function($window, $timeout, d3Service) {
        return {
            restrict: 'A',
            scope: {
                data: '=',
                label: '@',
                onClick: '&'
            },
            link: function(scope, ele, attrs) {

                d3Service.d3().then(function(d3) {

                    var renderTimeout;
                    var margin = parseInt(attrs.margin) || 20,
                        barHeight = parseInt(attrs.barHeight) || 20,
                        barPadding = parseInt(attrs.barPadding) || 5;

                    var svg = d3.select(ele[0])
                        .append('svg')
                        .style('width', '100%');

                    $window.onresize = function() {
                        scope.$apply();
                    };

                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.data);
                    });

                    // watch for data changes and re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function(data) {
                        svg.selectAll('*').remove();

                        if (!data) return;
                        if (renderTimeout) clearTimeout(renderTimeout);

                        renderTimeout = $timeout(function() {
                            var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                                height = scope.data.length * (barHeight + barPadding),
                                color = d3.scale.category20(),
                                xScale = d3.scale.linear()
                                .domain([0, d3.max(data, function(d) {
                                    return d.scale;
                                })])
                                .range([0, width]);

                            svg.attr('height', height);

                            svg.selectAll('rect')
                                .data(data)
                                .enter()
                                .append('rect')
                                .on('click', function(d, i) {
                                    return scope.onClick({
                                        item: d
                                    });
                                })
                                .attr('height', barHeight)
                                .attr('width', 140)
                                .attr('x', Math.round(margin / 2))
                                .attr('y', function(d, i) {
                                    return i * (barHeight + barPadding);
                                })
                                .attr('fill', function(d) {
                                    return d.color;
                                })
                                .on('click', function(d, i) {
                                    return scope.onClick({
                                        item: d
                                    });
                                })
                                .transition()
                                .duration(1000)
                                .attr('width', function(d) {
                                    return xScale(d.scale);
                                });
                            svg.selectAll('text')
                                .data(data)
                                .enter()
                                .append('text')
                                .attr('fill', '#fff')
                                .attr('y', function(d, i) {
                                    return i * (barHeight + barPadding) + 15;
                                })
                                .attr('x', 15)
                                .text(function(d) {
                                    return d.name + ": " + d.mood + " (Factor: " + d.scale + ")";
                                });
                        }, 200);
                    };
                });
            }
        }
    }
])

.directive('d3Line', ['$window', '$timeout', 'd3Service',
            function($window, $timeout, d3Service) {
                return {
                    restrict: 'A',
                    scope: {
                        data: '=',
                        label: '@',
                        onClick: '&'
                    },
                    link: function(scope, ele, attrs) {

                        d3Service.d3().then(function(d3) {

                                var renderTimeout;

                                var margin = {
                                        top: 20,
                                        right: 20,
                                        bottom: 30,
                                        left: 50
                                    },
                                    width = 960 - margin.left - margin.right,
                                    height = 500 - margin.top - margin.bottom;

                                var svg = d3.select(ele[0])
                                    .append('svg')
                                    .attr("width", width + margin.left + margin.right)
                                    .attr("height", height + margin.top + margin.bottom)
                                    .append("g")
                                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                $window.onresize = function() {
                                    scope.$apply();
                                };

                                var parseDate = d3.time.format("%d-%b-%y").parse;


                                

                                scope.$watch(function() {
                                    return angular.element($window)[0].innerWidth;
                                }, function() {

                                    scope.render(scope.data);
                                });

                                // watch for data changes and re-render
                                scope.$watch('data', function(newVals, oldVals) {
                                   
                                    return scope.render(newVals);
                                
                                }, true);

                                    scope.render = function(data) {
                                        svg.selectAll('*').remove();

                                        if (!data) return;
                                        if (renderTimeout) clearTimeout(renderTimeout);

                                        renderTimeout = $timeout(function() {

                                            // Beginning of pasted code
                                          

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
                                            var line = d3.svg.line()
                                                .x(function(d) {
                                                    return x(d.date);
                                                })
                                                .y(function(d) {
                                                    return y(d.scale);
                                                });

                                            x.domain(d3.extent(data, function(d) {
                                                return d.date;
                                            }));
                                            y.domain(d3.extent(data, function(d) {
                                                return d.scale;
                                            }));
                                            svg.append("g")
                                                .attr("class", "x axis")
                                                .attr("transform", "translate(0," + height + ")")
                                                .call(xAxis)


                                            svg.append("g")
                                                .attr("class", "y axis")
                                                .call(yAxis)
                                                .append("text")
                                                .attr("transform", "rotate(-90)")
                                                .attr("y", 6)
                                                .attr("dy", ".71em")
                                                .style("text-anchor", "end")
                                                .text("Scale");

                                            svg.append("path")
                                                .datum(data)
                                                .attr("class", "line")
                                                .attr("d", line());

                                            //END OF RENDER TIMEOUT
                                        }, 200);
                                    }
                                });
                            }
                        }
                    }
                ])



            .directive('twitter', [
                function() {
                    return {
                        link: function(scope, element, attr) {
                            setTimeout(function() {
                                twttr.widgetscreateShareButton(
                                    attr.url,
                                    element[0],
                                    function(el) {}, {
                                        count: 'none',
                                        text: attr.text
                                    }
                                );
                            });
                        }
                    }
                }
            ]);