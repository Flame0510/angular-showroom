import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaccia per un Post da JSONPlaceholder
 */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * Service Facade per la gestione dei Post
 *
 * PERCHÉ USARE UN SERVICE FACADE?
 * ================================
 * 1. SEPARAZIONE DELLE RESPONSABILITÀ:
 *    - Il componente non deve sapere DOVE e COME vengono recuperati i dati
 *    - Il service centralizza tutta la logica di comunicazione HTTP
 *
 * 2. RIUSABILITÀ:
 *    - Più componenti possono usare lo stesso service
 *    - Evita duplicazione di codice
 *
 * 3. TESTABILITÀ:
 *    - Facile creare mock del service nei test
 *    - I componenti testano solo la UI, non la logica HTTP
 *
 * 4. MANUTENIBILITÀ:
 *    - Se cambia l'API, modifichi solo il service
 *    - Se aggiungi caching, lo fai solo qui
 *    - Se aggiungi error handling, lo centralizzi
 *
 * 5. TYPE SAFETY:
 *    - Il service definisce le interfacce dei dati
 *    - TypeScript ti avvisa se usi i dati male
 */
@Injectable({
  providedIn: 'root', // Singleton in tutta l'app
})
export class PostsService {
  // Dependency Injection del HttpClient
  private http = inject(HttpClient);

  // URL base dell'API (in un'app reale, verrebbe da environment)
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/posts';

  /**
   * Recupera tutti i post (GET)
   *
   * @returns Observable<Post[]> - Stream di dati che emette l'array di post
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.API_URL);
  }

  /**
   * Recupera un singolo post per ID (GET)
   *
   * @param id - ID del post da recuperare
   * @returns Observable<Post> - Stream che emette il post richiesto
   */
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.API_URL}/${id}`);
  }

  /**
   * Crea un nuovo post (POST)
   *
   * @param post - Dati del post da creare (senza id)
   * @returns Observable<Post> - Stream che emette il post creato con id
   */
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.API_URL, post);
  }

  /**
   * Aggiorna un post esistente (PUT)
   *
   * @param id - ID del post da aggiornare
   * @param post - Nuovi dati del post
   * @returns Observable<Post> - Stream che emette il post aggiornato
   */
  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.API_URL}/${id}`, post);
  }

  /**
   * Elimina un post (DELETE)
   *
   * @param id - ID del post da eliminare
   * @returns Observable<void> - Stream che completa quando la cancellazione ha successo
   */
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
