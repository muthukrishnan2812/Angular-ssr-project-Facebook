import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-middlebar',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './middlebar.component.html',
  styleUrl: './middlebar.component.scss',
  standalone: true,
})
export class MiddlebarComponent implements OnInit {
  posts!: Observable<any>
  imageUrl: string[] = []
  body: string = ''
  commandText: string = '';
  selectedPostId: any
  constructor(private service: ServiceService) { }

  ngOnInit(): void {
    this.posts = this.service.getData();
    console.log(this.posts);//getting data in observable format
    this.posts.subscribe((item: any) => {
      console.log(item);// getting data in object format
    })
  }
  formatTimestamp(timestamp: Date): string {
    return this.service.formatTimestamp(timestamp);
  }
  async onFileChange(event: any): Promise<void> {
    await this.service.onFileChange(event);
  }
  async addPost(): Promise<void> {
    this.service.body = this.body
    await this.service.addPost();
  }
  deletePost(postId: any) {
    return this.service.deletePost(postId)
  }
  async commandPost(postId: any): Promise<void> {
    this.service.commandText = this.commandText
    await this.service.commandPost(postId);
    this.commandText = ''
  }
  async toggleLike(postId: any) {
    await this.service.toggleLike(postId)
  }

}
