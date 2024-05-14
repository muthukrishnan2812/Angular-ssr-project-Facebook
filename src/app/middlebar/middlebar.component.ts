import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Observable, timestamp } from 'rxjs';
import { CommonModule } from '@angular/common';
import { log } from 'node:console';

@Component({
  selector: 'app-middlebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './middlebar.component.html',
  styleUrl: './middlebar.component.scss'
})
export class MiddlebarComponent implements OnInit {
posts:any
  constructor(private service:ServiceService) { }

  ngOnInit(): void {
    // this.service.getData().then((items:any)=>{
    //   this.posts.push = items;
    //   console.log(this.posts);
    //   return items
    // })
    this.service.getData().subscribe((item: any) =>{
      console.log('i', item)
      this.posts=item
      console.log('post',this.posts);
    })
  }
  formatTimestamp(timestamp: Date): string {
    return this.service.formatTimestamp(timestamp);
  }
}
