import { Injectable, Component } from '@angular/core';
import { TemperatureSensor, ITemperatureSensor } from './temperature-sensor.component';
import {SENSORS} from './mock-temperature-sensors';

@Injectable()
export class TemperatureService {
    getTemperatureSensors():Promise<ITemperatureSensor[]> {
        return Promise.resolve(SENSORS);
    }
    getTemperatureSensorsSlowly():Promise<ITemperatureSensor[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(SENSORS), 2000);
        });
    }
}