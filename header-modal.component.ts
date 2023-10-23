import {Component, Input, OnInit} from '@angular/core';
import { ModalService } from '../modal.service'
import { sharedModules } from '../shared/shared.module'
@Component({
  selector: 'app-header-modal',
  templateUrl: './header-modal.component.html',
  styleUrls: ['./header-modal.component.scss'],
  standalone: true,
  imports: [ sharedModules ]
})
export class HeaderModalComponent  implements OnInit {
  @Input() title: string = ''
  constructor(private modalService: ModalService) { }

  ngOnInit() {}

  closeModal(): void {
    this.modalService.dismissModal()
  }
}
