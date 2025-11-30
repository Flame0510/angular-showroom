import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlock } from '@components/code-block/code-block';

type StorePattern = 'centralized' | 'feature' | null;

@Component({
  selector: 'app-ngrx-concepts',
  standalone: true,
  imports: [CommonModule, CodeBlock],
  templateUrl: './ngrx-concepts.html',
  styleUrls: ['./ngrx-concepts.scss'],
})
export class NgrxConcepts {
  // Selected pattern state
  selectedPattern = signal<StorePattern>(null);

  selectPattern(pattern: StorePattern) {
    this.selectedPattern.set(pattern);
    // Scroll to guide section
    setTimeout(() => {
      const element = document.getElementById('pattern-guide');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  storeCode = `// store/counter.state.ts
export interface CounterState {
  count: number;
  history: number[];
}

export const initialState: CounterState = {
  count: 0,
  history: [0]
};`;

  actionsCode = `// store/counter.actions.ts
import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Counter] Increment');
export const decrement = createAction('[Counter] Decrement');
export const reset = createAction('[Counter] Reset');
export const setValue = createAction(
  '[Counter] Set Value',
  props<{ value: number }>()
);`;

  reducerCode = `// store/counter.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as CounterActions from './counter.actions';

export const counterReducer = createReducer(
  initialState,
  on(CounterActions.increment, state => ({
    ...state,
    count: state.count + 1,
    history: [...state.history, state.count + 1]
  })),
  on(CounterActions.decrement, state => ({
    ...state,
    count: state.count - 1,
    history: [...state.history, state.count - 1]
  })),
  on(CounterActions.reset, state => ({
    count: 0,
    history: [0]
  }))
);`;

  selectorsCode = `// store/counter.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CounterState } from './counter.state';

export const selectCounterState =
  createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
  selectCounterState,
  state => state.count
);

export const selectHistory = createSelector(
  selectCounterState,
  state => state.history
);

export const selectLastChange = createSelector(
  selectHistory,
  history => history.length > 1
    ? history[history.length - 1] - history[history.length - 2]
    : 0
);`;

  effectsCode = `// store/counter.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import * as CounterActions from './counter.actions';

@Injectable()
export class CounterEffects {

  // Salva il valore nel localStorage
  saveCounter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CounterActions.increment,
        CounterActions.decrement,
        CounterActions.reset
      ),
      tap(() => {
        // Side effect: salvare nello storage
        console.log('Salvando counter...');
      })
    ),
    { dispatch: false }
  );

  // Carica il valore all'avvio
  loadCounter$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[App] Init'),
      map(() => {
        const saved = localStorage.getItem('counter');
        return CounterActions.setValue({
          value: saved ? JSON.parse(saved) : 0
        });
      })
    )
  );

  constructor(private actions$: Actions) {}
}`;

  componentCode = `// component.ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as CounterActions from './store/counter.actions';
import { selectCount } from './store/counter.selectors';

@Component({
  selector: 'app-counter',
  template: \`
    <div>
      <h2>Count: {{ count$ | async }}</h2>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
      <button (click)="reset()">Reset</button>
    </div>
  \`
})
export class CounterComponent {
  count$: Observable<number>;

  constructor(private store: Store) {
    this.count$ = this.store.select(selectCount);
  }

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }

  reset() {
    this.store.dispatch(CounterActions.reset());
  }
}`;

  installCode = `# Installazione base
npm install @ngrx/store @ngrx/store-devtools --legacy-peer-deps

# Oppure con ng add (raccomandato)
ng add @ngrx/store --legacy-peer-deps
ng add @ngrx/store-devtools --legacy-peer-deps

# Per Angular 21+, crea .npmrc nella root:
echo "legacy-peer-deps=true" > .npmrc

# Poi installa normalmente:
npm install @ngrx/store @ngrx/store-devtools`;

  setupCode = `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { counterReducer } from './store/counter.reducer';
import { CounterEffects } from './store/counter.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ counter: counterReducer }),
    provideEffects([CounterEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};`;

  // ═══ CENTRALIZED STORE EXAMPLES ═══
  centralizedStateCode = `// store/app.state.ts
import { CounterState } from './counter/counter.state';
import { TodoState } from './todo/todo.state';
import { ActionsLogState } from './actions-log/actions-log.state';

// Global state interface combining all features
export interface AppState {
  counter: CounterState;
  todo: TodoState;
  actionsLog: ActionsLogState;
}`;

  combinedReducersCode = `// store/app.reducers.ts
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { counterReducer } from './counter/counter.reducer';
import { todoReducer } from './todo/todo.reducer';
import { actionsLogReducer } from './actions-log/actions-log.reducer';

// Combine all feature reducers into one
export const appReducers: ActionReducerMap<AppState> = {
  counter: counterReducer,
  todo: todoReducer,
  actionsLog: actionsLogReducer,
};`;

  provideStoreCode = `// app.config.ts (Centralized Store)
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducers } from './store/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide the combined reducers
    provideStore(appReducers),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};`;

  centralizedSelectorsCode = `// store/counter/counter.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

// Select the feature state from the global state
export const selectCounterState = (state: AppState) => state.counter;

// Create memoized selectors
export const selectCount = createSelector(
  selectCounterState,
  state => state.count
);

export const selectHistory = createSelector(
  selectCounterState,
  state => state.history
);

// ─────────────────────────────────────────────
// Usage in component:
// this.count$ = this.store.select(selectCount);
// ─────────────────────────────────────────────`;

  // ═══ FEATURE STORE EXAMPLES ═══
  featureStateCode = `// store/counter.state.ts (Feature Store)
export interface CounterState {
  count: number;
  history: number[];
}

export const initialState: CounterState = {
  count: 0,
  history: [0]
};

// Each feature manages its own state independently`;

  featureReducerCode = `// store/counter.reducer.ts (Feature Store)
import { createReducer, on } from '@ngrx/store';
import * as CounterActions from './counter.actions';
import { initialState } from './counter.state';

export const counterReducer = createReducer(
  initialState,
  on(CounterActions.increment, state => ({
    ...state,
    count: state.count + 1,
    history: [...state.history, state.count + 1]
  })),
  on(CounterActions.decrement, state => ({
    ...state,
    count: state.count - 1,
    history: [...state.history, state.count - 1]
  })),
  on(CounterActions.reset, () => initialState)
);`;

  featureProvideCode = `// app.config.ts (Feature Store)
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    // Empty root store - features register themselves
    provideStore({}),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    })
  ]
};`;

  featureModuleCode = `// counter/counter.routes.ts (Feature Store)
import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { counterReducer } from './store/counter.reducer';

export const counterRoutes: Route[] = [
  {
    path: '',
    providers: [
      // Register feature state when route loads
      provideState('counter', counterReducer)
    ],
    loadComponent: () =>
      import('./counter.component').then(m => m.CounterComponent)
  }
];`;

  featureSelectorCode = `// store/counter.selectors.ts (Feature Store)
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CounterState } from './counter.state';

// Select this feature's state slice
export const selectCounterState =
  createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
  selectCounterState,
  state => state.count
);

export const selectHistory = createSelector(
  selectCounterState,
  state => state.history
);`;
}
