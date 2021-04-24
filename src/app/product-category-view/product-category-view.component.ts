import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-product-category-view',
  templateUrl: './product-category-view.component.html',
  styleUrls: ['./product-category-view.component.css']
})
export class ProductCategoryViewComponent implements OnInit {
  categoryId: String = '';
  productList = [];
  categoryName: String = '';
  categories: any = [];
  showLocationDropdown = false;
  minValue: number = 0;
  maxValue: number = 100000;
  options: Options = {
    floor: 0,
    ceil: 1000,
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
  tempForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.tempForm = this.fb.group({
      minValueF: [this.minValue],
      maxValueF: [this.maxValue]
    });

    // this.tempForm.get('minValueF').valueChanges.subscribe(minData => {
    //   console.log('----', minData);
    // });

    // this.tempForm.get('maxValueF').valueChanges.subscribe(maxData => {
    //   console.log('----', maxData);
    // });
  }

  ngOnInit(): void {
    //this.createProductPriceForm();
    this.getCategories();
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.getProducts();
      this.getCategory();
      let event = {
        target: {
          value: 'Hisar'
        }
      };
      this.getProductByCity(event);
    } else {
      this.router.navigate(['']);
    }
  }

  // createProductPriceForm() {
  //   this.productPriceForm = this.fb.group({
  //     minValue: [''],
  //     maxValue: ['']
  //   });
  // }

  getCategory() {
    this.authService.getOneCategory(this.categoryId).subscribe((res: any) => {
      this.categoryName = res.data.categoryName;
      if (this.categoryName === 'Food and Beverages') {
        this.showLocationDropdown = true;
      } else {
        this.showLocationDropdown = false;
      }
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
        this.productList = res.data;
      }
    });
  }

  sortData(event) {
    console.log(event);
    let obj = {
      key: event.target.value ? event.target.value.split('-')[0] : '',
      sortBy: event.target.value
        ? event.target.value.split('-')[1] === 'asc'
          ? '1'
          : '-1'
        : 0,
      skip: 0,
      limit: 100
    };
    this.authService.getSortProducts(obj).subscribe((res: any) => {
      if (res.code === 200) {
        this.productList = res.data;
      }
    });
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

  getProductByCity(event) {
    let reqBody = {
      skip: 0,
      limit: 100,
      city: event.target.value
    };
    this.authService.getProductsByCity(reqBody).subscribe(
      data => {
        this.productList = data['data'];
      },
      error => {
        console.log(error);
      }
    );
  }

  onGetValue(minValue: any, maxValue: any) {
    this.minValueChange = minValue;
    this.maxValueChange = maxValue;
  }
  getProductByPrice() {
    // let temp1: any;
    // let temp2: any;
    // this.tempForm.get('minValueF').valueChanges.subscribe(minData => {
    //   console.log('----', minData);
    //   temp1 = minData;
    // });

    // this.tempForm.get('maxValueF').valueChanges.subscribe(maxData => {
    //   console.log('----', maxData);
    //   temp2 = maxData;
    // });

    // console.log(temp1, temp2);
    const payload = {
      categoryId: this.categoryId,
      skip: 0,
      limit: 10,
      lowerPrice: this.minValueChange,
      higherPrice: this.maxValueChange
    };

    this.authService.getProductByPrice(payload).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
