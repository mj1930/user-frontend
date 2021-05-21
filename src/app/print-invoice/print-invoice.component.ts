import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {jsPDF} from 'jspdf';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.css']
})
export class PrintInvoiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

}
