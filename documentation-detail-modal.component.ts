import {Component, Input, OnInit} from '@angular/core';
import * as PDFJS from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
@Component({
  selector: 'app-documentation-detail-modal',
  templateUrl: './documentation-detail-modal.component.html',
  styleUrls: ['./documentation-detail-modal.component.scss'],
})


export class DocumentationDetailModalComponent  implements OnInit {
  // @ts-ignore
  @Input() url: { src: string, type: string };

  constructor() {}

  ngOnInit() {

  }


}
