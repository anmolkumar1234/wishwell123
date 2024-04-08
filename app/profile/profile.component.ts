import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceBackend } from '../service-backend.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  selectedOption: string = 'profile';
  userProfile: any={};
  newBalance:any=0;
  editMode: any = {}; // Object to track edit mode for each field
  donations: any[] = []; // Example donations data
  totalBalance: number = 1000; // Example total balance
  campaignData: any={
    cause: '',
    title: '',
    description: '',
    goal_amount: null,
    start_date: null,
    end_date: null,
    beneficiary_name: '',
    beneficiary_age: null,
    beneficiary_city: '',
    beneficiary_mobile: ''
  };
  userCampaigns:any=[];

  constructor(private router: Router, private serviceBackend: ServiceBackend, private authService: AuthService) {}

  ngOnInit(): void {
    this.showProfile();
  }

  showProfile() {
    this.serviceBackend.getUserProfile()
      .then(userProfile => {
        console.log(userProfile);

        console.log(userProfile.userData);
        this.userProfile = userProfile.userData;
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }

  downloadReceipt(donation: any) {
    // Generate HTML content for the receipt
    const receiptContent = `
     
    <div style="text-align: center;">
    <h1>DONATION RECIPT</h1>
    <table style="border-collapse: collapse; width: 80%; margin: auto; border: 1px solid #ddd;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Donor ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Campaign ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Amount</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Transaction Date</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border: 1px solid #ddd;">
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.donor_id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.campaign_id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.amount}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${donation.transaction_date}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
    `;

    // Convert HTML content to a Blob object
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${donation.id}.html`; // Set the filename
    link.click();

    // Release the URL object
    window.URL.revokeObjectURL(url);
  }

  addBalance(){
    this.serviceBackend.updateUser({'balance':Number(this.userProfile.balance)+Number(this.newBalance)}).then(
      data=>{
        this.showProfile();
        this.totalBalance = this.userProfile.balance + this.newBalance;
        this.newBalance = 0;
      })
 
  }


  profile(){
    this.selectedOption = 'profile';
  }

  showDonations() {
    this.selectedOption = 'donations';
    this.serviceBackend.userDonationsById().then(data=>this.donations=data.data)
  }

  showBalance() {
    this.selectedOption = 'balance';
    this.totalBalance = this.userProfile.balance;
  }

  showMyCampaigns() {
    this.selectedOption = 'myCampaigns';
    this.serviceBackend.getAllCampaignBySameUserId().then(data=>{
      this.userCampaigns= data.data.campaigns;
      console.log(this.userCampaigns)
      });
  }

  visitCampaign(campid:any){
    this.router.navigate(['/details/'+campid]);
  }

  toggleEditMode(field: string) {
    this.editMode[field] = !this.editMode[field];
  }

  saveChanges(field: string) {
    // Implement save changes logic here
    this.serviceBackend.updateUser({"name":this.userProfile.name})
    this.toggleEditMode(field);
    
  }

  deleteCampaign(campId:any){
    
    this.serviceBackend.deleteCampaign(campId);
    this.showMyCampaigns()
    
  }


  cancelEdit(field: string) {
    // Implement cancel edit logic here
    this.toggleEditMode(field);
  }

  CreateCampaign() {
    this.selectedOption = 'CreateCampaign';
  }

  createCampaignEntry() {
    // Add logic to handle form submission and campaign creation
    console.log('Campaign created with data:', this.campaignData);

    let data = this.serviceBackend.createCampaign(this.campaignData).then(response => {
      console.log('camp creation successful:', response);  
    });
    


    // Reset the form after submission
    this.resetForm();
    // Switch back to the default view after campaign creation
    this.showMyCampaigns(); // Change to whichever default view you prefer
  }

  cancelCreateCampaign() {
    // Reset the form and switch back to the default view
    this.resetForm();
    this.showBalance(); // Change to whichever default view you prefer
  }

  deactivateCampaign(campId:any){
    this.serviceBackend.deactivateCampaign(campId).then(data=>{
      this.showMyCampaigns();
    })
  }
  activateCampaign(campId:any){

    this.serviceBackend.activateCampaign(campId).then(data=>{
      this.showMyCampaigns();
    });
  }

  resetForm() {
    // Reset campaign data
    this.campaignData = {
      cause: '',
      title: '',
      description: '',
      goalAmount: null,
      startDate: null,
      endDate: null,
      beneficiaryName: '',
      beneficiaryAge: null,
      beneficiaryCity: '',
      beneficiaryMobile: ''
    };
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to the login page after logout
  }
}
