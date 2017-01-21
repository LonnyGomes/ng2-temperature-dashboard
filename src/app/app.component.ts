import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { TemperatureSensorComponent, ITemperatureSensor } from './../temperature/temperature-sensor.component';
import { TemperatureService } from '../temperature/temperature.service';
import * as moment from 'moment';

import '../../public/css/styles.css';
import * as _ from 'lodash';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TemperatureService]
})
export class AppComponent {
  sensors:ITemperatureSensor[];
  sensorsAsync:Observable<ITemperatureSensor>;

  constructor(private temperatureService:TemperatureService) { }

  ngOnInit(): void {
    const appSettings = require('appSettings');

    this.sensors = [];
    this.temperatureService.getTemperatureSensors()
      .subscribe(results => this.sensors.push(results));

    setInterval(() => {
      //update the timeStamp string
      for (const curSensorData of this.sensors) {
        curSensorData.timeStampStr = moment(curSensorData.timeStamp).fromNow();
      }
    }, 30000);

    let io = require('socket.io-client');
    let socket = io.connect(`http://${appSettings.apiHostName}`);
    socket.on('connect', ()=> console.log('connected via socket.io'));
    socket.on('temperatureUpdated', (data:ITemperatureSensor) => {
      let idx = _.findIndex(this.sensors, ['deviceName', data.deviceName]);
      console.log('socket.io data updated:', data);

      if (idx > -1) {
        data.timeStamp = new Date();
        this.sensors[idx] = data;
      }
    });
  }
}
