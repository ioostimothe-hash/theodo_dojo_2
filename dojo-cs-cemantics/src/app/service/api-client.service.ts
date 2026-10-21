import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseWord } from '../model/responseWord.model';
import { GuessWord } from '../model/guessWord.model';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private httpClient = inject(HttpClient);

  public getPokemonValue(guess: GuessWord): Observable<ResponseWord> {
    const word = encodeURIComponent(guess.value);

    return this.httpClient.get<ResponseWord>(
      `https://theodo-dojo-2.ioostimothe-hash.deno.net/?word=${word}`,
    );
  }
}
