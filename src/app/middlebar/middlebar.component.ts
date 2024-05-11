import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-middlebar',
  standalone: true,
  imports: [],
  templateUrl: './middlebar.component.html',
  styleUrl: './middlebar.component.scss'
})
export class MiddlebarComponent implements OnInit {
posts:any
  constructor(private service:ServiceService) { }

  ngOnInit(): void {
    this.service.getData();
  }
}
