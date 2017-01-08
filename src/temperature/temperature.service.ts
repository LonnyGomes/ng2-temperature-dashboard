import { Injectable, Component } from '@angular/core';
import { TemperatureSensorComponent, ITemperatureSensor } from './temperature-sensor.component';
import { Http } from '@angular/http';

let settings = require('appSettings');

@Injectable()
export class TemperatureService {
    constructor(private http: Http) { }

    apiHostName:string = settings.apiHostName;
    apiUrl:string = 'api/list/current/temperature';
    deviceNames:string [] = settings.deviceNames;

    getIndividualSensor(deviceName:string):Promise<ITemperatureSensor> {
        return this.http.get(`http://${this.apiHostName}/${this.apiUrl}/${deviceName}`)
            .toPromise()
            .then(response => {
                let sensor:ITemperatureSensor = response.json().data as ITemperatureSensor;
                console.log(sensor);
                return sensor;
            });
    }

    getTemperatureSensors():Promise<ITemperatureSensor[]> {
        console.log(settings);
        return Promise.all(this.deviceNames.map(curDeviceName => {
            return this.getIndividualSensor(curDeviceName);
        }));
    }
}