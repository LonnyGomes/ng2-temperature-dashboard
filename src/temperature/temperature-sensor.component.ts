import {SimpleChanges, Component, OnInit, OnChanges, Input, ElementRef, group} from '@angular/core';
//import './temperature-sensor.component.css';
import * as moment from 'moment';

export interface ITemperatureSensor {
    deviceName: string;
    temperature: number;
    humidity: number;
    timeStamp: Date;
    timeStampStr?: string;
}

const d3 = require('d3');

@Component({
    selector: 'temperature-sensor',
    templateUrl: './temperature-sensor.component.html',
    styleUrls: ['./temperature-sensor.component.css']
})
export class TemperatureSensorComponent implements OnChanges {
    @Input() sensorData: ITemperatureSensor;

    element: ElementRef;

    constructor(el: ElementRef) {
        this.element = el;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.chartTemperature(this.element.nativeElement, changes['sensorData'].currentValue);
    }

    private fahrenheitToCelsius(val: number) {
        return (val - 32) * (5 / 9);
    }

    private celsiusToFahrenheit(val: number) {
        return (val * (9 / 5)) + 32;
    }

    private calcDewPoint(temperature: number, humidity: number) {
        // NOTE: the formula was taken from the following URL:
        //      http://tinyurl.com/chtn2or
        // T = temperature in fahrenheit degrees
        // f = relative humidity
        // Td = dew point temperature in celsius degrees
        // TdF = dew point temperature in fahrenheit degrees
        const T = this.fahrenheitToCelsius(temperature),
              f = humidity,
              Td = Math.pow((f / 100), (1 / 8)) * (112 + (0.9 * T)) + (0.1 * T) - 112,
              TdF = this.celsiusToFahrenheit(Td);

        // return the dew point rounded to 2 significant digits
        return Math.round(this.celsiusToFahrenheit(Td) * 100) / 100;
    }

    get deviceName(): string {
        return this.sensorData.deviceName;
    }

    get timeStamp(): Date {
        return this.sensorData.timeStamp;
    }

    get timeStampStr(): string {
        if (this.sensorData.timeStampStr) {
            return this.sensorData.timeStampStr;
        } else if (this.sensorData.timeStamp) {
            return moment(this.sensorData.timeStamp).fromNow();
        } else {
            return moment().fromNow();
        }
    }

    get temperature(): number {
        return this.sensorData.temperature;
    }

    get humidity(): number {
        return this.sensorData.humidity;
    }

    get dewPoint(): number {
        return this.calcDewPoint(this.temperature, this.humidity);
    }

    chartTemperature(element: Element, temperatureData: ITemperatureSensor) {
        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const frame = { width: 100, height: 100 };
        const bgColor = '#cacaca';
        const fgColor = '#0a1654';
        const width = frame.width - margin.left;
        const height = frame.height;
        const outerRadius = width / 2;
        const innerRadius = outerRadius - 15;
        const maxTemp = 100;
        let arc: any;
        let svg: any;
        let pie: any;
        let path: any;
        let colors: any;
        let textSelection: any;
        const data: ITemperatureSensor[] = [];
        const sampleData = [
            {temperature: 70.0},
            {temperature: 30.0}
        ];

        data.push(temperatureData);
        data.push({
            temperature: maxTemp - temperatureData.temperature,
            humidity: 0,
            deviceName: 'none',
            timeStamp: new Date()
        });

        colors = d3.scaleOrdinal()
            .range([fgColor, bgColor]);

        pie = d3.pie()
            .value((d: ITemperatureSensor) => d.temperature)
            .sort(null);

        arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius)
                .padAngle(0.03);

        svg = d3.select(element.querySelector('.temperature-sensor--guage'))
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        path = svg.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d: ITemperatureSensor, i: number) => {
                return colors(i);
            });

        textSelection = svg.selectAll('.temperature-sensor--val-text');
        textSelection
            .data([temperatureData])
            .enter()
            .append('text')
            .attr('class', 'temperature-sensor--val-text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('x', function () {
                return 0;
            })
            .attr('y', function () {
                return 0;
            })
            .merge(textSelection)
            .text(function (d: ITemperatureSensor) {
                return Math.round(d.temperature) + '°';
            });
    }

}
