import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import $ from './lib/jquery'
import * as d3 from 'd3'
import * as d4 from 'd3-svg-annotation'
import noUiSlider from './lib/nouislider'

export function init(el, context, config, mediator) {

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata/1iEeDMzQ3Ra7cMHsHc9TKMch0X8CD13Wq-uLaMuims20.json',
        type: 'json',
        crossOrigin: true,
        success: (resp) => {

            app.database = resp.sheets.income
            app.initialize()
        }
    });

    var app = {

        database: null,

        sliders: null,

        responses: null,

        isolated: [],

        toggles: null,

        range: [20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,31000,32000,33000,34000,35000,36000,37000,38000,39000,40000,41000,42000,43000,44000,45000,46000,47000,48000,49000,50000,51000,52000,53000,54000,55000,56000,57000,58000,59000,60000,61000,62000,63000,64000,65000,66000,67000,68000,69000,70000,71000,72000,73000,74000,75000,80000,90000,100000,110000,120000,130000,140000,150000,160000,170000,180000,190000,200000,210000,220000,230000,240000,250000,300000,350000,400000,450000,500000,600000,700000,800000,900000,1000000,1500000,2000000,2500000,3000000,3500000,4000000,4500000,5000000,6000000,7000000,8000000,9000000,10000000,20000000,30000000,40000000,50000000,55000000,60000000],

        initialize: function() {

            var html = '';

            var tally = 0;

            app.database.forEach( (item, index)  => {

                app.database[index]["jid"] = index

                if (index < 11) {

                    html += '<div class="question-container">';

                    html += '<div class="job-box"><div class="job-image" style="background-color: ' + item.background + ';background-image: url(' + config.assetPath + '/assets/imgs/' + item.img + ');"></div></div>';

                    html += '<div class="header-box">' + item.job + '</div>';

                    html += '<div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.job + ' <strong>should</strong> earn annually?</div>';

                    html += '<div class="multiplier-group">';

                    html += '<div class="standard-box">';

                    html += '<div class="switch-toggle switch-ios">';

                    html += '<input id="one_' + tally + '" name="multiplier_' + tally + '" type="radio" checked value="1000">';

                    html += '<label for="one_' + tally + '" data-id="' + tally + '" data-val="1000" class="multiplier">1000</label>';

                    html += '<input id="ten_' + tally + '" name="multiplier_' + tally + '" type="radio" value="10000">';

                    html += '<label for="ten_' + tally + '" data-id="' + tally + '" data-val="10000" class="multiplier">10,000</label>';

                    html += '<input id="hundred_' + tally + '" name="multiplier_' + tally + '" type="radio" value="100000">';

                    html += '<label for="hundred_' + tally + '" data-id="' + tally + '" data-val="100000" class="multiplier">100,000</label>';

                    html += '<a></a></div></div></div>';

                    tally++

                    html += '<input value class="amount-box" type="number" pattern="[0-9]*"><div class="answer-box"><div class="slider"></div></div>';

                    html += '</div><div class="question-group">';

                    html += '<div class="question-box">How much do you think ' + item.job + ' <strong>actually</strong> ' + ((index==0)?'earns':'earn') +'?</div>';

                    html += '<div class="multiplier-group">';

                    html += '<div class="standard-box">';

                    html += '<div class="switch-toggle switch-ios">';

                    html += '<input id="one_' + tally + '" name="multiplier_' + tally + '" type="radio" checked value="1000">';

                    html += '<label for="one_' + tally + '" data-id="' + tally + '" data-val="1000" class="multiplier">1000</label>';

                    html += '<input id="ten_' + tally + '" name="multiplier_' + tally + '" type="radio" value="10000">';

                    html += '<label for="ten_' + tally + '" data-id="' + tally + '" data-val="10000" class="multiplier">10,000</label>';

                    html += '<input id="hundred_' + tally + '" name="multiplier_' + tally + '" type="radio" value="100000">';

                    html += '<label for="hundred_' + tally + '" data-id="' + tally + '" data-val="100000" class="multiplier">100,000</label>';

                    html += '<a></a></div></div></div>';

                    html += '<input value class="amount-box" type="number" pattern="[0-9]*"><div class="answer-box"><div class="slider"></div></div>';

                    html += '</div></div></div>';

                    tally++

                }

            })

            d3.select('#quiz-container').html(html)

            app.scroller()

            d3.selectAll('.multiplier').on("click", function() {

                var target = d3.select(this).attr("data-id")
                var num = app.sliders[target].noUiSlider.get()
                var multiplier = d3.select(this).attr("data-val")

                if (num!='0.00') {

                    app.multiplier(num,target,multiplier)

                }

                //console.log(target + ' | ' + num + ' | ' + multiplier)

            });

            app.compile();

        },

        scroller: function() {

            var $question_block = $('.question-container');

            $question_block.each(function(){
                if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
                    $(this).addClass('is-hidden');
                }
            });

            $(window).on('scroll', function(){
                $question_block.each(function(){
                    if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).hasClass('is-hidden') ) {
                        $(this).removeClass('is-hidden').addClass('bounce-in');
                    }
                });
            });
        },

        multiplier: function(num,target,multiplier) {

            let amounts = document.getElementsByClassName("amount-box")[target];
            
            var digit = parseFloat(num).toFixed()

            var result = parseFloat(digit * multiplier).toFixed();

            amounts.value = result;

        },

        compile: function() {

            app.sliders = document.getElementsByClassName('slider');

            for (var i = 0; i < app.sliders.length; i++) {

                let obj = {}

                let target = i

                obj["id"] = target

                app.isolated.push(obj)

                noUiSlider.create(app.sliders[i], {
                    start: 0,
                    step: 1,
                    range: {
                        'min': 0,
                        'max': 500
                    }
                });

                app.sliders[i].noUiSlider.on('slide', function( values, handle, unencoded, tap, positions ) {

                    let amounts = document.getElementsByClassName("amount-box")[target];
                    amounts.value = app.makeItLookNice(values[0],target);

                });

                document.getElementsByClassName("amount-box")[target].onchange = function() {
                    console.log("Detect change like a gangsta")
                };

            }

            d3.select('#quiz-submit').on("click", function() {
                app.precheck();
            });

        },

        precheck: function() {

            d3.select('#quiz-prompt').html('')

            var proceed = true

            var checklist = document.getElementsByClassName('amount-box');

            for (var i = 0; i < checklist.length; i++) {

                if (checklist[i].value == '') {

                    d3.select('#quiz-prompt').html('You need to answer all the questions before viewing the results')

                    proceed = false

                } else {

                    app.isolated[i]["estimate"] = checklist[i].value

                    var target = (i%2 == 0) ? Math.floor((i+1) / 2) : Math.floor(i / 2)

                    if (i%2 == 0) {

                        app.database[target]["fairpay"] = checklist[i].value

                    } else {

                        app.database[target]["prediction"] = checklist[i].value

                    }

                }
            }

            if (proceed) {

                app.formulate()

            }

            

        },

        transit: function(path, params, method, target) {

            method = method || "post";

            var form = document.createElement("form");
            form.setAttribute("method", method);
            form.setAttribute("action", path);
            form.setAttribute("target", target);
            
            for(var key in params) {
                if(params.hasOwnProperty(key)) {
                    var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", params[key]);

                    form.appendChild(hiddenField);
                 }
            }

            document.body.appendChild(form);
            form.submit();
            app.prepare();

        },

        formulate: function() {

            d3.select('#quiz-submit').style('display','none')

            d3.select('#loading-container').style('display','block')

            document.getElementById('loading-container').scrollIntoView();
            
            app.transit('https://docs.google.com/a/guardian.co.uk/forms/d/1tPxmo15nt_CpidQac9d5n6A6LYwcFx7qXpK_0kbYlZs/formResponse', {
                "entry.931701662": document.getElementsByClassName("amount-box")[0].value,
                "entry.55003727": document.getElementsByClassName("amount-box")[1].value,
                "entry.513278287": document.getElementsByClassName("amount-box")[2].value,
                "entry.144292002": document.getElementsByClassName("amount-box")[3].value,
                "entry.574180580": document.getElementsByClassName("amount-box")[4].value,
                "entry.232131579": document.getElementsByClassName("amount-box")[5].value,
                "entry.1396463126": document.getElementsByClassName("amount-box")[6].value,
                "entry.769270270": document.getElementsByClassName("amount-box")[7].value,
                "entry.1214910253": document.getElementsByClassName("amount-box")[8].value,
                "entry.1391783442": document.getElementsByClassName("amount-box")[9].value,
                "entry.791161495": document.getElementsByClassName("amount-box")[10].value,
                "entry.1741030491": document.getElementsByClassName("amount-box")[11].value,
                "entry.759942158": document.getElementsByClassName("amount-box")[12].value,
                "entry.1900681485": document.getElementsByClassName("amount-box")[13].value,
                "entry.821059558": document.getElementsByClassName("amount-box")[14].value,
                "entry.1599655770": document.getElementsByClassName("amount-box")[15].value,
                "entry.635215666": document.getElementsByClassName("amount-box")[16].value,
                "entry.1588745032": document.getElementsByClassName("amount-box")[17].value,
                "entry.1265338617": document.getElementsByClassName("amount-box")[18].value,
                "entry.564887023": document.getElementsByClassName("amount-box")[19].value,
                "entry.955565170": document.getElementsByClassName("amount-box")[20].value,
                "entry.639595039": document.getElementsByClassName("amount-box")[21].value,
            }, 'post','hiddenForm')
        },

        JSONize: function(str) {
          return str
            // wrap keys without quote with valid double quote
            .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":'})    
            // replacing single quote wrapped ones to double quote 
            .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"'})         
        },

        prepare: function() {

            reqwest({
                url: 'https://interactive.guim.co.uk/2017/08/ceo-results/ceo-results.json',
                crossOrigin: true,
                success: (resp) => {

                    app.responses = resp;

                    app.assemble()

                }

            });

        },

        assemble: function() {

            // Request the data
            var html = '';

            var tally = 0;

            app.database.forEach( (item, index)  => {

                if (index < 11) {

                    html += '<div class="question-container">';

                    html += '<div class="job-box"><div class="job-image" style="background-color: ' + item.background + ';background-image: url(' + config.assetPath + '/assets/imgs/' + item.img + ');"></div></div>';

                    html += '<div class="header-box">' + item.job + '</div>';

                    html += '<div class="question-group">';

                    html += '<div class="question-box">How much should ' + item.job + ' earn annually?</div>';

                    html += '<div id="viz_' + tally + '" class="visualization-container"></div>';

                    html += '<div style="margin-top:20px"></div>';

                    tally++

                    html += '<div class="question-box">How much do ' + item.job + ' really earn annually?</div>';

                    html += '<div id="viz_' + tally + '" class="visualization-container"></div>';

                    tally++

                    html += '</div></div>';

                }

            })

            d3.select('#viz-container').html(html)

            app.vizualize();


        },

        vizualize: function() {

            d3.select('#loading-container').style('display','none')

            var questions = ["Question_1a","Question_1b",
                    "Question_2a","Question_2b",
                    "Question_3a","Question_3b",
                    "Question_4a","Question_4b",
                    "Question_5a","Question_5b",
                    "Question_6a","Question_6b",
                    "Question_7a","Question_7b",
                    "Question_8a","Question_8b",
                    "Question_9a","Question_9b",
                    "Question_10a","Question_10b",
                    "Question_11a","Question_11b"]

            var payslips = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]

            var width = document.querySelector("#viz-container").getBoundingClientRect().width, 
            height = 150,
            centre = height / 2, padding = 2, margin = 40;

            var viz = document.getElementsByClassName('visualization-container');

            for (var i = 0; i < viz.length; i++) {

                let target = i

                let data = app.responses[questions[i]].data;

                let average = app.responses[questions[i]].average;

                let estimate = parseInt(app.isolated[i].estimate)

                let reality = payslips[target] ; 

                let pay = parseInt(app.database[reality].pay)

                let desc = app.database[reality].job

                let svg = d3.select("#viz_"+target)
                    .append('svg')
                    .attr('class', 'chart')
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", `translate(0,0)`);

                // Set the X a axis min value
                let xMin = d3.min(data, function (d) { return d.number; });

                // If the users estimate is less than the min value, reset the min value to their estimate
                (estimate <= xMin) ? xMin = estimate : '' ;

                (pay <= xMin) ? xMin = pay : '' ;

                // Set the X a axis max value
                let xMax = d3.max(data, function (d) { return d.number; });

                // If the users estimate is more than the max value, reset the max value to their estimate
                (estimate >= xMax) ? xMax = estimate : '' ;

                (pay >= xMax) ? xMax = pay : '' ;

                //console.log(desc + ' | '  + xMin +   ' | '  +  xMax +   ' | '  +  pay +   ' | '  +  estimate)

                let xRange = xMax - xMin;

                let median = xRange / 2
                                    
                let x = d3.scaleLinear() //d3.scale.linear()
                    .domain([xMin - (xRange * .05), xMax + (xRange * .05)])
                    .range([0, width]);

                let y = d3.scaleLinear() //d3.scale.linear()
                    .domain([0, height])
                    .range([height, 0]);

                let scale = d3.scaleSqrt() //d3.scale.sqrt()
                    .domain([d3.min(data, function (d) { return d.count; }), d3.max(data, function (d) { return d.count; })])
                    .range([1,9]);

                let opacity = d3.scaleSqrt() //d3.scale.sqrt()
                    .domain([d3.min(data, function (d) { return d.count; }), d3.max(data, function (d) { return d.count; })])
                    .range([.01, .2]);

                // V3
                //let xAxis = d3.svg.axis().scale(x).orient("bottom");

                let xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat (function (d) { return app.formatValue(d) })
                
                svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", `translate(0,${height-20})`)
                  .call(xAxis)
                  .append("text")
                        .attr("x", width + 20)
                        .attr("y", margin - 10)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .style("font-size", "0.7px")


                 //d3.max(data, function (d) { return d.count; })

                var totals = data.map( (value) => { return value.count });

                var total = totals.reduce( (a, b) => { return a + b; }, 0);

                if (total > 5) {

                    // Display the average if we have enough responses
                    svg.append("line")
                        .attr("x1", () => { return x(average) })
                        .attr("y1", (height/3) - 50)
                        .attr("x2", () => { return x(average) })
                        .attr("y2", (height/3) + 50)
                        .attr("stroke", "#b5b2af")
                        .attr("stroke-width", "1")
                        .attr("stroke-dasharray","2,1")

                    svg.append("text")
                        .attr("x", () => { return x(average) })
                        .attr("y", (height/3) + 60)
                        .text("Average")
                        .attr("text-anchor","middle")

                }

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .insert("circle")
                    .attr("cx", function (d) { return x(d.number); })
                    .attr("cy", height/3)
                    .attr("opacity", function (d) { return opacity(d.count); })
                    .attr("r", function (d) { return scale(d.count); })
                    .style("fill", "#35a4e6")

                // What the Guardian reader answered

                svg.append("circle")
                    .attr("cx", () => { return x(estimate); })
                    .attr("cy", height/3)
                    .attr("r", 10)
                    .attr("fill", "#dc2a7d")

                let notes1 = [{
                    note: {
                      label: "Your answer: " + app.humanize(estimate),
                      wrap: 190
                    },
                    subject: {
                      radius: 15
                    },
                    x: x(estimate),
                    y: height/3,
                    dy: -30,
                    dx: (estimate < median) ? 30 : -30,
                }]

                let makeAnnotations1 = d4.annotation()
                    .type(d4.annotationCalloutCircle)
                    .annotations(notes1)

                svg.append("g")
                    .attr("class", "annotation-group first")
                    .call(makeAnnotations1)

                // What they actually earn

                svg.append("circle")
                    .attr("cx", () => { return x(pay); })
                    .attr("cy", height/3)
                    .attr("r", 10)
                    .attr("fill", "#4e0375")

                let notes2 = [{
                    note: {
                      label: "Actual salary: " + app.humanize(pay),
                      wrap: 190
                    },
                    subject: {
                      radius: 15
                    },
                    x: x(pay),
                    y: height/3,
                    dy: 30,
                    dx: (pay < median) ? 30 : -30
                }]

                let makeAnnotations2 = d4.annotation()
                    .type(d4.annotationCalloutCircle)
                    .annotations(notes2)

                svg.append("g")
                    .attr("class", "annotation-group first")
                    .call(makeAnnotations2)

            }

        },

        formatValue: function(num) {

            return (num > 999999) ? num / 1000000 + 'm' :
                (num > 999) ? num / 1000 + 'k' : num

        },

        humanize: function(num) {
            var result = parseFloat(num).toFixed();
            result = result.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
            return '$' + result
        },

        makeItLookNice: function(num, target) {

            let digit = parseFloat(num).toFixed()

            let toggle = document.getElementsByClassName("switch-toggle")[target];

            let inputs = toggle.getElementsByTagName('input');

            let multiplier = 1000

            for (let i = 0; i < inputs.length; ++i) {

                if (inputs[i].checked) {
                  multiplier = inputs[i].value
                }

            }

            let result = parseFloat(digit * multiplier).toFixed();

            return result
        }

    }

}




