import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import {jsPDF} from 'jspdf';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.css']
})
export class PrintInvoiceComponent implements OnInit {

  orderId: string;
  invoiceDetails: any = {};
  constructor(
    private router: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.orderId = this.router.snapshot.url[1].path;
    this.getInvoiceDetails();
    $(document).ready(function(){
      var doc = new jsPDF();
      var specialElementHandlers = {
        '#editor': function (element, renderer) {
          return true;
        }
      };

      $('.downloadPDF').on('click', function () {
        // doc.fromHTML($('#content').html(), 15, 15, {
        //   'width': 170,
        //   'elementHandlers': specialElementHandlers
        // });
        // doc.save('sample-file.pdf');
      });
    });
  }

  getInvoiceDetails() {
    this.authService.getInvoiceDetails(this.orderId).subscribe((resp: any) => {
      if (resp.code === 200) {
        this.invoiceDetails = resp['data'];
      }
    })
  }

  totalCalculate(quantity, orderPrice) {
    return quantity * orderPrice;
  }
}
