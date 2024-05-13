import { FormControl } from "@angular/forms";
import { RestApi } from "../rest-api";


export class PasswordValidator {
  min!: number;
  number!: number;
  upper!: number;
  special!: number;
  lower!: number;
  constructor(private rest: RestApi) {
    this.rest.get('api/policy/password').subscribe(res => {
      this.min = res.minLength;
      this.lower = res.lowerCase;
      this.upper = res.upperCase;
      this.number = res.number;
      this.special = res.special;
    });
  }

  minlengthCheckValidator() {
    return (c: FormControl) => {
      let value = c.value as string;
      return value.length >= this.min ? null : { minText: true }
    };
  }

  minNumberCheckValidator() {
    return (c: FormControl) => {
      let value = c.value as string;
      let count = 0;
      let charArray = [...value];
      for (const t of charArray) {
        if (t >= '0' && t <= '9') {
          count++;
        }
      }
      return count >= this.number ? null : { minNumber: true }
    };
  }

  minSpecialCheckValidator() {
    return (c: FormControl) => {
      let value = c.value as string;
      const specialChar = ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
      let count = 0;
      let charArray = [...value];
      for (const t of charArray) {
        if (specialChar.indexOf(t) !== -1) {
          count++;
        }
      }
      return count >= this.special ? null : { minSpecial: true }
    };
  }

  minletterCheckValidator() {
    return (c: FormControl) => {
      let value = c.value as string;
      let count = 0;
      let charArray = [...value];
      for (const t of charArray) {
        if (t >= 'a' && t <= 'z') {
          count++;
        }
      }
      return count >= this.lower ? null : { minLetter: true }
    };
  }

  minletterUpperCheckValidator() {
    return (c: FormControl) => {
      let value = c.value as string;
      let count = 0;
      let charArray = [...value];
      for (const t of charArray) {
        if (t >= 'A' && t <= 'Z') {
          count++;
        }
      }
      return count >= this.upper ? null : { minLetterUpper: true }
    };
  }

}