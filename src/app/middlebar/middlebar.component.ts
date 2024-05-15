import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-middlebar',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './middlebar.component.html',
  styleUrl: './middlebar.component.scss',
  standalone: true,
})
export class MiddlebarComponent implements OnInit {
  posts: any
  imageUrl: string[] = []
  body: string = ''
  commandText:string='';
  selectedPostId:any
  constructor(private service: ServiceService) { }

  ngOnInit(): void {
    this.service.getData().subscribe((item: any) => {
      console.log('i', item)
      this.posts = item
      console.log('post', this.posts);
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
  async commandPost(postId: any):Promise<void> {
    this.service.commandText=this.commandText
    await this.service.commandPost(postId);
    this.commandText=''
  }
  async toggleLike(postId:any){
    await this.service.toggleLike(postId)
  }
  

}
