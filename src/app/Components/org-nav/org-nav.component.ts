import { Component } from '@angular/core';
import { SidebarService } from '../../Services/signup.service';

@Component({
  selector: 'app-org-nav',
  templateUrl: './org-nav.component.html',
  styleUrl: './org-nav.component.css'
})
export class OrgNavComponent {
  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
