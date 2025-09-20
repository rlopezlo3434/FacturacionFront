import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { SidebarService } from '../../../services/sidebar.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  iconName = 'bedtime';
  today: string;

  constructor(private themeService: ThemeService, private sidebarService: SidebarService) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.today = `${day}/${month}/${year}`;
  }

  toggleTheme() {
    this.themeService.toggleTheme();

    const isDark = document.documentElement.classList.contains('dark-theme');
    this.iconName = isDark ? 'bedtime' : 'wb_sunny';
  }

  openMenu() {
    this.sidebarService.toggleSidenav();
  }
}
