import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { TemperatureSensorComponent } from './../temperature/temperature-sensor.component';
import { TemperatureDeviceNamePipe } from './../temperature/temperature-device-name.pipe';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    TemperatureSensorComponent,
    TemperatureDeviceNamePipe
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
