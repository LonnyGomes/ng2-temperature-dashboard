import { Component } from '@angular/core';
import { TemperatureSensor, ITemperatureSensor } from './../temperature/temperature-sensor.component';
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

  constructor(private temperatureService:TemperatureService) {
  }

  ngOnInit(): void {
    this.temperatureService.getTemperatureSensors()
      .then(results => {
        this.sensors = results
        console.log(this.sensors);
      });
  }
}
