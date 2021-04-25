import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading$=new BehaviorSubject(false);
  constructor() { }
  async showLoading(){
    // this.isLoading$.next(true);
  }
  async closeLoading(){
    this.isLoading$.next(false);
  }
}
