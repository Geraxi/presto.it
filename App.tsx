

import { USERS, INITIAL_ADS, LANGUAGES, STORES } from './constants.js';
import { i18n } from './hooks/useI18n.js';
import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderHome } from './components/Home.js';
import { renderAdDetail } from './components/AdDetail.js';
import { renderCreateAd } from './components/CreateAd.js';
import { renderRevisorDashboard } from './components/RevisorDashboard.js';
import { renderWorkWithUs } from './components/WorkWithUs.js';
import { renderBecomeSeller } from './components/BecomeSeller.js';
import { renderStoreDetail } from './components/StoreDetail.js';
import { renderLoginView } from './components/LoginView.js';
import { renderRegisterView } from './components/RegisterView.js';
import { renderProfileView } from './components/ProfileView.js';
import type { User, Ad, Store, Language, View, CategoryKey } from './types.js';

// Fix: Define interfaces for state and actions for type safety.
interface AppState {
  users: User[];
  currentUser: User | null;
  ads: Ad[];
  stores: Store[];
  language: Language;
  view: View;
  searchTerm: string;
  selectedCategory: string;
}

interface NewAd {
  price: number;
  category: CategoryKey;
  images: string[];
  title: string;
  description: string;
}

interface AppActions {
  setState: (newState: Partial<AppState>) => void;
  setView: (view: View) => void;
  setLanguage: (language: Language) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  addAd: (newAd: NewAd) => void;
  updateAd: (updatedAd: Ad) => void;
  createStore: (storeName: string, storeDescription: string) => void;
  deleteAccount: () => void;
}

declare global {
  interface Window {
    bootstrap: any;
  }
}

export default class App {
  // Fix: Declare class properties to resolve multiple 'does not exist on type App' errors.
  rootElement: HTMLElement;
  state: AppState;
  actions: AppActions;

  constructor() {
    this.rootElement = document.getElementById('root')!;
    
    const persistedState = this.loadState();

    // Create maps from the initial data to handle merging. Using ID as the key.
    const usersById = new Map(USERS.map(u => [u.id, { ...u }]));
    const adsById = new Map(INITIAL_ADS.map(a => [a.id, { ...a }]));
    const storesById = new Map(STORES.map(s => [s.id, { ...s }]));

    // If there's a persisted state, merge it by overwriting/adding to the maps.
    // This ensures new users are added and existing users (e.g. who became a seller) are updated.
    if (persistedState) {
        persistedState.users.forEach(pUser => usersById.set(pUser.id, { ...pUser }));
        persistedState.ads.forEach(pAd => adsById.set(pAd.id, { ...pAd }));
        persistedState.stores.forEach(pStore => storesById.set(pStore.id, { ...pStore }));
    }
    
    const users = Array.from(usersById.values());
    const ads = Array.from(adsById.values());
    const stores = Array.from(storesById.values());
    
    // Restore the current user object from the newly merged user list.
    const currentUser = persistedState?.currentUser
      ? users.find(u => u.id === persistedState.currentUser.id) || null
      : null;
    
    // Restore language or use default.
    const language = persistedState?.language || LANGUAGES[0];

    // Combine the data state with the transient view state, which always resets on load.
    this.state = {
      users,
      currentUser,
      ads,
      stores,
      language,
      view: { name: 'home' },
      searchTerm: '',
      selectedCategory: 'all',
    };

    i18n.setLanguage(this.state.language);

    this.actions = {
      setState: this.setState.bind(this),
      setView: (view) => this.setState({ view }),
      setLanguage: (language) => {
        i18n.setLanguage(language);
        this.setState({ language });
      },
      setSearchTerm: (term) => this.setState({ searchTerm: term }),
      setSelectedCategory: (cat) => this.setState({ selectedCategory: cat }),
      login: this.login.bind(this),
      register: this.register.bind(this),
      logout: this.logout.bind(this),
      addAd: this.addAd.bind(this),
      updateAd: this.updateAd.bind(this),
      createStore: this.createStore.bind(this),
      deleteAccount: this.deleteAccount.bind(this),
    };
  }

  loadState() {
    try {
      const serializedState = localStorage.getItem('presto_app_state');
      if (serializedState === null) {
        return undefined; // No state in localStorage, use initial state
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error("Could not load state from localStorage", err);
      return undefined;
    }
  }

  saveState(state: AppState) {
    try {
      const stateToSave = {
        users: state.users,
        currentUser: state.currentUser,
        ads: state.ads,
        stores: state.stores,
        language: state.language,
      };
      const serializedState = JSON.stringify(stateToSave);
      localStorage.setItem('presto_app_state', serializedState);
    } catch (err) {
      console.error("Could not save state to localStorage", err);
    }
  }

  setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState };
    this.saveState(this.state);
    this.render();
  }

  login(email, password) {
    const user = this.state.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.setState({ currentUser: user, view: { name: 'create_ad' } });
      return true;
    }
    return false;
  }
  
  register(name, email, password) {
    const newUser: User = { id: Date.now(), name, email, isRevisor: false, password };
    this.setState({
        users: [...this.state.users, newUser],
        currentUser: newUser,
        view: { name: 'create_ad' }
    });
  }

  logout() {
    this.setState({ currentUser: null, view: { name: 'home' } });
  }

  addAd(newAd: NewAd) {
    if (!this.state.currentUser) return;
    const ad: Ad = {
      id: Date.now(),
      userId: this.state.currentUser.id,
      status: 'pending',
      price: newAd.price,
      category: newAd.category,
      images: newAd.images,
      title: { it: newAd.title, en: newAd.title, es: newAd.title },
      description: { it: newAd.description, en: newAd.description, es: newAd.description },
    };
    this.setState({ ads: [ad, ...this.state.ads], view: { name: 'profile', initialTab: 'pending' } });
    alert(i18n.t('ad_created_success'));
  }

  updateAd(updatedAd: Ad) {
    const ads = this.state.ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad);
    this.setState({ ads });
  }
  
  createStore(storeName, storeDescription) {
    if (!this.state.currentUser) return;
    const newStore: Store = {
      id: Date.now(),
      name: storeName,
      description: storeDescription,
      logo: `https://picsum.photos/seed/store${Date.now()}/100/100`,
      ownerId: this.state.currentUser.id,
    };
    const updatedUser = { ...this.state.currentUser, storeId: newStore.id };
    this.setState({
      stores: [...this.state.stores, newStore],
      currentUser: updatedUser,
      users: this.state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
      view: { name: 'store_detail', storeId: newStore.id },
    });
  }

  deleteAccount() {
    if (!this.state.currentUser) return;

    const userIdToDelete = this.state.currentUser.id;

    const updatedUsers = this.state.users.filter(u => u.id !== userIdToDelete);
    const updatedAds = this.state.ads.filter(ad => ad.userId !== userIdToDelete);
    const updatedStores = this.state.stores.filter(s => s.ownerId !== userIdToDelete);

    this.setState({
      users: updatedUsers,
      ads: updatedAds,
      stores: updatedStores,
      currentUser: null,
      view: { name: 'home' }
    });
  }

  renderView() {
    const { view } = this.state;
    switch (view.name) {
      case 'ad_detail':
        return renderAdDetail(this.state, this.actions, view.adId);
      case 'create_ad':
        return renderCreateAd(this.state, this.actions);
      case 'revisor_dashboard':
        return renderRevisorDashboard(this.state, this.actions);
      case 'work_with_us':
        return renderWorkWithUs(this.state, this.actions);
      case 'become_seller':
        return renderBecomeSeller(this.state, this.actions);
       case 'store_detail':
        return renderStoreDetail(this.state, this.actions, view.storeId);
      case 'login':
        return renderLoginView(this.state, this.actions);
      case 'register':
        return renderRegisterView(this.state, this.actions);
      case 'profile':
        return renderProfileView(this.state, this.actions);
      case 'home':
      default:
        return renderHome(this.state, this.actions);
    }
  }

  render() {
    this.rootElement.innerHTML = ''; 

    const header = renderHeader(this.state, this.actions);
    const main = document.createElement('main');
    main.className = 'flex-grow-1';
    
    const viewContent = this.renderView();
    main.append(viewContent);
    
    const footer = renderFooter(this.state, this.actions);

    this.rootElement.append(header, main, footer);

    // Re-initialize Bootstrap components after every render.
    // This is necessary because the DOM is cleared and recreated on each state change.
    if (window.bootstrap) {
      // Dropdowns
      if (typeof window.bootstrap.Dropdown === 'function') {
        const dropdownElementList = Array.from(this.rootElement.querySelectorAll('[data-bs-toggle="dropdown"]'));
        dropdownElementList.forEach(dropdownToggleEl => {
          window.bootstrap.Dropdown.getOrCreateInstance(dropdownToggleEl);
        });
      }
      // Tabs
      if (typeof window.bootstrap.Tab === 'function') {
        const tabElementList = Array.from(this.rootElement.querySelectorAll('[data-bs-toggle="tab"]'));
        tabElementList.forEach(tabEl => {
          // Creating a new instance attaches the event listeners.
          new window.bootstrap.Tab(tabEl);
        });
      }
      // Carousels
      if (typeof window.bootstrap.Carousel === 'function') {
          const carouselElList = this.rootElement.querySelectorAll('.carousel');
          carouselElList.forEach(carouselEl => {
              window.bootstrap.Carousel.getOrCreateInstance(carouselEl);
          });
      }
    }
  }

  init() {
    this.render();
  }
}