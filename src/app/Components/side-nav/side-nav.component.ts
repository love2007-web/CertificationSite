import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../Services/signup.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {
  isExpanded: boolean = true;

  menuItems = [
    { icon: 'home', text: 'Home' },
    { icon: 'person', text: 'Profile' },
    { icon: 'settings', text: 'Settings' },
    // Add more menu items as needed
  ];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isExpanded$.subscribe(isExpanded => {
      this.isExpanded = isExpanded;
    });
  }
}
