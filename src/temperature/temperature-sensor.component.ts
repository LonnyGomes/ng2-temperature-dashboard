import {Component, OnInit, Input, ElementRef} from '@angular/core';
import './temperature-sensor.component.css';

export interface ITemperatureSensor {
    id: string;
    deviceName: string;
    temperature: number;
    humidity: number;
    timeStamp: Date;
}

const d3 = require('d3');

@Component({
    selector: 'temperature-sensor',
    templateUrl: './temperature-sensor.component.html'
})
export class TemperatureSensorComponent implements OnInit {
    @Input('sensorData') data:ITemperatureSensor;

    element:ElementRef;

    constructor(el: ElementRef) {
        this.element = el;
    }

    ngOnInit() {
        this.chartTemperature(this.element.nativeElement, this.data);
    }

    private fahrenheitToCelsius(val:number) {
        return (val - 32) * (5 / 9);
    }

    private celsiusToFahrenheit(val:number) {
        return (val * (9 / 5)) + 32;
    }

    private calcDewPoint(temperature:number, humidity:number) {
        //NOTE: the formula was taken from the following URL:
        //      http://tinyurl.com/chtn2or
        // T = temperature in fahrenheit degrees
        // f = relative humidity
        // Td = dew point temperature in celsius degrees
        // TdF = dew point temperature in fahrenheit degrees
        var T = this.fahrenheitToCelsius(temperature),
            f = humidity,
            Td = Math.pow((f / 100), (1 / 8)) * (112 + (0.9 * T)) + (0.1 * T) - 112,
            TdF = this.celsiusToFahrenheit(Td);

        //return the dew point rounded to 2 significant digits
        return Math.round(this.celsiusToFahrenheit(Td) * 100) / 100;
    }

    get deviceName():string {
        return this.data.deviceName;
    }

    get id():string {
        return this.data.id;
    }

    get timeStamp():Date {
        return this.data.timeStamp;
    }

    get temperature():number {
        return this.data.temperature;
    }

    get humidity():number {
        return this.data.humidity;
    }

    get dewPoint():number {
        return this.calcDewPoint(this.temperature, this.humidity);
    }

    chartTemperature(element: Element, data: ITemperatureSensor) {
        var margin = { top: 0, right: 0, bottom: 0, left: 0 },
            frame = { width: 55, height: 150 },
            bgColor = '#e2e2e2',
            fgColor = '#3476d0',
            width = frame.width - margin.left,
            height = frame.height,
            yScale = d3.scaleLinear()
                .domain([0, 120])
                .range([0, height]),
            temperatureValues = [],
            svg,
            bgRect,
            group,
            renderGuage;

        svg = d3.select(element.querySelector('.temperature-guage'))
            .append('svg')
            .attr('width', frame.width)
            .attr('height', frame.height);

        group = svg.append('g')
            .attr('transform', 'translate(' +
            margin.left + ', 0)');

        bgRect = group.append('rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', bgColor);

        renderGuage = function (guageData) {
            var gaugeSelection = group.selectAll('.temperature-gauge'),
                textSelection = group.selectAll('.temperature-text');

            gaugeSelection
                .data(guageData)
                .enter()
                .append('rect')
                .attr('class', 'temperature-gauge')
                .attr('x', '0')
                .attr('width', width)
                .attr('fill', fgColor)
                .merge(gaugeSelection)
                .attr('y', function (d) {
                    console.log('asdf');
                    return height - yScale(d.temperature);
                })
                .attr("height", function (d) {
                    return yScale(d.temperature);
                });

            textSelection
                .data(guageData)
                .enter()
                .append('text')
                .attr('class', 'temperature-text')
                .attr('text-anchor', 'middle')
                .attr('x', function () {
                    return width / 2;
                })
                .attr('y', function () {
                    return height - 50;
                })
                .merge(textSelection)
                .text(function (d) {
                    return Math.round(d.temperature) + '°';
                });
        }

        renderGuage(data);
    }
}