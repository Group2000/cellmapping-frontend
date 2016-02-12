d3.custom = {};

d3.custom.barChart = function module() {
    var margin = {top: 10, right: 100, bottom: 10, left: 10},
        width = 550,
        height = 500,
        gap = 0,
        ease = 'cubic-in-out',
        duration=500;
        options={
            showxAxis:false,
            colorscheme:'white',
            transitionDuration:500
        };
    var svg;
    var mean;

    var dispatch = d3.dispatch('customHover');
    function exports(_selection) {

        

        _selection.each(function(_data) {
            if(_data){
                transitionDuration=options.transitionDuration;
                mean=d3.round(d3.mean(_data,function(d){return typeof d.value!=='undefined' ? d.value : d;}));
                var colorclass='chart' + (options.colorscheme || 'white');
                var interval="dag";
                switch( _data[0].interval){
                    case "day":
                        interval='dag';
                        break;
                    case "hour":
                        interval='uur';
                        break;
                    case "minute":
                        interval='minuut';
                        break;
                    case "second":
                        interval='seconde';
                        break;
                }
                //var interval=(_data[0].interval && _data[0].interval=='hour')? 'uur':'dag';
                var chartW = width - margin.left - margin.right,
                    chartH = height - margin.top - margin.bottom;
                if(options.showxAxis){chartH=chartH-10}
                var x1 = d3.scale.ordinal()
                    .domain(_data.map(function(d, i){ return i; }))
                    .rangeRoundBands([0, chartW], .1);
                var x2 = d3.time.scale()
                    // .domain(_data.map(function(d, i){ return d; }));
                    .range([0,chartW]);

                var y1 = d3.scale.linear()
                    .domain([0, d3.max(_data, function(d, i){ 
                        return typeof d.value!=='undefined' ? d.value : d;
                        
                    })])
                    .range([chartH, 0]);


                x2.domain(d3.extent(_data,function(d){return d.date}));

                var customTimeFormat = d3.time.format.multi([
                  [".%L", function(d) { return d.getMilliseconds();}],
                  [":%S", function(d) { return d.getSeconds(); }],
                  ["%H:%M", function(d) { return d.getMinutes(); }],
                  ["%H:00", function(d) { return d.getHours(); }],
                  ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
                  ["%b %d", function(d) { return d.getDate() != 1; }],
                  ["%B", function(d) { return d.getMonth(); }],
                  ["%Y", function() { return true; }]
                ]);


                var xAxis = d3.svg.axis()
                    .scale(x2)
                    .orient('bottom')
                    .tickFormat(customTimeFormat);


                var yAxis = d3.svg.axis()
                    .scale(y1)
                    .orient('left');

                var barW = chartW / _data.length;
     
                if(!svg) {
                    //basic init for graph, options not available
                    svg = d3.select(this)
                        .append('svg')
                        .classed('chart', true);
                    var container = svg.append('g').classed('container-group', true);
                    container.append('g').classed('chart-group', true);
                    container.append('g').classed('x-axis-group axis', true);
                    container.append('g').classed('y-axis-group axis', true);
                    var info=svg.append('text')
                        .classed('graphinfo ' +colorclass ,true)
                        .attr('x',(0))
                        .attr('y',(0))
                        .text(mean);
                     var info=svg.append('text')
                        .classed('graphtext ' +colorclass,true)
                        .attr('x',(0))
                        .attr('y',(0))
                     var info=svg.append('text')
                        .classed('graphtextHour ' +colorclass,true)
                        .attr('x',(0))
                        .attr('y',(0))
                }

                //update on data
                svg.selectAll('.graphinfo')     //select by class name
                    .attr('x',(width-margin.right+margin.left))
                    .attr('y',(height/3))
                    .text(mean)
                    .attr('class',('graphinfo ' +colorclass));
                svg.selectAll('.graphtext')     //select by class name
                    .attr('x',(width-margin.right+margin.left))
                    .attr('y',(height/3 +20))
                    .text('gem p/'+interval)
                    .attr('class',('graphtext ' +colorclass));
                svg.selectAll('.graphtextHour')     //select by class name
                    .attr('x',(width-margin.right+margin.left))
                    .attr('y',(height/3 +40))
                    .text('')
                    .attr('class',('graphtextHour ' +colorclass));

                svg.transition().duration(transitionDuration).attr({width: width, height: height})
                svg.select('.container-group')
                    .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});

                if(options.showxAxis)
                svg.select('.x-axis-group.axis')
                    .attr({transform: 'translate(0,' + (chartH) + ')'})
                    .call(xAxis);

                // svg.select('.y-axis-group.axis')
                //     .transition()
                //     .duration(duration)
                //     .ease(ease)
                //     .call(yAxis);

                var gapSize = x1.rangeBand() / 100 * gap;
                var barW = x1.rangeBand() - gapSize;
                var bars = svg.select('.chart-group')
                    .selectAll('.bar')
                    .data(_data);
                
                bars.enter().append('rect')
                    //.classed('bar', true)
                    .attr({x: chartW,
                        width: barW,
                        y: function(d, i) { 
                            //if(d.value){return y1(d.value);}
                            return y1(typeof d.value!=='undefined' ? d.value : d); 
                        },
                        height: function(d, i) { 
                            //if(d.value){return  chartH - y1(d.value);}
                            return chartH - y1(typeof d.value!=='undefined' ? d.value : d); 
                        },
                        class: function(d){ return 'bar'}
                    })
                    //.on('mouseover', dispatch.customHover);
                    .on('mouseover', function(d,i){
                        dispatch.customHover;
                        var da=new Date();
                        if(d.date){
                            da=new Date(d.date)
                        }
                        else{
                            da.setDate(da.getDate()+(i-13));
                        }
                        if(interval==='uur'){
                            var dt=da.getHours()+":00:00";
                        }
                        if(interval==='minuut'){
                            var dt=da.getHours()+":" + da.getMinutes()+":00";
                        }
                         if(interval==='seconde'){
                            var dt=da.getHours()+":" + da.getMinutes()+":" + da.getSeconds();
                        }
                        
                        var ds=da.getDate()+"-"+da.getMonth()+"-"+da.getFullYear();    
                        svg.selectAll('.graphinfo')     //select by class name
                        .text(typeof d.value!=='undefined' ? d.value : d);
                        
                        svg.selectAll('.graphtext')     //select by class name
                        .text(ds);
                        svg.selectAll('.graphtextHour')     //select by class name
                        .text(dt);
                    })
                    .on('mouseout', function(){
                        svg.selectAll('.graphinfo')     //select by class name
                        .text(mean);//d3.round(d3.mean(_data,function(d){return typeof d.value!=='undefined' ? d.value : d})));
                         svg.selectAll('.graphtext')     //select by class name
                        .text('gem. p/' + interval);
                        svg.selectAll('.graphtextHour')     //select by class name
                        .text('');
                    })
                
                

                bars.transition()
                    .duration(transitionDuration)
                    .ease(ease)
                    .attr({
                        width: barW,
                        x: function(d, i) { return x1(i) + gapSize/2; },
                        y: function(d, i) {
                            return y1(typeof d.value!=='undefined' ? d.value : d); 
                        },
                        height: function(d, i) { 
                            return chartH - y1(typeof d.value!=='undefined' ? d.value : d); 
                        },
                        class: function(d){ 
                            return 'bar ' + colorclass
                        }
                    });
                bars.exit().transition().style({opacity: 0}).remove();

            }
        });
    }

    exports.width = function(_x) {
        if (!arguments.length) return width;
        width = parseInt(_x);
        return this;
    };
    exports.height = function(_x) {
        if (!arguments.length) return height;
        height = parseInt(_x);
        duration = 0;
        return this;
    };
    exports.gap = function(_x) {
        if (!arguments.length) return gap;
        gap = _x;
        return this;
    };
    exports.ease = function(_x) {
        if (!arguments.length) return ease;
        ease = _x;
        return this;
    };
    exports.options = function(_x) {

        if (!arguments.length) return options;
        options = _x;
        return this;
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;
};

//------------------------------------------------------------------------------







d3.custom.timeGraph = function module() {
    var margin = {top: 10, right: 100, bottom: 10, left: 30},
        width = 500,
        height = 500,
        duration=500;
        options={
            showxAxis:true,
            showyAxis:true,
            colorscheme:'white',
            transitionDuration:500
        };
    var svg;
    

    var dispatch = d3.dispatch('customHover');

    function exports(_selection) {
        var customTimeFormat = d3.time.format.multi([
          [".%L", function(d) { return d.getMilliseconds();}],
          [":%S", function(d) { return d.getSeconds(); }],
          ["%H:%M", function(d) { return d.getMinutes(); }],
          ["%H:00", function(d) { return d.getHours(); }],
          ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
          ["%b %d", function(d) { return d.getDate() != 1; }],
          ["%B", function(d) { return d.getMonth(); }],
          ["%Y", function() { return true; }]
        ]);

        var chartW = width - margin.left - margin.right,
            chartH = height - margin.top - margin.bottom;
        if(options.showxAxis){chartH=chartH-10}
        var colorclass='chart' + (options.colorscheme || 'white');


        var x1,c2,y1,xScale,yScale,interval,mean,lineFunc;



        function setChartParams(_data){

            x1 = d3.scale.ordinal()
                .domain(_data.map(function(d, i){ return i; }))
                .rangeRoundBands([0, chartW], .1);
            x2 = d3.time.scale()
                // .domain(_data.map(function(d, i){ return d; }));
                .range([0,chartW]);
            x2.domain(d3.extent(_data,function(d){return d.date}));
            y1 = d3.scale.linear()
                .domain([0, d3.max(_data, function(d, i){ 
                    return typeof d.value!=='undefined' ? d.value : d;
                    
                })])
                .range([chartH, 0]);

    //new
           xScale = d3.scale.linear()
               .domain([_data[0].date, _data[_data.length-1].date])
               .range([0, chartW]);

           yScale = d3.scale.linear()
               .domain([0, d3.max(_data, function (d) {
                   return d.value;
               })])
               .range([chartH, 0]);


            lineFunc = d3.svg.line()
               .x(function (d) {
                   return xScale(d.date);
               })
               .y(function (d) {
                   return yScale(d.value);
               })
               .interpolate("basis");


            mean=d3.round(d3.mean(_data,function(d){return typeof d.value!=='undefined' ? d.value : d;}));
                
            interval="dag";
            switch( _data[0].interval){
                case "day":
                    interval='dag';
                    break;
                case "hour":
                    interval='uur';
                    break;
                case "minute":
                    interval='minuut';
                    break;
                case "second":
                    interval='seconde';
                    break;
            }
        }

        
        _selection.each(function(_data) {

            
            if(_data){
                setChartParams(_data);

                if(!svg) {
                    //basic init for graph, options not available
                    svg = d3.select(this)
                        .append('svg')
                        .classed('linechart', true);
                    var container = svg.append('g').classed('container-group', true);
                    container.append('g').classed('chart-group', true);
                    container.append('g').classed('x-axis-group axis', true);
                    container.append('g').classed('y-axis-group axis', true);
                }

                var xAxis = d3.svg.axis()
                    .scale(x2)
                    .orient('bottom')
                    .tickFormat(customTimeFormat);


                var yAxis = d3.svg.axis()
                    .scale(y1)
                    .orient('left')
                    .ticks(5);

                //clear lines
                console.log('clear');
                d3.selectAll("path.line").remove();
                //set width,height of graph

                svg.transition().duration(transitionDuration).attr({width: width, height: height})

                svg.select('.container-group')
                    .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});

               
                svg.select('.x-axis-group.axis')
                    .attr({transform: 'translate(0,' + (chartH) + ')'})
                    .call(xAxis);
           
                svg.select('.y-axis-group.axis')
                    .transition()
                    .call(yAxis);
               

                var chart= svg.select('.chart-group')
                    .selectAll('.dpoint')
                    .data(_data);
                console.log('draw');
                chart.enter().append('svg:path')
                    .attr("d",lineFunc(_data))
                    .attr("class","line");
                
                chart.transition()
                    .attr("d",lineFunc(_data))
                    .attr("class","line");
                //hart.exit().transition().style({opacity: 0}).remove();

            }
        });
    }

    exports.width = function(_x) {
        if (!arguments.length) return width;
        width = parseInt(_x);
        return this;
    };
    exports.height = function(_x) {
        if (!arguments.length) return height;
        height = parseInt(_x);
        duration = 0;
        return this;
    };
    exports.options = function(_x) {
        if (!arguments.length) return options;
        options = _x;
        return this;
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;
};


