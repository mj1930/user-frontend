import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  term: string;
  searchResults: any = [];
  categoryId: String = '';
  categoryName: String = '';
  categories: any = [];
  showLocationDropdown = false;
  minValue: number = 0;
  maxValue: number = 100000;
  options: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      this.onGetValue(this.minValue, this.maxValue);
      switch (label) {
        case LabelType.Low:
          return '<b></b> ' + value;
        case LabelType.High:
          return '<b></b>' + value;
        default:
          return '' + value;
      }
    }
  };
  //productPriceForm: FormGroup;
  minValueChange: any;
  maxValueChange: any;
  // tempForm: FormGroup;
  colorForm: FormGroup;
  colors = [
    { name: 'Red', checked: false },
    { name: 'Green', checked: false },
    { name: 'Black', checked: false },
    { name: 'Blue', checked: false }
  ];
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.term = this.route.snapshot.url[1].path;
    this.getSearchResults();
    this.createColorForm();
    this.getCategories();
  }

  createColorForm() {
    this.colorForm = this.fb.group({
      colors: new FormArray([])
    });
    this.patchValues();
  }

  patchValues() {
    const formArray = this.colorForm.get('colors') as FormArray;
    this.colors.forEach(color => {
      formArray.push(
        new FormGroup({
          name: new FormControl(color.name),
          checked: new FormControl(color.checked)
        })
      );
    });
  }

  getProducts() {
    let obj = {
      skip: 0,
      limit: 20,
      categoryId: this.categoryId
    };
    this.authService.getProductsByCategory(obj).subscribe((res: any) => {
      if (res.code === 200) {
        this.searchResults = res.data;
      }
    });
  }

  getSearchResults() {
    if (this.term === '') {
      this.searchResults = [];
    }
    this.authService.searchProduct(this.term).subscribe(resp => {
      this.searchResults = resp['data'];
    });
  }

  onGetValue(minValue: any, maxValue: any) {
    this.minValueChange = minValue;
    this.maxValueChange = maxValue;
  }

  getCategories() {
    let reqBody = {
      skip: 0,
      limit: 100
    };
    this.authService.getCategories(reqBody).subscribe(
      data => {
        this.categories = data['data'];
      },
      error => {
        console.log(error);
      }
    );
  }

  getProductsOnSubmit(rating?) {
    const selectedColor = this.colorForm.value.colors.filter(
      item => item.checked
    );

    const colorArray = selectedColor.map(item => item.name);

    const colorPayload = {
      categoryId: this.categoryId,
      color: colorArray,
      skip: 0,
      limit: 10
    };

    const payload = {
      categoryId: this.categoryId,
      skip: 0,
      limit: 10,
      lowerPrice: this.minValueChange,
      higherPrice: this.maxValueChange
    };

    const ratingPayload = {
      categoryId: this.categoryId,
      skip: 0,
      limit: 10,
      rating
    }
    if (colorArray.length)
      this.getProductByColor(colorPayload);
    else if ((this.minValueChange > this.options.floor) || (this.maxValueChange < this.options.ceil) )
      this.getProductByPrice(payload);
    else if (rating)
      this.getProductByRating(ratingPayload);
    else
    console.log('hello');
      // this.getProducts();
  }

  getProductByColor(payload) {
    this.authService.getProductByColor(payload).subscribe(
      resp => {
        this.searchResults  = resp['data']
      },
      error => {
        console.log(error);
      }
    );
  }

  getProductByRating(payload) {
    this.authService.getProductByRating(payload).subscribe(
      resp => {
        this.searchResults  = resp['data']
      },
      error => {
        console.log(error);
      }
    );
  }

  getProductByPrice(payload) {
    this.authService.getProductByPrice(payload).subscribe(
      data => {
        this.searchResults  = data['data']
      },
      error => {
        console.log(error);
      }
    );
  }

}
