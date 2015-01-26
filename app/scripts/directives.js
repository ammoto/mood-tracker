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
                                        return d.score;
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
                                        return xScale(d.score);
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
                                        return d.name + ": " + d.mood + " (Factor: " + d.score + ")";
                                    });
                            }, 200);
                        };
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
                        twttr.widgets.createShareButton(
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