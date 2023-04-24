import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css'],
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  public authForm!: FormGroup;
  public loginSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private auth: Auth,
    private afs: Firestore
  ) {}

  ngOnInit(): void {
    this.initAuthForm();
  }

  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  loginUser(): void {
    const { email, password } = this.authForm.value;
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
    this.loginSubscription = docData(
      doc(this.afs, 'users', credential.user.uid)
    ).subscribe(
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

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
