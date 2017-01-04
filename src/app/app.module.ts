import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TemperatureSensor } from './../temperature/temperature-sensor.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    TemperatureSensor
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
