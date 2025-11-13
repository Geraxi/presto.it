import { USERS, INITIAL_ADS, LANGUAGES, STORES } from './constants.js';
import { i18n } from './hooks/useI18n.js';
import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderHome } from './components/Home.js';
import { renderAdDetail } from './components/AdDetail.js';
import { renderCreateAd } from './components/CreateAd.js';
import { renderRevisorDashboard } from './components/RevisorDashboard.js';
import { renderWorkWithUs } from './components/WorkWithUs.js';
import { renderLogin } from './components/Login.js';
import { renderBecomeSeller } from './components/BecomeSeller.js';
import { renderStoreDetail } from './components/StoreDetail.js';
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
  openLogin: () => void;
}


export default class App {
  // Fix: Declare class properties to resolve multiple 'does not exist on type App' errors.
  rootElement: HTMLElement;
  state: AppState;
  actions: AppActions;

  constructor() {
    this.rootElement = document.getElementById('root')!;
    this.state = {
      users: USERS,
      currentUser: null,
      ads: INITIAL_ADS,
      stores: STORES,
      language: LANGUAGES[0],
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
      openLogin: () => renderLogin(this.state, this.actions),
    };
  }

  setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  login(email, password) {
    const user = this.state.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.setState({ currentUser: user, view: { name: 'home' } });
      return true;
    }
    return false;
  }
  
  register(name, email, password) {
    const newUser: User = { id: Date.now(), name, email, isRevisor: false, password };
    this.setState({
        users: [...this.state.users, newUser],
        currentUser: newUser,
        view: { name: 'home' }
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
    this.setState({ ads: [ad, ...this.state.ads], view: { name: 'home' } });
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
  }

  init() {
    this.render();
  }
}