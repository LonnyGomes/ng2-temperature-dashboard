import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'temperatureDeviceName'
})
export class TemperatureDeviceNamePipe implements PipeTransform {
    transform(value:string, args: string[]): any {
        if (!value) return value;

        return value.replace(/\w\S*/g, function (txt) {
            const subStr = txt.charAt(0).toUpperCase() + txt.substr(1);
            return subStr.replace(/_/g, ' ');
        });
    }
}