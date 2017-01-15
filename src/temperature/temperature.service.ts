import { Observable, Observer } from 'rxjs/Rx';
import { Injectable, Component } from '@angular/core';
import { TemperatureSensorComponent, ITemperatureSensor } from './temperature-sensor.component';
import { Http, Response } from '@angular/http';

let settings = require('appSettings');

@Injectable()
export class TemperatureService {
    constructor(private http: Http) { }

    apiHostName:string = settings.apiHostName;
    apiUrl:string = 'api/list/current/temperature';
    deviceNames:string [] = settings.deviceNames;

    private extractData(res:Response) {
        return res.json().data as ITemperatureSensor;
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getIndividualSensor(deviceName:string):Observable<ITemperatureSensor> {
        return this.http.get(`http://${this.apiHostName}/${this.apiUrl}/${deviceName}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTemperatureSensors():Observable<ITemperatureSensor> {
        console.log(settings);
        const results:Observable<ITemperatureSensor>[] = this.deviceNames.map(curDeviceName => {
            return this.getIndividualSensor(curDeviceName);
        });

        return Observable.from(results).flatMap(a => a);
    }
}

