import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../page-header/page-header';
import { CodeBlock } from '../components/code-block/code-block';

// Simulazione delle Actions
interface Action {
  type: string;
  payload?: any;
}

// Simulazione dello State
interface CounterState {
  count: number;
  history: number[];
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-ngrx-example',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeader, CodeBlock],
  templateUrl: './ngrx-example.html',
  styleUrls: ['./ngrx-example.scss'],
})
export class NgrxExample {
  // Simulazione dello store per il counter
  counterState = signal<CounterState>({
    count: 0,
    history: [0],
  });

  // Simulazione dello store per i todos
  todoState = signal<TodoState>({
    todos: [
      { id: 1, text: 'Imparare NgRx', completed: false },
      { id: 2, text: 'Creare uno store', completed: true },
      { id: 3, text: 'Implementare actions', completed: false },
    ],
    filter: 'all',
  });

  newTodoText = signal('');
  selectedTab = signal<'counter' | 'todos' | 'concepts'>('concepts');

  // Actions log
  actionsLog = signal<string[]>([]);

  // Computed selectors (simulati)
  get filteredTodos() {
    const state = this.todoState();
    switch (state.filter) {
      case 'active':
        return state.todos.filter((t) => !t.completed);
      case 'completed':
        return state.todos.filter((t) => t.completed);
      default:
        return state.todos;
    }
  }

  get activeTodosCount() {
    return this.todoState().todos.filter((t) => !t.completed).length;
  }

  get completedTodosCount() {
    return this.todoState().todos.filter((t) => t.completed).length;
  }

  // Counter Actions
  increment() {
    this.dispatch({ type: 'INCREMENT' });
    const current = this.counterState().count;
    this.counterState.update((state) => ({
      count: current + 1,
      history: [...state.history, current + 1],
    }));
  }

  decrement() {
    this.dispatch({ type: 'DECREMENT' });
    const current = this.counterState().count;
    this.counterState.update((state) => ({
      count: current - 1,
      history: [...state.history, current - 1],
    }));
  }

  reset() {
    this.dispatch({ type: 'RESET' });
    this.counterState.set({
      count: 0,
      history: [0],
    });
  }

  // Todo Actions
  addTodo() {
    const text = this.newTodoText().trim();
    if (!text) return;

    this.dispatch({ type: 'ADD_TODO', payload: text });
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };

    this.todoState.update((state) => ({
      ...state,
      todos: [...state.todos, newTodo],
    }));
    this.newTodoText.set('');
  }

  toggleTodo(id: number) {
    this.dispatch({ type: 'TOGGLE_TODO', payload: id });
    this.todoState.update((state) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  }

  deleteTodo(id: number) {
    this.dispatch({ type: 'DELETE_TODO', payload: id });
    this.todoState.update((state) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.dispatch({ type: 'SET_FILTER', payload: filter });
    this.todoState.update((state) => ({
      ...state,
      filter,
    }));
  }

  clearCompleted() {
    this.dispatch({ type: 'CLEAR_COMPLETED' });
    this.todoState.update((state) => ({
      ...state,
      todos: state.todos.filter((todo) => !todo.completed),
    }));
  }

  // Helper per loggare le actions
  private dispatch(action: Action) {
    const log = `${action.type}${action.payload ? ` (${JSON.stringify(action.payload)})` : ''}`;
    this.actionsLog.update((logs) => [log, ...logs].slice(0, 10));
  }

  clearLogs() {
    this.actionsLog.set([]);
  }

  // Codice esempio
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
}
