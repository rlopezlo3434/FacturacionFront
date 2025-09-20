import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  constructor() {
    this.initTheme();
  }


  toggleTheme(): void {
    const htmlEl = document.documentElement;
    htmlEl.classList.toggle('dark-theme');

    const isDark = htmlEl.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }
}
