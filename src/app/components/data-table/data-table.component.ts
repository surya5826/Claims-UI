import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import * as XLSX from 'xlsx';
import { DetailsModalComponent } from "./details-modal/details-modal.component"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClaimsDetailsComponent } from '../claims-details/claims-details.component';
import { ClaimsApiService } from 'src/app/claims-api.service';
import { zip } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
	// encapsulation: ViewEncapsulation.None,
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.css'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class DataTableComponent implements OnInit {
	@Input() rows: any[] = [];
	@Output() newItemEvent: any = new EventEmitter();
	@Input() showActions: boolean = true;
	@Input() set facilityId(id: string) {
		this.facilityChange = id;
		// this.facilityCheck();
		this.ngOnInit();
	};
	showGrid = true;
	facilityChange: string = '';
	sortingfilters = false;
	campaignOne = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	campaignTwo = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	tableType = "claim";
	public columns = [{
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
		type: "text",
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
	}];
	public filteredColumns: any;
	public ColumnMode = ColumnMode;
	public rowHeight = 40;
	public show = false;
	selected = [];
	mySelection = [];
	SelectionType = SelectionType;
	filteredRows: any[] = [];
	filteredObject: any;
	filteredRowsAutoFill: any = {};
	storedRows: any = [];
	constructor(public dialog: MatDialog, private http: ClaimsApiService, private cd: ChangeDetectorRef) {
	}
	ngOnInit(): void {
		this.showGrid = false;
		this.filteredColumns = this.columns.filter(column => column.show === true);
		this.http.getClaimByFacility(this.facilityChange).subscribe((data: any) => {
			// this.rows = data;
			if (data.length > 0) {
				data = data.reverse();

			}
			this.storedRows = data.map((item: any, index: number) => {
				if (!item.creationDate) {
					item.creationDate = this.rows[index].date
				}
				item.claimedAmount = Number(item.claimedAmount ? item.claimedAmount : 0);

				return { ...this.rows[index], ...item }
			});
			this.filteredRows = data.map((item: any, index: number) => {
				if (!item.creationDate) {
					item.creationDate = this.rows[index].date
				}
				item.claimedAmount = '$' + Number(item.claimedAmount ? item.claimedAmount : 0);

				return { ...this.rows[index], ...item }
			});
			this.showGrid = true;

		})
		this.cd.markForCheck();

		this.filteredRowsAutoFill = this.columns.map((item: any) => item.props);
		this.campaignOne.valueChanges.subscribe(data => {
			if (data.start && data.end) {
				this.filteredRows = this.storedRows.filter((item: any) => {

					let dateCheck = new Date(item.creationDate);

					let lowDate = new Date(data.start);
					let highDate = new Date(data.end);
					console.log(highDate.getTime());

					if (dateCheck.getTime() <= highDate.getTime() && dateCheck.getTime() >= lowDate.getTime()) {
						return true;
					} else return false;
				})
			}
		})
	}

	public togglecolumnCheckbox(column: any) {
		const isChecked = column.show;
		column.show = !isChecked;
		this.filteredColumns = this.columns.filter(item => item.show);
	}

	public onExportToExcel() {
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredRows);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'claims.xlsx');
	}
	openDialog(row: any) {
		const dialogRef = this.dialog.open(DetailsModalComponent, {
			height: '600px',
			width: '1000px', data: row, autoFocus: false
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	editItem(row: any, index: any) {
		const dialogRef = this.dialog.open(ClaimsDetailsComponent, { data: { orders: this.http.getOrders(), rowData: row }, autoFocus: false });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				location.reload();
			}
		});
	}

	facilityList: any = [];
	customerList: any = [];
	filtersOption: any = {};
	filteredApplied(event: any, props: string) {
		this.filtersOption[props] = event.target.value;
		this.filteredRows = this.storedRows;
		for (let filter of Object.keys(this.filtersOption)) {
			if (this.filtersOption[filter] != '') {
				this.filteredRows = this.filteredRows.filter(row => {
					return row[filter].indexOf(this.filtersOption[filter]) > -1 ? 1 : 0;
				})
			}
		}
	}

	resetValue = new FormControl();
	resetFilterApplied() {
		this.filtersOption = {};
		this.resetValue.reset();
		this.filteredRows = this.storedRows;

	}
}

@Component({
	// encapsulation: ViewEncapsulation.None,
	selector: 'app-data-order-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.css'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class DataTableOrdersComponent implements OnInit {
	@Input() rows: any[] = [];
	@Output() newItemEvent: any = new EventEmitter();
	@Input() showActions: boolean = true;
	sortingfilters = false;
	campaignOne = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	showGrid = true;

	campaignTwo = new FormGroup({
		start: new FormControl(),
		end: new FormControl(),
	});
	tableType = "order";
	public columns = [{
		name: "Item",
		props: "item",
		type: "number",
		show: true
	}, {
		name: "Description",
		props: "des",
		type: "text",
		show: true
	}, {
		name: "Date Code",
		props: "dateCode",
		type: "Date",
		show: true
	}, {
		name: "Lot",
		props: "lot",
		type: "text",
		show: true
	}, {
		name: "Quantity",
		props: "quantity",
		type: "text",
		show: true
	}, {
		name: "LPN",
		props: "LPN",
		type: "text",
		show: true
	}, {
		name: "NET",
		props: "NET",
		type: "text",
		show: true
	}, {
		name: "Customer Reference",
		props: "customerReference",
		type: "text",
		show: false
	}, {
		name: "AMC Refenrence",
		props: "AMCRefenrence",
		type: "number",
		show: false
	}, {
		name: "Facility ID",
		props: "facilityId",
		type: "number",
		show: false
	}, {
		name: "Customer ID",
		props: "customerId",
		type: "number",
		show: false
	}];
	public filteredColumns: any;
	public ColumnMode = ColumnMode;
	public rowHeight = 40;
	public show = false;
	selected = [];
	mySelection = [];
	SelectionType = SelectionType;
	filteredRows: any[] = [];
	addedClaims: any = [];
	facilityList: any = [];
	customerList: any = [];
	filteredObject = this._formBuilder.group({
		facility: [''],
		customer: ['']
	})
	constructor(public dialog: MatDialog, private http: ClaimsApiService, private _formBuilder: FormBuilder,
		private cd: ChangeDetectorRef, private toastr: ToastrService) {
	}

	ngOnInit(): void {
		this.filteredColumns = this.columns.filter(column => column.show === true);
		this.filteredRows = this.rows;
		let source$ = zip(this.http.getFacility(), this.http.getCustomer());
		source$.subscribe(([facility, Customer]) => {

			this.facilityList = facility;
			this.customerList = Customer;

		})
	}
	public togglecolumnCheckbox(column: any) {
		const isChecked = column.show;
		column.show = !isChecked;
		this.filteredColumns = this.columns.filter(item => item.show);
	}

	public onExportToExcel() {
		try {
			this.toastr.success('Export Excel', 'Export to Excel Success!');

			const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredRows);
			const wb: XLSX.WorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
			XLSX.writeFile(wb, 'claims.xlsx');
		} catch (e) {
			this.toastr.warning('Export Excel', 'Export to Excel Failed!');

		}

	}
	openDialog(row: any) {
		const dialogRef = this.dialog.open(DetailsModalComponent, {
			height: '400px',
			width: '600px', data: row, autoFocus: false
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}
	editItem(row: any, index: any) {
		this.toastr.info('Order Selected', 'Claim Details');

		this.addedClaims.push(row);
		this.newItemEvent.emit(this.addedClaims);
		// const dialogRef = this.dialog.open(ClaimsDetailsComponent, { data: { orders: this.http.getOrders() }, autoFocus: false });

		// dialogRef.afterClosed().subscribe(result => {
		// 	console.log(`Dialog result: ${result}`);
		// });
	}
	filtersOption: any = {};
	filteredApplied(event: any, props: string) {
		this.filtersOption[props] = event.target.value;
		this.filteredRows = this.rows;
		for (let filter of Object.keys(this.filtersOption)) {
			if (this.filtersOption[filter] != '') {
				this.filteredRows = this.filteredRows.filter(row => {
					return row[filter].toString().indexOf(this.filtersOption[filter]) > -1 ? 1 : 0;
				})
			}
		}
	}

	resetValue = new FormControl();
	resetFilterApplied() {
		this.filtersOption = {};
		this.resetValue.reset();
		this.filteredRows = this.rows;

	}
}