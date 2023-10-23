import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'
import {RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


export const sharedModules: any[] = [
  CommonModule,
  IonicModule,
  RouterLink
]
export const sharedFormModules: any[] = [
  FormsModule,
  ReactiveFormsModule,
]
