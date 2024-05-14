import { Injectable, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, orderBy,query } from '@angular/fire/firestore';

import { Observable, timestamp } from 'rxjs';
interface Post {
  id: string, // Assuming the ID is a string
  body: string,
  imageUrl: string[],
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  post$!: Observable<any[]>;

  constructor(private fire: Firestore) {}

  getData(){
    const itemCollection = collection(this.fire, 'notes');
    const itemQuery = query(itemCollection, orderBy('createdAt', 'desc'));
    return collectionData(itemQuery, { idField: 'id' })
  }
  formatTimestamp(timestamp: any) {
    if (timestamp) {
      const now = new Date();
      const postDate = timestamp.toDate();
      const diff = now.getTime() - postDate.getTime(); // Difference in milliseconds
      const diffHours = diff / (1000 * 60 * 60); // Convert difference to hours

      if (diffHours < 1) {
        // Less than 1 hour, display minutes
        const diffMinutes = Math.round(diff / (1000 * 60)); // Convert difference to minutes
        return diffMinutes + ' minutes ago';
      } else if (diffHours >= 1 && diffHours < 24) {
        // Between 1 and 24 hours, display hours
        return Math.round(diffHours) + ' hours ago';
      } else {
        // More than 24 hours, display date
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return postDate.toLocaleDateString('en-US', options);
      }
    } else {
      return ''; // or any default value you prefer if timestamp is missing
    }
  }
}
