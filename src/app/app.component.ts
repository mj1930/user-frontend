import { LoaderService } from './services/shared/loader.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private loadingService:LoaderService){
    this.loadingService.isLoading$.subscribe(d=>this.loaderVisible=d);
  }
  title = 'user-front-end';
  loaderVisible:boolean=false;
}
