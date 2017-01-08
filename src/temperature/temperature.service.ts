import { Injectable, Component } from '@angular/core';
import { TemperatureSensorComponent, ITemperatureSensor } from './temperature-sensor.component';
import { Http } from '@angular/http';

@Injectable()
export class TemperatureService {
    constructor(private http: Http) { }

    hostName:string = 'localhost:3000';
    apiUrl:string = 'api/list/current/temperature';
    deviceNames:string [] = [
        'office',
        'bedroom',
        'outside',
        'Living_Room_Thermostat'
    ];

    getIndividualSensor(deviceName:string):Promise<ITemperatureSensor> {
        return this.http.get(`http://${this.hostName}/${this.apiUrl}/${deviceName}`)
            .toPromise()
            .then(response => {
                let sensor:ITemperatureSensor = response.json().data as ITemperatureSensor;
                console.log(sensor);
                return sensor;
            });
    }

    getTemperatureSensors():Promise<ITemperatureSensor[]> {
        return Promise.all(this.deviceNames.map(curDeviceName => {
            return this.getIndividualSensor(curDeviceName);
        }));
    }
}