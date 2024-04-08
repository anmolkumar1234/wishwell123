import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  message: string | undefined;
  isVisible: boolean = false;
  messageType: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  showMessage(message: string, type: string): void {
    this.message = message;
    this.messageType = type;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000); // Hide toast after 3 seconds
  }
}
