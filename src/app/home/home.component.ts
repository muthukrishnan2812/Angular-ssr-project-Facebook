import { Component } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { LeftbarComponent } from '../leftbar/leftbar.component';
import { RightbarComponent } from '../rightbar/rightbar.component';
import { MiddlebarComponent } from '../middlebar/middlebar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LeftbarComponent,RightbarComponent,MiddlebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
