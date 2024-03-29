import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {

  public searchImput = new FormControl('');
  public heroes:Hero[] = []
  public selectedHero?:Hero;



  constructor(private heroesService: HeroesService) { }

  searchValue(){
    const value:string = this.searchImput.value || '';
    this.heroesService.getSuggestionHero(value)
      .subscribe(heroes => this.heroes = heroes)
  }

  onSelectedOption(event:MatAutocompleteSelectedEvent):void{
    if (!event.option.value) {
      this.selectedHero = undefined
      return;
    }

    const hero: Hero = event.option.value;
    this.searchImput.setValue(hero.superhero) 
    this.selectedHero = hero;
  }
}
