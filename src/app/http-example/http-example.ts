import { Component, signal, inject } from '@angular/core';
import { PostsService, Post } from '../../services/posts.service';
import { PageHeader } from '../page-header/page-header';
import { CodeBlock } from '../components/code-block/code-block';

/**
 * Componente che dimostra l'uso di HttpClient con Service Facade
 *
 * Questo componente mostra:
 * - Come iniettare e usare un service
 * - Come gestire Observable con async pipe o subscribe
 * - Operazioni CRUD complete (GET, POST, PUT, DELETE)
 * - Best practices per HTTP in Angular
 */
@Component({
  selector: 'app-http-example',
  imports: [PageHeader, CodeBlock],
  templateUrl: './http-example.html',
  styleUrl: './http-example.scss',
})
export class HttpExample {
  // Dependency Injection del service PostsService
  private postsService = inject(PostsService);

  // ═══════════════════════════════════════════════════════════════════
  // STATE - Usiamo Signals per la reattività
  // ═══════════════════════════════════════════════════════════════════
  posts = signal<Post[]>([]); // Lista di tutti i post
  selectedPost = signal<Post | null>(null); // Post selezionato per visualizzazione
  loading = signal(false); // Indicatore di caricamento
  error = signal<string | null>(null); // Messaggio di errore

  // Form data per creare un nuovo post
  newPost = signal({
    userId: 1,
    title: '',
    body: '',
  });

  // Codice di esempio per la sezione
  serviceExampleCode = `// 1. Definisci il Service Facade
@Injectable({ providedIn: 'root' })
export class PostsService {
  private http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('api/posts');
  }
}

// 2. Usa il Service nel Componente
@Component({ ... })
export class MyComponent {
  private postsService = inject(PostsService);
  posts = signal<Post[]>([]);

  loadPosts() {
    this.postsService.getPosts().subscribe(
      posts => this.posts.set(posts)
    );
  }
}`;

  // ═══════════════════════════════════════════════════════════════════
  // METODI HTTP - Esempi di tutte le operazioni CRUD
  // ═══════════════════════════════════════════════════════════════════

  /**
   * GET - Carica tutti i post
   * Esempio di come gestire una richiesta HTTP con Observable
   */
  loadPosts() {
    this.loading.set(true);
    this.error.set(null);

    // subscribe() permette di "ascoltare" l'Observable
    this.postsService.getPosts().subscribe({
      // next: chiamata quando arrivano i dati
      next: (posts) => {
        this.posts.set(posts.slice(0, 10)); // Prendiamo solo i primi 10 per brevità
        this.loading.set(false);
      },
      // error: chiamata in caso di errore HTTP
      error: (err) => {
        this.error.set('Errore nel caricamento dei post: ' + err.message);
        this.loading.set(false);
        console.error('HTTP Error:', err);
      },
    });
  }

  /**
   * GET by ID - Carica un singolo post
   */
  loadPost(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.postsService.getPost(id).subscribe({
      next: (post) => {
        this.selectedPost.set(post);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Errore nel caricamento del post: ' + err.message);
        this.loading.set(false);
      },
    });
  }

  /**
   * POST - Crea un nuovo post
   * JSONPlaceholder simula la creazione, restituisce un ID finto
   */
  createPost() {
    const post = this.newPost();

    if (!post.title || !post.body) {
      this.error.set('Titolo e contenuto sono obbligatori!');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.postsService.createPost(post).subscribe({
      next: (createdPost) => {
        // Aggiungiamo il post creato all'inizio della lista
        this.posts.update((posts) => [createdPost, ...posts]);

        // Reset del form
        this.newPost.set({ userId: 1, title: '', body: '' });
        this.loading.set(false);

        alert(`Post creato con ID: ${createdPost.id}`);
      },
      error: (err) => {
        this.error.set('Errore nella creazione del post: ' + err.message);
        this.loading.set(false);
      },
    });
  }

  /**
   * PUT - Aggiorna un post esistente
   */
  updatePost(post: Post) {
    const updatedPost = {
      ...post,
      title: post.title + ' (MODIFICATO)',
    };

    this.loading.set(true);

    this.postsService.updatePost(post.id, updatedPost).subscribe({
      next: (updated) => {
        // Aggiorniamo il post nella lista
        this.posts.update((posts) =>
          posts.map((p) => (p.id === updated.id ? updated : p))
        );
        this.loading.set(false);
        alert('Post aggiornato con successo!');
      },
      error: (err) => {
        this.error.set('Errore nell\'aggiornamento: ' + err.message);
        this.loading.set(false);
      },
    });
  }

  /**
   * DELETE - Elimina un post
   */
  deletePost(id: number) {
    if (!confirm('Sei sicuro di voler eliminare questo post?')) {
      return;
    }

    this.loading.set(true);

    this.postsService.deletePost(id).subscribe({
      next: () => {
        // Rimuoviamo il post dalla lista
        this.posts.update((posts) => posts.filter((p) => p.id !== id));
        this.loading.set(false);
        alert('Post eliminato con successo!');
      },
      error: (err) => {
        this.error.set('Errore nell\'eliminazione: ' + err.message);
        this.loading.set(false);
      },
    });
  }

  /**
   * Aggiorna il campo title del form
   */
  updateTitle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newPost.update((post) => ({ ...post, title: input.value }));
  }

  /**
   * Aggiorna il campo body del form
   */
  updateBody(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.newPost.update((post) => ({ ...post, body: textarea.value }));
  }
}
