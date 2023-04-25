import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],
})
export class AuthDialogComponent implements OnInit {
  public authUserForm!: FormGroup;
  public isRegistred = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private accountService: AccountService,
    private router: Router,
    private auth: Auth,
    private afs: Firestore
  ) {}

  ngOnInit(): void {
    this.initauthUserForm();
  }

  initauthUserForm(): void {
    this.authUserForm = this.fb.group({
      firstName: [null],
      lastName: [null],
      phone: [null],
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  changeRegistred(): void {
    this.isRegistred = !this.isRegistred;
  }

  loginUser(): void {
    const { email, password } = this.authUserForm.value;
    this.login(email, password)
      .then(() => {
        console.log('login done');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    docData(doc(this.afs, 'users', credential.user.uid)).subscribe(
      (user) => {
        const currentUser = { ...user, uid: credential.user.uid };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.accountService.isUserLogin$.next(true);
        if (user && user.role === ROLE.USER) {
          this.router.navigate(['/cabinet']);
        } else if (user && user.role === ROLE.ADMIN) {
          this.router.navigate(['/admin']);
        }
      },
      (e) => {
        console.log('error', e);
      }
    );
  }

  registerUser(): void {
    const { email, password } = this.authUserForm.value;
    this.emailSignUp(email, password)
      .then(() => {
        this.isRegistred = !this.isRegistred;
        this.authUserForm.reset();
      })
      .catch((e) => {
        console.error(e.message);
      });
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = {
      email: credential.user.email,
      firstName: this.authUserForm.value.firstName,
      lastName: this.authUserForm.value.lastName,
      phone: this.authUserForm.value.phone,
      address: '',
      orders: [],
      role: 'USER',
    };
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }
}
