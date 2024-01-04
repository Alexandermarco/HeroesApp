import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  constructor(private http:HttpClient) { }

  private baseUrl = environments.baseUrl;

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroById(id: string):Observable<Hero | undefined>{
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
            .pipe(
              catchError( error => of(undefined) )
            )
  }

  getSuggestionHero(query:string):Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`)
  }

  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero)
  }

  updateHero(hero:Hero):Observable<Hero>{
    if ( !hero.id ) throw Error('id is required');

    return this.http.put<Hero>(`${this.baseUrl}/heroes/${ hero.id }`, hero)
  }

  deleteHeroById(id:string):Observable<boolean>{

    return this.http.delete(`${this.baseUrl}/heroes/${ id }`)
            .pipe(
              map(res => true),
              catchError(err => of(false))
            )
  }

}
