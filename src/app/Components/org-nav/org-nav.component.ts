import { Component } from '@angular/core';
import { SidebarService } from '../../Services/signup.service';

@Component({
  selector: 'app-org-nav',
  templateUrl: './org-nav.component.html',
  styleUrl: './org-nav.component.css'
})
export class OrgNavComponent {
  isExpanded: boolean = true;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.isExpanded$.subscribe(isExpanded => {
      this.isExpanded = isExpanded;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }
}
