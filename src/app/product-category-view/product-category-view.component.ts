import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { LoaderService } from '../services/shared/loader.service';
@Component({
  selector: 'app-product-category-view',
  templateUrl: './product-category-view.component.html',
  styleUrls: ['./product-category-view.component.css']
})
export class ProductCategoryViewComponent implements OnInit {
  imgLink =
    'http://www.thejungleadventure.com/assets/images/noimage/noimage.png';
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private fb: FormBuilder
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    // this.tempForm = this.fb.group({
    //   minValueF: [this.minValue],
    //   maxValueF: [this.maxValue]
    // });

    // this.tempForm.get('minValueF').valueChanges.subscribe(minData => {
    //   console.log('----', minData);
    // });

    // this.tempForm.get('maxValueF').valueChanges.subscribe(maxData => {
    //   console.log('----', maxData);
    // });
  }

  ngOnInit(): void {
    //this.createProductPriceForm();
    this.createColorForm();
    this.getCategories();
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.getProducts();
      this.getCategory();
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

  getCategory() {
    this.loaderService.showLoading();
    this.authService.getOneCategory(this.categoryId).subscribe((res: any) => {
      this.loaderService.closeLoading();
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
    this.loaderService.showLoading();
    this.authService.getProductsByCategory(obj).subscribe((res: any) => {
      this.loaderService.closeLoading();
      if (res.code === 200) {
        this.productList = res.data;
      }
    });
  }

  sortData(event) {
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
    this.loaderService.showLoading();
    this.authService.getSortProducts(obj).subscribe((res: any) => {
      this.loaderService.closeLoading();
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
    this.loaderService.showLoading();
    this.authService.getCategories(reqBody).subscribe(
      data => {
        this.loaderService.closeLoading();
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
    this.loaderService.showLoading();
    this.authService.getProductsByCity(reqBody).subscribe(
      data => {
        this.loaderService.closeLoading();
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

  getProductsOnSubmit() {
    const selectedColor = this.colorForm.value.colors.filter(
      item => item.checked
    );

    const colorArray = selectedColor.map(item => item.name);

    const colorPayload = {
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
    if (colorArray.length)
      this.getProductByColor(colorPayload);
    else if ((this.minValueChange > this.options.floor) || (this.maxValueChange < this.options.ceil) )
      this.getProductByPrice(payload);
    else
      this.getProducts();
  }

  getProductByColor(payload) {
    this.authService.getProductByColor(payload).subscribe(
      resp => {
        this.productList  = resp['data']
      },
      error => {
        console.log(error);
      }
    );
  }

  getProductByPrice(payload) {
    this.authService.getProductByPrice(payload).subscribe(
      data => {
        this.loaderService.closeLoading();
        this.productList  = data['data']
      },
      error => {
        console.log(error);
      }
    );
  }
}
