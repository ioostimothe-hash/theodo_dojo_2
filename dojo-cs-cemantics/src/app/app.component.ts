import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from './service/api-client.service';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    Button,
    ProgressBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ApiClientService],
})
export class AppComponent {
  private apiClient = inject(ApiClientService);

  myGuess: string = '';
  hasError = false;
  myResultDistance = 0;

  sendMyGuess() {
    const guess = this.myGuess.trim();

    if (!guess) {
      console.error('Pas le bon guess');
      return;
    }

    this.hasError = false;
    this.myResultDistance = 0;

    this.apiClient
      .getPokemonValue({
        value: guess,
      })
      .pipe(
        catchError((err) => {
          console.error('Erreur API :', err);
          this.myResultDistance = 0;
          this.hasError = true;
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.hasError = false;
        this.myResultDistance = result.value;
      });
  }
}
