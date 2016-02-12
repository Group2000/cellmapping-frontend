//linegraph.js
angular.module('celllogger')
.directive('timeLineGraph',function(){
	function link(scope, element, attr){
		 
		var margin = {top: 20, right: 20, bottom: 80, left: 50},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%d-%b-%y").parse;
 		var pathClass="path";
		var chartData=[];
		var dateRange=[];
		var initialized=false;

		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .tickFormat(d3.time.format('%d %b'))
		    .orient("bottom");

		var formatyAxis=d3.format('.0f');
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .tickFormat(formatyAxis)
		    .ticks(5);

		var line = d3.svg.line()
		    .x(function(d) { 
		    	return x(new Date(d.date)); })
		    .y(function(d) { 
		    	return y(d.count); })
		    .interpolate("monotone");

		var svg = d3.select(element[0]).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		
		scope.$watch('data', function(data){
			if(!data) return;
			chartData=[]
			chartData=data.values;
			
			//get data axis extend based on either data or start/end date
			if(chartData){
				if(data.values.length===0){
					 svg.selectAll("."+pathClass).remove();
				}else{
					var date_max=d3.max(chartData, function(d) { return new Date(d.date); });	
					if(data.end){
						date_max=new Date(data.end);
					}
					var date_min=d3.min(chartData, function(d) { return new Date(d.date); });	
					if(data.start){
						date_min=new Date(data.start);
					}
					dateRange=[date_min,date_max]

					redrawLineChart();
				}
			}
        }, true);

		function drawLineChart(){
			
  			//Remove the axes so we can draw updated ones
			svg.selectAll('g.axis').remove();
            svg.selectAll("."+pathClass).remove();
			//Render X axis
  			svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		    //Render Y axis
		  	svg.append("g")
		      	.attr("class", "y axis")
		      	.call(yAxis)
		    	.append("text")
		      	.attr("transform", "rotate(-90)")
		      	.attr("y", 6)
		      	.attr("dy", ".71em")
		      	.style("text-anchor", "end")
		      	.text("Count");



			svg.append("svg:path")
				.attr({
                   //d: line(chartData),
                   "stroke": "blue",
                   "stroke-width": 2,
                   "fill": "none",
                   "class": pathClass
               	});
            initialized=true;
		}
		drawLineChart();

		function redrawLineChart(){
				
			svg.selectAll("."+pathClass).remove();
			//Set axis values
			// x.domain(d3.extent(dateRange, function(d) { return d; }));
			x.domain(dateRange);

			svg.selectAll("g.x.axis")
			 	.attr("transform", "translate(0," + height + ")")

			 	.call(xAxis)
			 	.selectAll('text')
			 	.attr("dx", "-2em")
			 	.attr("y", "-2")
   				.attr("transform", function(d){
		      		return "rotate(-65)"}
		      	);



			var y_max=d3.max(chartData, function(d) { return d.count; });
			if(y_max<5){
				yAxis.ticks(y_max);
				y_max=5;
			}

			y.domain([0,y_max]);

			svg.selectAll("g.y.axis").call(yAxis);
            svg.selectAll("g.x.axis").call(xAxis);

            //update values
            svg.append("svg:path")
				.attr({
                   d: line(chartData),
                   "stroke": "blue",
                   "stroke-width": 2,
                   "fill": "none",
                   "class": pathClass
               	});

		}



	}

	return {
		link: link,
		restrict: 'E',
		scope: { data: '='}
	}
})
