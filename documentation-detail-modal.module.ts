import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HeaderModalComponent} from "../header-modal/header-modal.component";
import {IonicModule} from "@ionic/angular";
import {DocumentationDetailModalComponent} from "./documentation-detail-modal.component";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {NgIf} from "@angular/common";

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    HeaderModalComponent,
    PdfViewerModule,
    NgIf,

  ],
  declarations: [DocumentationDetailModalComponent],
  bootstrap: [DocumentationDetailModalComponent],
  exports: [
    DocumentationDetailModalComponent
  ]
})

export class DocumentationDetailModalModule {}

