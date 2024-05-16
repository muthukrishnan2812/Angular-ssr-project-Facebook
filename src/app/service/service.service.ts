import { Injectable, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { deleteDoc, doc, updateDoc, getDoc, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Storage } from '@angular/fire/storage';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Observable } from 'rxjs';
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
  body: any;
  imageUrl: string[] = [];
  reader: any;
  commandText: string = '';
  constructor(private fire: Firestore, private storage: Storage) { }

  getData():Observable<any[]> {
    const itemCollection = collection(this.fire, 'notes');
    const itemQuery = query(itemCollection, orderBy('createdAt', 'desc'));
    return collectionData(itemQuery, { idField: 'id' })
  }
  formatTimestamp(timestamp: any) {
    if (timestamp) {
      const now = new Date();
      const postDate = timestamp.toDate();
      const diff = now.getTime() - postDate.getTime();
      const diffHours = diff / (1000 * 60 * 60);

      if (diffHours < 1) {
        // Less than 1 hour, display minutes
        const diffMinutes = Math.round(diff / (1000 * 60));
        return diffMinutes + ' minutes ago';
      } else if (diffHours >= 1 && diffHours < 24) {
        return Math.round(diffHours) + ' hours ago';
      } else {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return postDate.toLocaleDateString('en-US', options);
      }
    } else {
      return '';
    }
  }
  async onFileChange(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      // Display preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
      };
      reader.readAsDataURL(file);

      const storage = getStorage();
      const path = `fbpost/${file.name}`;
      const storageRef = ref(storage, path);

      try {
        // Upload the file and get a task for monitoring the progress
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Wait for the upload to complete
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => resolve());
        });

        // Get the download URL
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        console.log(url);

        // Ensure this.imageUrl is initialized as an array
        if (!Array.isArray(this.imageUrl)) {
          this.imageUrl = [];
        }
        this.imageUrl.push(url); // Store the URL in the array
        console.log(this.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  addPost() {
    if (this.body.trim() !== '') {
      const previewImage = document.getElementById('previewImage') as HTMLImageElement;
      previewImage.style.display = 'none';
      const post = {
        body: this.body,
        imageUrl: this.imageUrl,
        createdAt: new Date()
      };
      const itemCollection = collection(this.fire, 'notes')
      addDoc(itemCollection, post)
      this.body = ''; // Clear the input field after adding post
      this.imageUrl = [];
      this.reader = '';
      console.warn('body is empty', this.body.trim == '');
    } else {
      console.warn('Body cannot be empty!');
    }
  }
  async deletePost(postId: string): Promise<void> {
    // const postRef = this.fire.collection('notes').doc(postId);
    const postRef = doc(this.fire, 'notes', postId)
    await deleteDoc(postRef)
    alert('post deleted succesfully');
    console.log('post deleted succesfully', 'postid->', postId, 'postobj->', postRef);
  }
  async commandPost(postId: string): Promise<void> {
    const postReference = doc(this.fire, 'notes', postId)
    await updateDoc(postReference, {
      command: this.commandText
    })
  }
  async toggleLike(postId: string): Promise<void> {
    const postReff = doc(this.fire, 'notes', postId)
    console.log(postReff);
    const docSnap = getDoc(postReff)
    if ((await docSnap).exists()) {
      const postData = (await docSnap).data() as { likes: number, liked: boolean };
      if (isNaN(postData.likes)) {
        postData.likes = 0;
      }
      postData.likes += postData.likes ? -1 : 1;
      console.log(postData.likes ? 'liked' : 'unliked');
      await updateDoc(postReff, { likes: postData.likes })
      console.log(postReff ? 'post liked' : 'unliked successfully');
    }
  }
}
