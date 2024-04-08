// register.component.ts

import { Component } from '@angular/core';
import { ServiceBackend } from '../service-backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedRole: string = 'donor'; // Set the default role to 'donor'
  name: string = '';
  email: string = '';
  dob: string = '';
  sex: string = '';
  pan: string = '';
  address: string = '';
  city: string = '';
  password: string = '';

  constructor(private serviceBackend : ServiceBackend,private router:Router) {  }

  register() {

   
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.selectedRole,
      sex: this.sex,
      dob: this.dob,
      pan: this.pan,
      address: this.address,
      city: this.city
    };

    // Assuming registerPost returns a Promise, you may want to handle the response using then/catch
    this.serviceBackend.registerPost(data)
      .then(response => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Registration failed:', error);
      });
  }
}
