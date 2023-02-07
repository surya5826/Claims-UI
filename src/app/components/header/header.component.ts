import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() dashboard: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toggleMenu(){
    console.log(this.dashboard.toggle());
  }
  public onLogOut() {
    localStorage.removeItem('userDetails');
    this.router.navigate(['login']);
  }

}
