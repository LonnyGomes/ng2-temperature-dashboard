import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { TemperatureSensorComponent, ITemperatureSensor } from './../temperature/temperature-sensor.component';
import { TemperatureService } from '../temperature/temperature.service'

import '../../public/css/styles.css';

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
      this.temperatureService.getTemperatureSensors()
        .subscribe(results => {
          let idx = 0;
          for (let curData of this.sensors) {
            if (curData.deviceName === results.deviceName) {
              this.sensors[idx] = results;
              break;
            }
            idx += 1;
          }
        });
    }, 20000);

    let io = require('socket.io-client');
    let socket = io.connect(`http://${appSettings.apiHostName}`);
    socket.on('connect', ()=> console.log('connected via socket.io'));
    socket.on('temperatureUpdated', (data:ITemperatureSensor) => {
      let idx = 0;
      console.log('socket.io data updated:', data);
      for (let curData of this.sensors) {
        if (curData.deviceName === data.deviceName) {
          this.sensors[idx] = data;
          break;
        }
        idx += 1;
      }

    });
  }
}
