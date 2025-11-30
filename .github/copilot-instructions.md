# Copilot Instructions - Angular Showcase

## 🌍 Language Policy
**ALL code, comments, documentation, and instructions MUST be in English.**
- Variable names, function names, class names: English only
- Code comments: English only
- Documentation: English only
- Commit messages: English only
- Console logs and error messages: English only

## 🎯 Project Overview
This is an Angular 18+ standalone project showcasing the main framework features through interactive examples and demos.

## 📐 Architecture and Conventions

### Components
- **All components are standalone** (no NgModule)
- **Naming convention**: PascalCase for classes, kebab-case for files
- **Component file structure**:
  ```
  component-name/
    component-name.ts
    component-name.html
    component-name.scss
    component-name.spec.ts (opzionale)
  ```
- **Import order in components**:
  1. Angular core (`@angular/core`, `@angular/common`)
  2. Angular routing (`@angular/router`)
  3. RxJS
  4. Internal components (using path aliases)
  5. Services
  6. Types/Interfaces

### Routing
- **Hierarchical structure**:
  - `/` - Home
  - `/basics/*` - Basic concepts (data-binding, directives, forms)
  - `/advanced/*` - Advanced concepts (signals, http)
  - `/state/*` - State management (ngrx, behavior-subject)
  - `/examples/*` - Practical examples (users)

### Styling

#### Global SCSS
- **File `_globals.scss`**: Single import that includes everything
- **How to use in component SCSS files**:
  ```scss
  @use 'globals' as *;
  
  // Now you have access to:
  // - All SCSS variables ($primary, $white, $neutral-*, etc.)
  // - All mixins (@include flex(), rem(), vh(), etc.)
  // - All functions (rem(), vh(), vw())
  ```

#### CSS Custom Properties
- **Colors**: Always available globally via `var(--name)`
- **No import needed** in component SCSS files for colors
- **Examples**:
  ```scss
  color: var(--white);
  background: var(--primary);
  border: 1px solid var(--neutral-light);
  ```

#### Available SCSS Variables and Mixins

**Colors** (as SCSS variables after `@use 'globals'`):
- `$primary`, `$primary-dark`, `$primary-light`
- `$angular-red`, `$angular-red-dark`, `$angular-red-light`
- `$white`, `$black`
- `$neutral-*` (darkest, darker, neutral, light, lighter, lighter-2, lightest, bg)
- `$blue-*` (blue, light, dark, darker, darkest, bg-light, bg-lighter)
- `$success`, `$error`, `$warning`, `$info`
- `$yellow`, `$green`
- Gradienti: `$gradient-primary`, `$gradient-angular`, `$gradient-blue-bg`

**Variables**:
- `$transition`, `$transition-fast`, `$transition-slow`
- `$grid-breakpoints` (xs, sm, md, lg, xl, xxl)

**Functions**:
- `rem($size)` - Converts px to rem
- `vh($size)` - Converts px to vh
- `vw($size, $base-vw)` - Converts px to vw

**Mixins**:
- `@include flex($justify, $align, $direction, $wrap, $display)`
- `@include media-min-breakpoint($breakpoint)` - Media query min-width
- `@include media-max-breakpoint($breakpoint)` - Media query max-width
- `@include animated-underline` - Animated underline on hover

#### Global Typography Classes
Available throughout the project without import:

**Sizes**: `.display-xl`, `.display-l`, `.display-md`, `.body-md`, `.body-s`, `.body-xs`, `.body-xxs`, `.body-xxxs`

**Weights**: `.regular`, `.medium`, `.semibold`, `.bold`

**Styles**: `.italic`, `.uppercase`, `.lowercase`, `.capitalize`, `.underline`, `.ellipsis`

**Text colors**: `.primary-text`, `.white-text`, `.neutral-text`, `.success-text`, `.error-text`, etc.

**Alignment**: `.text-left`, `.text-right`, `.text-center`, `.text-justify`

### TypeScript Path Aliases
Configured in `tsconfig.json`:
```typescript
import { Component } from '@app/component-name/component-name';
import { FeatureCard } from '@components/feature-card/feature-card';
import { UsersService } from '@services/users.service';
import { LinkInterceptor } from '@directives/link-interceptor';
```

**Available paths**:
- `@app/*` → `src/app/*`
- `@components/*` → `src/app/components/*`
- `@services/*` → `src/services/*`
- `@directives/*` → `src/app/directives/*`

### State Management

#### Signals (Preferred for new code)
```typescript
// Writable signal
count = signal(0);
increment() { this.count.update(v => v + 1); }

// Computed signal
double = computed(() => this.count() * 2);

// Effect
constructor() {
  effect(() => console.log(this.count()));
}
```

#### NgRx (for complex global state)
- Central store in `src/app/store/`
- Actions, Reducers, Selectors separated by feature
- Use `@ngrx/store` for the store
- Use `@ngrx/effects` for side effects (if needed)

#### BehaviorSubject (for services with state)
```typescript
private dataSubject = new BehaviorSubject<Data>(initialValue);
data$ = this.dataSubject.asObservable();

// Expose only the Observable, not the Subject
```

### Reusable Components

#### Icon Component
```html
<app-icon name="icon-name" />
```
Available icons: `data-binding`, `directives`, `form`, `users`, `signals`, `http`, `ngrx`, `plus`, `play`, `pause`, `close`, `check`, `error`, `warning`, `info`

#### PageHeader Component
```html
<app-page-header
  title="Page Title"
  subtitle="Brief description">
</app-page-header>
```

#### CodeBlock Component
```html
<app-code-block
  [code]="codeString"
  language="typescript">
</app-code-block>
```

#### FeatureCard Component
```html
<app-feature-card
  icon="icon-name"
  title="Title"
  description="Description">
</app-feature-card>
```

### Patterns and Best Practices

#### Form Management
- Use `ReactiveFormsModule` for complex forms
- Use `FormBuilder` to create form groups
- Custom validators in separate file if complex

#### HTTP Requests
- Service Facade pattern: HTTP logic in services, not in components
- Use `HttpClient` with typed responses
- Centralized error handling in service

#### Performance
- Use `@defer` for lazy loading heavy components
- `trackBy` in `@for` loops
- `OnPush` change detection for presentational components (if needed)

#### Accessibility
- `user-select: none` is global by default
- Re-enable with `.code-block { user-select: text; }` where needed
- Always `alt` text on images
- Labels associated with form inputs

### File Structure
```
src/
  app/
    components/          # Reusable components
    directives/          # Custom directives
    store/              # NgRx store
    [feature]/          # Feature components (one per route)
  services/             # Shared services
  styles/               # Global SCSS
    _globals.scss       # Central import
    _colors.scss        # Color palette
    _variables.scss     # SCSS variables
    _mixins.scss        # Mixins and functions
    _typography.scss    # Typography classes
  types/                # TypeScript interfaces/types
```

### Build & Budget
- Initial bundle budget: 500kB warning, 1MB error
- Component styles budget: 10kB warning, 20kB error
- If an SCSS file exceeds 10kB → consider extracting sub-components

## 🚀 Common Commands
```bash
npm start          # Dev server (localhost:4200)
npm run build      # Build produzione
npm test           # Run tests
```

## 📝 When Creating New Code

### New Component
1. Create folder `component-name/` under the correct feature
2. `.ts` file with standalone decorator
3. Add `@use 'globals' as *;` in `.scss` if using variables/mixins
4. Import in components using path aliases when possible

### New Service
1. Create in `src/services/`
2. `@Injectable({ providedIn: 'root' })`
3. Service Facade pattern for HTTP

### New Route
1. Add in `app.routes.ts`
2. Organize under the correct group (basics/advanced/state/examples)
3. Lazy-loaded component if heavy

### New Icon
1. Add SVG in `icon.html` inside switch
2. Follow the same pattern as existing ones
3. Color: `currentColor` to inherit from parent

## 🎨 Style Guide

### Naming
- **Components**: `UserList`, `DataBinding`
- **Services**: `UsersService`, `PostsService`
- **Interfaces**: `User`, `Post`, `TodoItem`
- **Files**: `user-list.ts`, `data-binding.html`

### Comments
- Use comments for complex logic
- Document configurations with inline comments
- Logical sections with headers `// ═══ SECTION ═══`
- **All comments must be in English**

### Formatting
- 2 spaces indentation
- Single quotes for strings
- Trailing comma in multi-line arrays/objects
- Prettier + ESLint for auto-formatting

## ⚠️ Things NOT to Do
- ❌ Don't use NgModule (everything standalone)
- ❌ Don't import SCSS files in component styles (use `@use 'globals'`)
- ❌ Don't use `any` type (always explicit types)
- ❌ Don't expose BehaviorSubject directly (only Observable via `asObservable()`)
- ❌ Don't put business logic in components (use services)
- ❌ Don't use `@import` in SCSS (use `@use` or `@forward`)
- ❌ Don't increase budgets without optimizing code first
- ❌ Don't use Italian in code, comments, or documentation

## 🎯 Project Goals
- Show modern Angular best practices
- Clean and maintainable code
- Practical and interactive examples
- Performance and accessibility
