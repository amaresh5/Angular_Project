import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DbService } from "./db.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {

  constructor(private _fb: FormBuilder, private dbSrv: DbService) {}
  // @ts-ignore
  bookingForm: FormGroup;
  public data$: Observable<any> | undefined;
  public sevenSeater = [1, 2, 3, 4, 5, 6, 7];
  public message = "";
  total: number = 0;
  booked: number = 0;
  rem: number=0;
  bookings:any[]=[];
  value = '';

  onKey(event: any) {
    this.value = event.target.value;
  }

  ngOnInit(): void {
    this.createForm();
    this.data$ = this.dbSrv.data.pipe(tap(d => (this.rem = d.rem)));
  }

  createForm() {
    this.bookingForm = this._fb.group({
      seatsToBook: ["", Validators.required]
    });
  }

  getSeatNum(n: number, row: number): number {
    return (row - 1) * 7 + n;
  }

  checkBook(n: number, row: number, bs: number[]): boolean {
    const seat = this.getSeatNum(n, row);
    return bs.some(bs => bs === seat);
  }

  book() {
    if (!this.bookingForm.valid) return;
    let { seatsToBook } = this.bookingForm.value;
    if (seatsToBook > 6) {
      this.message = "Maximum 6 seats allowed";
      this.hideMessage();
      return;
    }
    if (seatsToBook <= 0) {
      this.message = "Choose Minimum 1 Seat";
      this.hideMessage();
      return;
    }
    if (seatsToBook > 0 && seatsToBook<=6) {
      setTimeout(() => {
          this.value = "";
          this.bookings = [];
      }, 1000);
    }
    if (this.rem < seatsToBook) {
      this.message = `Only ${this.rem} seats available`;
      this.hideMessage();
      return;
    }
    const [bookedSeats, rem] = this.dbSrv.bookSeats(seatsToBook);
     this.rem = rem as number; 
     this.bookings.unshift({
      seats: bookedSeats
    });
  }
  hideMessage(t = 3000) {
    setTimeout(() => (this.message = ""), t);
  }
}
