import { Component, OnInit, booleanAttribute } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable:true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_image: new FormControl<string>('')
  })

  public publishers = [
    { id: 'DC Comics', value: 'DC - Comics' },
    { id: 'Marvel Comics', value: 'Marvel - Comics' }
  ]

  constructor(
    private herosService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) {  }

  ngOnInit(): void {
    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.herosService.getHeroById(id) )
      ).subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/') 
        this.heroForm.reset(hero)
        return;
      })
      
  }

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;
    return hero
  }

  onSubmit():void{
    if (this.currentHero.id) {
      this.herosService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.router.navigateByUrl('/');
          this.showMessage('Heroe actualizado')
        })
      
      return;
    }

    this.herosService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit', hero.id])
        this.showMessage('Heroe añadido a la base de datos');
      })

  }

  onDeleteHero():void{
    if( !this.currentHero.id ) throw Error('ID is required')

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result:boolean) => result),
        switchMap( () => this.herosService.deleteHeroById(this.currentHero.id) ),
        filter( (wasDeleted:boolean) => wasDeleted )
      )
      .subscribe(result => {
        this.router.navigate(['/heroes']);
    })

  
  }

  showMessage(msg:string):void{
    this.snackbar.open(msg, 'done', { duration: 2500 })
  }

  


}
