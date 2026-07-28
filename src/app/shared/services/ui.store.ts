import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

// global layout UI state (currently just the menu sidebar)
export const UiStore = signalStore(
  { providedIn: 'root' },
  withState({ menuOpen: false }),
  withMethods((store) => ({
    openMenu(): void {
      patchState(store, { menuOpen: true });
    },
    closeMenu(): void {
      patchState(store, { menuOpen: false });
    },
    toggleMenu(): void {
      patchState(store, { menuOpen: !store.menuOpen() });
    },
  }))
);
