import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClaimsApiService } from 'src/app/claims-api.service';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.css']
})
export class DetailsModalComponent implements OnInit {

  date = '11/29/2022';
  claimData: any = {};
  columns: any = [{
		name: "Date",
		props: "creationDate",
		type: "Date",
		show: true
	}, {
		name: "Status",
		props: "claimStatus",
		type: "text",
		show: true
	}, {
		name: "Master Acct",
		props: "masterAcct",
		type: "text",
		show: true
	}, {
		name: "Document Type",
		props: "documentType",
		type: "text",
		show: true
	},
	{
		name: "Facility",
		props: "facilityId",
		type: "text",
		show: true
	}, {
		name: "Account",
		props: "account",
		type: "text",
		show: true
	}, {
		name: "Amc Claim",
		props: "serviceProviderClaimId",
		type: "text",
		show: true
	}, {
		name: "Claim Type",
		props: "claimType",
		type: "text",
		show: true
	}, {
		name: "Category",
		props: "category",
		type: "text",
		show: true
	}, {
		name: "Pallet Quantity",
		props: "palletQuantity",
		type: "number",
		show: false
	}, {
		name: "Claimed Amount",
		props: "claimedAmount",
		type: "number",
		show: false
	}, 
	{
		name: "Paid Amount",
		props: "paidAmount",
		type: "number",
		show: false
	}, {
		name: "Date Closed",
		props: "dateClosed",
		type: "Date",
		show: false
	}, {
		name: "Carrier",
		props: "carrier",
		type: "text",
		show: false
	}, {
		name: "Load Number",
		props: "loadNumber",
		type: "number",
		show: false
	}]
  constructor(public dialogRef: MatDialogRef<DetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: ClaimsApiService) { }

  ngOnInit(): void {
    this.http.getClaimsById(this.data.serviceProviderClaimId).subscribe(claim => {
      this.claimData = claim;
      // this.columns = Object.keys(this.claimData);
      console.log("modal data", claim, this.columns)

    })
  }
  // {"id":"6377cda207503332d24c96cd","claimId":"1","facilityId":"LAA0000","palletQuantity":44,"documentType":"outbound order","claimedAmount":"$878.15 ","serviceProviderClaimId":166626,"claimStatus":"Closed","claimType":"WAREHOUSE","creationDate":null,"lastUpdateDate":null,"claimCloseDate":null}
}
