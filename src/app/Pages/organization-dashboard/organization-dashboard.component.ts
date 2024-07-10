import { Component } from '@angular/core';
import { SidebarService } from '../../Services/signup.service';

@Component({
  selector: 'app-organization-dashboard',
  templateUrl: './organization-dashboard.component.html',
  styleUrl: './organization-dashboard.component.css',
})
export class OrganizationDashboardComponent {
  isExpanded: boolean = true;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isExpanded$.subscribe((isExpanded) => {
      this.isExpanded = isExpanded;
    });
  }
}
