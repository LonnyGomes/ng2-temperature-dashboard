import { Pipe, PipeTransform } from '@angular/core';

const maxLen = 12;

@Pipe({
    name: 'temperatureDeviceName'
})
export class TemperatureDeviceNamePipe implements PipeTransform {
    transform(value:string, args: string[]): any {
        if (!value) return value;

        return value.replace(/\w\S*/g, function (txt:string):string {
            let subStr = txt.charAt(0).toUpperCase() + txt.substr(1);
            subStr = subStr.replace(/_/g, ' ');

            if (subStr.length < maxLen) {
                return subStr;
            } else {
                return subStr.slice(0, maxLen - 3) + '...';
            }
        });
    }
}