import { Component, signal, computed, effect } from '@angular/core';
import { PageHeader } from '../page-header/page-header';

@Component({
  selector: 'app-signals',
  imports: [PageHeader],
  templateUrl: './signals.html',
  styleUrl: './signals.scss',
})
export class Signals {
  // ═══════════════════════════════════════════════════════════════════
  // 1. WRITABLE SIGNAL - Signal che può essere modificato
  // ═══════════════════════════════════════════════════════════════════
  // Crea un signal con valore iniziale 0
  // I signal sono reattivi: quando cambia il valore, Angular aggiorna automaticamente il template
  count = signal(0);

  increment() {
    // .update() riceve una funzione che prende il valore corrente e ritorna il nuovo valore
    this.count.update((value) => value + 1);
  }

  decrement() {
    this.count.update((value) => value - 1);
  }

  reset() {
    // .set() imposta direttamente un nuovo valore senza leggere quello precedente
    this.count.set(0);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 2. COMPUTED SIGNAL - Derivato da altri signal (reattivo)
  // ═══════════════════════════════════════════════════════════════════
  // I computed signals si ricalcolano automaticamente quando i signal da cui dipendono cambiano
  // Sono read-only e memorizzano il risultato (memoization) per evitare calcoli inutili
  doubleCount = computed(() => this.count() * 2);
  tripleCount = computed(() => this.count() * 3);

  // ═══════════════════════════════════════════════════════════════════
  // 3. ESEMPIO PRATICO - Carrello con total calcolato
  // ═══════════════════════════════════════════════════════════════════
  // Signal che contiene un array di oggetti (items del carrello)
  items = signal([
    { name: 'MacBook Pro', price: 2499, quantity: 1 },
    { name: 'iPhone 15', price: 999, quantity: 2 },
    { name: 'AirPods Pro', price: 249, quantity: 1 },
  ]);

  // Computed che calcola automaticamente il totale ogni volta che items cambia
  // Questo è molto più efficiente rispetto a ricalcolare il totale manualmente dopo ogni modifica
  total = computed(() => {
    return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  addItem() {
    this.items.update((currentItems) => [
      ...currentItems,
      { name: 'Magic Mouse', price: 99, quantity: 1 },
    ]);
  }

  removeItem(index: number) {
    this.items.update((currentItems) => currentItems.filter((_, i) => i !== index));
  }

  updateQuantity(index: number, delta: number) {
    // Aggiorna la quantità di un item creando un nuovo array (immutabilità)
    // Math.max(0, ...) previene quantità negative
    this.items.update((currentItems) =>
      currentItems.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // 4. EFFECT - Esegue side effects quando i signal cambiano
  // ═══════════════════════════════════════════════════════════════════
  effectLogs = signal<string[]>([]);

  constructor() {
    // Effect: si esegue automaticamente quando i signal usati al suo interno cambiano
    // Utile per logging, analytics, chiamate API, localStorage, ecc.
    effect(() => {
      const currentCount = this.count();
      const log = `Count cambiato: ${currentCount}`;
      // Mantiene solo gli ultimi 5 log per evitare overflow
      this.effectLogs.update((logs) => [...logs.slice(-4), log]);
    });
  }
}
