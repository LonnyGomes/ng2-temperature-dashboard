import { Component, Input } from '@angular/core';
import './temperature-sensor.component.css';

export interface ITemperatureSensor {
    id: string;
    deviceName: string;
    temperature: number;
    humidity: number;
    timeStamp: Date;
}

@Component({
    selector: 'temperature-sensor',
    templateUrl: './temperature-sensor.component.html'
})
export class TemperatureSensorComponent {
    @Input('sensorData') data:ITemperatureSensor;

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
}