import { Component, Input, HostListener, signal, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-feature-card',
  imports: [RouterLink, Icon],
  templateUrl: './feature-card.html',
  styleUrl: './feature-card.scss',
})
export class FeatureCard {
  // Massima rotazione in gradi per l'effetto parallasse 3D
  // Valori più bassi = effetto più delicato e naturale
  private readonly MAX_ROTATION_DEGREES = 2;

  @Input() routerLink!: string;

  // iconName è il nome dell'icona da renderizzare (es: 'users', 'forms', ecc.)
  // Viene passato al componente Icon che gestisce il rendering tramite @switch
  @Input() iconName!: string;

  @Input() title!: string;
  @Input() description!: string;
  @Input() features!: string[];

  /**
   * EFFETTO PARALLASSE 3D
   *
   * Questo signal contiene il valore CSS transform che viene applicato alla card.
   * Combina tre trasformazioni:
   *
   * 1. perspective(1000px): Crea la profondità 3D, più basso = effetto più marcato
   * 2. rotateX/rotateY: La card ruota seguendo la posizione del mouse
   * 3. scale: Ingrandisce la card (1.05) quando c'è hover, normale (1) altrimenti
   *
   * Il valore viene ricalcolato ad ogni movimento del mouse su tutta la pagina
   */
  transform = signal('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');

  /**
   * Traccia se il mouse è sopra la card
   * Usato per applicare lo scale(1.05) e cambiare colori/sfondo
   */
  private isHovering = signal(false);

  constructor(private elementRef: ElementRef) {}

  /**
   * Attiva lo stato hover quando il mouse entra sulla card
   * Trigger per lo scale e il cambio di colori (gestito via CSS :hover)
   */
  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovering.set(true);
  }

  /**
   * Disattiva lo stato hover quando il mouse esce dalla card
   * La card torna alle dimensioni normali (scale 1)
   */
  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovering.set(false);
  }

  /**
   * CUORE DELL'EFFETTO PARALLASSE
   *
   * Ascolta il movimento del mouse su TUTTA la pagina (document:mousemove)
   * Ad ogni movimento:
   *
   * 1. Ottiene la posizione della card nel viewport (getBoundingClientRect)
   * 2. Calcola la posizione del mouse RELATIVA al centro della card
   *    - Se il mouse è al centro: x=0, y=0 → nessuna rotazione
   *    - Se il mouse è ai bordi: x=±1, y=±1 → rotazione massima
   * 3. Moltiplica per MAX_ROTATION_DEGREES per ottenere i gradi di rotazione
   * 4. rotateX è invertito (-y) per un effetto più naturale:
   *    mouse in alto → card si inclina verso l'alto
   * 5. Applica scale(1.05) se isHovering è true, altrimenti scale(1)
   * 6. Aggiorna il signal transform che è bindato al template
   *
   * Risultato: ogni card "guarda" il mouse indipendentemente dalla sua posizione
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const card = this.elementRef.nativeElement;
    const rect = card.getBoundingClientRect();

    // Normalizza la posizione del mouse rispetto al centro della card
    // Risultato: valori da -1 (sinistra/alto) a +1 (destra/basso)
    const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // Calcola i gradi di rotazione
    // rotateY: positivo = ruota verso destra, negativo = verso sinistra
    // rotateX: negativo = ruota verso l'alto, positivo = verso il basso (invertito con -y)
    const rotateY = x * this.MAX_ROTATION_DEGREES;
    const rotateX = -y * this.MAX_ROTATION_DEGREES;

    // Scala leggermente la card quando c'è hover per un effetto "lift"
    const scale = this.isHovering() ? 1.05 : 1;

    // Applica tutte le trasformazioni insieme
    this.transform.set(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
    );
  }
}
