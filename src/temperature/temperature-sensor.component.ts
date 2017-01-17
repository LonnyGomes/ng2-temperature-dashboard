import {SimpleChanges, Component, OnInit, OnChanges, Input, ElementRef, group} from '@angular/core';
import './temperature-sensor.component.css';

export interface ITemperatureSensor {
    //id: string;
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
export class TemperatureSensorComponent implements OnChanges {
    @Input('sensorData') data:ITemperatureSensor;

    element:ElementRef;

    constructor(el: ElementRef) {
        this.element = el;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.chartTemperature(this.element.nativeElement, changes['data'].currentValue);
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

    // get id():string {
    //     return this.data.id;
    // }

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

    chartTemperature(element:Element, temperatureData:ITemperatureSensor) {
        let margin = { top: 0, right: 0, bottom: 0, left: 0 },
            frame = { width: 100, height: 100 },
            bgColor = '#e2e2e2',
            fgColor = '#3476d0',
            width = frame.width - margin.left,
            height = frame.height,
            outerRadius = width / 2,
            innerRadius = outerRadius - 15,
            maxTemp = 100,
            arc,
            svg,
            pie,
            path,
            colors:any,
            textSelection,
            data:ITemperatureSensor[] = [],
            sampleData = [
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
            .value((d:ITemperatureSensor) => d.temperature)
            .sort(null);

        arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius)
                .padAngle(0.03);

        svg = d3.select(element.querySelector('.temperature-guage'))
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
            .attr('fill', (d:ITemperatureSensor, i:number) => {
                console.log(colors(d.deviceName));
                return colors(i);
            });

        textSelection = svg.selectAll('.temperature-text');
        textSelection
            .data([temperatureData])
            .enter()
            .append('text')
            .attr('class', 'temperature-val-text')
            .attr('text-anchor', 'middle')
            .attr("dominant-baseline", "central")
            .attr('x', function () {
                return 0;
            })
            .attr('y', function () {
                return 0;
            })
            .merge(textSelection)
            .text(function (d:ITemperatureSensor) {
                return Math.round(d.temperature) + '°';
            });
    }

}