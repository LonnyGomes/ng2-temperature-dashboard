import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TemperatureSensorComponent } from './../temperature/temperature-sensor.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    TemperatureSensorComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
