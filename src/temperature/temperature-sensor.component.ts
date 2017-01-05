import { Component, Input } from '@angular/core';
import './temperature-sensor.component.css';

export interface ITemperatureSensor {
    id: string;
    name: string;
    lastUpdate: Date;
}

@Component({
    selector: 'temperature-sensor',
    templateUrl: './temperature-sensor.component.html'
})
export class TemperatureSensor {
    @Input('sensorData') data:ITemperatureSensor;

    get name():string {
        return this.data.name;
    }

    get id():string {
        return this.data.id;
    }

    get lastUpdate():Date {
        return this.data.lastUpdate;
    }
}