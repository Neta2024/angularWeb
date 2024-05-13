import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaidate'
})
export class ThaiDatePipe implements PipeTransform {
  transform(date: Date, format: string): string {
    if (date == null) return 'ไม่ระบุ (เวลาประเทศไทย)';
    if (date.toString() == '') return 'ไม่ระบุ (เวลาประเทศไทย)';
    if (date.toString() == '-') return 'ไม่ระบุ (เวลาประเทศไทย)';

    let ThaiDay = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
    let shortThaiMonth = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    let longThaiMonth = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    let inputDate = new Date(date.toString().replace(' ', 'T'));
    let dataDate = [
      inputDate.getDay(), inputDate.getDate(), inputDate.getMonth(), inputDate.getFullYear(), inputDate.getHours(), inputDate.getMinutes(), inputDate.getSeconds()
    ];
    let outputDateFull = [
      'วัน ' + ThaiDay[dataDate[0]],
      'ที่ ' + dataDate[1],
      'เดือน ' + longThaiMonth[dataDate[2]],
      'พ.ศ. ' + (dataDate[3] + 543)
    ];
    let outputDateShort = [
      dataDate[1],
      shortThaiMonth[dataDate[2]],
      dataDate[3] + 543
    ];
    let outputDateMedium = [
      dataDate[1],
      longThaiMonth[dataDate[2]],
      dataDate[3] + 543
    ];
    let outputDateFullTime = [
      dataDate[1],
      shortThaiMonth[dataDate[2]],
      (dataDate[3] + 543),
      String(dataDate[4]).padStart(2, '0') + ':' + String(dataDate[5]).padStart(2, '0') + ':' + String(dataDate[6]).padStart(2, '0'),
      'น. (เวลาประเทศไทย)'
    ];
    let returnDate: string;
    returnDate = outputDateMedium.join(" ");
    if (format == 'full') {
      returnDate = outputDateFull.join(" ");
    }
    if (format == 'medium') {
      returnDate = outputDateMedium.join(" ");
    }
    if (format == 'short') {
      returnDate = outputDateShort.join(" ");
    } 
    if (format == 'fulltime') {
      returnDate = outputDateFullTime.join(" ");
    }
    return returnDate;
  }
}
