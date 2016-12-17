import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  private APP_PREFIX: string = 'regresan.do__';

  constructor() { }

  saveItem(key: string, value: any) {
    let item;
    if (typeof value === 'string') {
      item = value;
    } else {
      try {
        item = JSON.stringify(value);
      } catch(e) {
        item = value.toString() || value;
      }
    }
    localStorage.setItem(this.APP_PREFIX + key, item);
  }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(this.APP_PREFIX + key));
  }

  removeItem(key: string) {
    localStorage.removeItem(this.APP_PREFIX + key);
  }

}
