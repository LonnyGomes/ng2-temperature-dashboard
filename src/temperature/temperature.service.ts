import { Injectable, Component } from '@angular/core';
import {TemperatureSensor} from './temperature-sensor.component';
import {SENSORS} from './mock-temperature-sensors';

@Injectable()
export class TemperatureService {
    getTemperatureSensors():Promise<TemperatureSensor[]> {
        return Promise.resolve(SENSORS);
    }
    getTemperatureSensorsSlowly():Promise<TemperatureSensor[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(SENSORS), 2000);
        });
    }
}