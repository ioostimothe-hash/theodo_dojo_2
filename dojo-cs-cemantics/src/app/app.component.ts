import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from './service/api-client.service';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { catchError, EMPTY } from 'rxjs';
import { DecimalPipe } from '@angular/common';

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
    DecimalPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ApiClientService],
})
export class AppComponent {
  private apiClient = inject(ApiClientService);

  myGuess: string = '';
  hasError = false;
  hasResult = false;
  myResultDistance = 0;

  // Convertit un score entre -1 et 1 en pourcentage entre 0 et 100
  get scorePercentage(): number {
    return Math.max(0, Math.min(100, (this.myResultDistance + 1) * 50));
  }

  sendMyGuess() {
    const guess = this.myGuess.trim();

    if (!guess) {
      return;
    }

    this.hasError = false;
    this.hasResult = false;
    this.myResultDistance = 0;

    this.apiClient
      .getPokemonValue({ value: guess })
      .pipe(
        catchError((err) => {
          console.error('Erreur API :', err);
          this.hasError = true;
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        console.log('Réponse API complète :', response);
        console.log('Score reçu :', response.result);

        const score = Number(response.result);

        if (!Number.isFinite(score)) {
          this.hasError = true;
          return;
        }

        this.hasError = false;
        this.myResultDistance = score;
        this.hasResult = true;
      });
  }
}
