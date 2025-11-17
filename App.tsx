import { USERS, INITIAL_ADS_PROCESSED, LANGUAGES, STORES, guessImageFromTitle, ensureAdImage } from './constants.js';
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
import { renderProfile } from './components/Profile.js';
import { renderMyListings } from './components/MyListings.js';
import { renderManageStore } from './components/ManageStore.js';
import { renderBasket } from './components/Basket.js';
import { renderCheckout } from './components/Checkout.js';
import type { User, Ad, Store, Language, View, CategoryKey, BasketItem, Order } from './types.js';

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
  basket: BasketItem[];
  orders: Order[];
}

interface NewAd {
  price: number;
  category: CategoryKey;
  images: string[];
  title: string;
  description: string;
  storeId?: number;
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
  deleteAd: (adId: number) => void;
  createStore: (storeName: string, storeDescription: string) => void;
  updateStore: (storeId: number, storeName: string, storeDescription: string) => void;
  openLogin: () => void;
  deleteAccount: () => void;
  becomeRevisor: () => void;
  addEarnings: (userId: number, amount: number) => void;
  addToBasket: (adId: number) => void;
  removeFromBasket: (adId: number) => void;
  updateBasketQuantity: (adId: number, quantity: number) => void;
  clearBasket: () => void;
  checkout: (paymentMethod: string) => void;
}


export default class App {
  // Fix: Declare class properties to resolve multiple 'does not exist on type App' errors.
  rootElement: HTMLElement;
  state: AppState;
  actions: AppActions;

  constructor() {
    try {
      const root = document.getElementById('root');
      if (!root) {
        console.error('Root element not found!');
        throw new Error('Root element not found!');
      }
      this.rootElement = root;
      
      // Load persisted data from localStorage
      const savedUsers = this.loadUsersFromStorage();
      const savedCurrentUserId = this.loadCurrentUserIdFromStorage();
      const savedAds = this.loadAdsFromStorage();
      const savedStores = this.loadStoresFromStorage();
      const savedBasket = this.loadBasketFromStorage();
      const savedOrders = this.loadOrdersFromStorage();
      
      // Merge saved users with initial users, avoiding duplicates by email
      const mergedUsers = [...USERS];
      if (savedUsers.length > 0) {
        savedUsers.forEach(savedUser => {
          const existingIndex = mergedUsers.findIndex(u => u.email === savedUser.email);
          if (existingIndex >= 0) {
            // Update existing user with saved data (preserves password)
            mergedUsers[existingIndex] = savedUser;
          } else {
            // Add new user
            mergedUsers.push(savedUser);
          }
        });
      }
      
      // Merge saved ads with initial ads, avoiding duplicates by id
      let mergedAds: Ad[];
      try {
        mergedAds = [...INITIAL_ADS_PROCESSED];
      } catch (error) {
        console.error('Error loading INITIAL_ADS_PROCESSED:', error);
        mergedAds = [];
      }
      if (savedAds.length > 0) {
        savedAds.forEach(savedAd => {
          try {
            const existingIndex = mergedAds.findIndex(a => a.id === savedAd.id);
            if (existingIndex >= 0) {
              // For initial ads (from INITIAL_ADS_PROCESSED), preserve images from INITIAL_ADS_PROCESSED
              // but keep other user-modified data (like status changes, user-created ads, etc.)
              try {
                const initialAd = INITIAL_ADS_PROCESSED && INITIAL_ADS_PROCESSED.length > 0 
                  ? INITIAL_ADS_PROCESSED.find(a => a.id === savedAd.id)
                  : null;
                if (initialAd) {
                  // This is an initial ad - use images from INITIAL_ADS_PROCESSED, but keep other saved data
                  mergedAds[existingIndex] = {
                    ...savedAd,
                    images: initialAd.images, // Always use images from INITIAL_ADS_PROCESSED for initial ads
                    watermarkedImages: initialAd.watermarkedImages
                  };
                } else {
                  // This is a user-created ad - use saved data as-is
                  mergedAds[existingIndex] = savedAd;
                }
              } catch (error) {
                console.error('Error finding initial ad:', error);
                // Fallback: use saved ad as-is
                mergedAds[existingIndex] = savedAd;
              }
            } else {
              // Add new ad (user-created)
              mergedAds.push(savedAd);
            }
          } catch (error) {
            console.error('Error processing saved ad:', savedAd.id, error);
            // Skip this ad if there's an error
          }
        });
      }
      
      // Merge saved stores with initial stores, avoiding duplicates by id
      const mergedStores = [...STORES];
      if (savedStores.length > 0) {
        savedStores.forEach(savedStore => {
          const existingIndex = mergedStores.findIndex(s => s.id === savedStore.id);
          if (existingIndex >= 0) {
            // Update existing store with saved data
            mergedStores[existingIndex] = savedStore;
          } else {
            // Add new store
            mergedStores.push(savedStore);
          }
        });
      }
      
      this.state = {
        users: mergedUsers,
        currentUser: null,
        ads: mergedAds,
        stores: mergedStores,
        language: LANGUAGES[0],
        view: { name: 'home' },
        searchTerm: '',
        selectedCategory: 'all',
        basket: savedBasket || [],
        orders: savedOrders || [],
      };

      i18n.setLanguage(this.state.language);
      
      // Auto-login if user ID is saved
      if (savedCurrentUserId) {
        const savedUser = this.state.users.find(u => u.id === savedCurrentUserId);
        if (savedUser) {
          this.state.currentUser = savedUser;
        } else {
          // Clear invalid saved user ID
          this.clearCurrentUserIdFromStorage();
        }
      }

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
        deleteAd: this.deleteAd.bind(this),
        createStore: this.createStore.bind(this),
        updateStore: this.updateStore.bind(this),
        openLogin: () => renderLogin(this.state, this.actions),
        deleteAccount: this.deleteAccount.bind(this),
        becomeRevisor: this.becomeRevisor.bind(this),
        addEarnings: this.addEarnings.bind(this),
        addToBasket: this.addToBasket.bind(this),
        removeFromBasket: this.removeFromBasket.bind(this),
        updateBasketQuantity: this.updateBasketQuantity.bind(this),
        clearBasket: this.clearBasket.bind(this),
        checkout: this.checkout.bind(this),
      };
    } catch (error) {
      console.error('Error in App constructor:', error);
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = `<div class="alert alert-danger m-3">
          <h4>Application Error</h4>
          <p>Failed to initialize application. Please check the console for details.</p>
          <pre>${error instanceof Error ? error.message : String(error)}</pre>
        </div>`;
      }
      throw error;
    }
  }

  setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState };
    
    // Persist users, ads, stores, and currentUser to localStorage whenever state changes
    if (newState.users !== undefined) {
      this.saveUsersToStorage(this.state.users);
    }
    if (newState.ads !== undefined) {
      this.saveAdsToStorage(this.state.ads);
    }
    if (newState.stores !== undefined) {
      this.saveStoresToStorage(this.state.stores);
    }
    if (newState.currentUser !== undefined) {
      if (this.state.currentUser) {
        this.saveCurrentUserIdToStorage(this.state.currentUser.id);
      } else {
        this.clearCurrentUserIdFromStorage();
      }
    }
    if (newState.basket !== undefined) {
      this.saveBasketToStorage(this.state.basket);
    }
    if (newState.orders !== undefined) {
      this.saveOrdersToStorage(this.state.orders);
    }
    
    this.render();
  }

  // LocalStorage helper methods
  private saveUsersToStorage(users: User[]) {
    try {
      // Don't save passwords to localStorage for security (in a real app, use tokens)
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      localStorage.setItem('presto_users', JSON.stringify(usersWithoutPasswords));
      // Save passwords separately (not ideal, but needed for demo)
      const userPasswords = users.reduce((acc, user) => {
        if (user.password) {
          acc[user.id] = user.password;
        }
        return acc;
      }, {} as Record<number, string>);
      localStorage.setItem('presto_user_passwords', JSON.stringify(userPasswords));
    } catch (e) {
      console.error('Failed to save users to localStorage:', e);
    }
  }

  private loadUsersFromStorage(): User[] {
    try {
      const usersJson = localStorage.getItem('presto_users');
      const passwordsJson = localStorage.getItem('presto_user_passwords');
      if (usersJson && passwordsJson) {
        const users = JSON.parse(usersJson);
        const passwords = JSON.parse(passwordsJson);
        return users.map((user: any) => ({
          ...user,
          password: passwords[user.id] || undefined
        }));
      }
    } catch (e) {
      console.error('Failed to load users from localStorage:', e);
    }
    return [];
  }

  private saveCurrentUserIdToStorage(userId: number) {
    try {
      localStorage.setItem('presto_current_user_id', String(userId));
    } catch (e) {
      console.error('Failed to save current user ID to localStorage:', e);
    }
  }

  private loadCurrentUserIdFromStorage(): number | null {
    try {
      const userId = localStorage.getItem('presto_current_user_id');
      return userId ? parseInt(userId, 10) : null;
    } catch (e) {
      console.error('Failed to load current user ID from localStorage:', e);
      return null;
    }
  }

  private clearCurrentUserIdFromStorage() {
    try {
      localStorage.removeItem('presto_current_user_id');
    } catch (e) {
      console.error('Failed to clear current user ID from localStorage:', e);
    }
  }

  private saveAdsToStorage(ads: Ad[]) {
    try {
      const adsJson = JSON.stringify(ads);
      // Check size (localStorage limit is usually 5-10MB)
      const sizeInMB = new Blob([adsJson]).size / (1024 * 1024);
      if (sizeInMB > 5) {
        console.warn(`Ads data is ${sizeInMB.toFixed(2)}MB, which may exceed localStorage limit`);
      }
      localStorage.setItem('presto_ads', adsJson);
    } catch (e: any) {
      console.error('Failed to save ads to localStorage:', e);
      // If it's a quota exceeded error, try to compress or remove old data
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn('localStorage quota exceeded. Consider removing old ads.');
      }
    }
  }

  private loadAdsFromStorage(): Ad[] {
    try {
      const adsJson = localStorage.getItem('presto_ads');
      if (adsJson) {
        return JSON.parse(adsJson);
      }
    } catch (e) {
      console.error('Failed to load ads from localStorage:', e);
    }
    return [];
  }

  private saveStoresToStorage(stores: Store[]) {
    try {
      localStorage.setItem('presto_stores', JSON.stringify(stores));
    } catch (e) {
      console.error('Failed to save stores to localStorage:', e);
    }
  }

  private loadStoresFromStorage(): Store[] {
    try {
      const storesJson = localStorage.getItem('presto_stores');
      if (storesJson) {
        return JSON.parse(storesJson);
      }
    } catch (e) {
      console.error('Failed to load stores from localStorage:', e);
    }
    return [];
  }

  private saveBasketToStorage(basket: BasketItem[]) {
    try {
      localStorage.setItem('presto_basket', JSON.stringify(basket));
    } catch (e) {
      console.error('Failed to save basket to localStorage:', e);
    }
  }

  private loadBasketFromStorage(): BasketItem[] {
    try {
      const basketJson = localStorage.getItem('presto_basket');
      if (basketJson) {
        return JSON.parse(basketJson);
      }
    } catch (e) {
      console.error('Failed to load basket from localStorage:', e);
    }
    return [];
  }

  private saveOrdersToStorage(orders: Order[]) {
    try {
      localStorage.setItem('presto_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }

  private loadOrdersFromStorage(): Order[] {
    try {
      const ordersJson = localStorage.getItem('presto_orders');
      if (ordersJson) {
        return JSON.parse(ordersJson);
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage:', e);
    }
    return [];
  }

  login(email, password) {
    const user = this.state.users.find(u => u.email === email && u.password === password);
    if (user) {
      // Check if user was trying to checkout
      const returnToCheckout = sessionStorage.getItem('returnToCheckout') === 'true';
      sessionStorage.removeItem('returnToCheckout');
      
      const nextView = returnToCheckout ? { name: 'checkout' } : { name: 'create_ad' };
      this.setState({ currentUser: user, view: nextView });
      // Explicitly save to ensure persistence
      this.saveCurrentUserIdToStorage(user.id);
      return true;
    }
    return false;
  }
  
  register(name, email, password) {
    const newUser: User = { id: Date.now(), name, email, isRevisor: false, password, earnings: 0 };
    const updatedUsers = [...this.state.users, newUser];
    this.setState({
        users: updatedUsers,
        currentUser: newUser,
        view: { name: 'create_ad' }
    });
    // Explicitly save to ensure persistence
    this.saveUsersToStorage(updatedUsers);
    this.saveCurrentUserIdToStorage(newUser.id);
  }

  deleteAccount() {
    if (!this.state.currentUser) return;
    const userId = this.state.currentUser.id;
    
    // Remove user's ads
    const remainingAds = this.state.ads.filter(ad => ad.userId !== userId);
    
    // Remove user's store if exists
    const remainingStores = this.state.stores.filter(store => store.ownerId !== userId);
    
    // Remove user from users list
    const remainingUsers = this.state.users.filter(u => u.id !== userId);
    
    this.setState({
      users: remainingUsers,
      currentUser: null,
      ads: remainingAds,
      stores: remainingStores,
      view: { name: 'home' }
    });
    // Explicitly save updated users and clear current user
    this.saveUsersToStorage(remainingUsers);
    this.clearCurrentUserIdFromStorage();
  }

  logout() {
    this.setState({ currentUser: null, view: { name: 'home' } });
    // Explicitly clear from localStorage
    this.clearCurrentUserIdFromStorage();
  }

  addAd(newAd: NewAd) {
    if (!this.state.currentUser) return;
    const currentUserId = this.state.currentUser.id;
    const ad: Ad = {
      id: Date.now(),
      userId: currentUserId,
      status: 'pending',
      price: newAd.price,
      category: newAd.category,
      images: newAd.images,
      title: { it: newAd.title, en: newAd.title, es: newAd.title },
      description: { it: newAd.description, en: newAd.description, es: newAd.description },
      storeId: newAd.storeId,
    };
    
    // Only apply ensureAdImage if we don't have valid uploaded images (base64 data URLs)
    // Base64 data URLs start with "data:" so we check for that
    const hasValidUploadedImage = ad.images && 
                                   ad.images.length > 0 && 
                                   ad.images[0] && 
                                   typeof ad.images[0] === 'string' &&
                                   ad.images[0].trim().length > 0 &&
                                   (ad.images[0].startsWith('data:') || ad.images[0].startsWith('/images/'));
    
    if (!hasValidUploadedImage) {
      // Only guess image from title if no valid uploaded image exists
      if (!ad.images || !ad.images[0]) {
        const guessed = guessImageFromTitle(i18n.tContent(ad.title));
        if (guessed) {
          ad.images = [guessed];
        }
      }
      // Apply ensureAdImage only if we don't have a valid uploaded image
      ensureAdImage(ad);
    }
    
    // Ensure currentUser is preserved by finding it from the users array
    const updatedUser = this.state.users.find(u => u.id === currentUserId) || this.state.currentUser;
    
    const updatedAds = [ad, ...this.state.ads];
    this.setState({ 
      ads: updatedAds, 
      currentUser: updatedUser,
      view: { name: 'home' } 
    });
    // Explicitly save to ensure persistence
    this.saveAdsToStorage(updatedAds);
    alert(i18n.t('ad_created_success'));
  }

  updateAd(updatedAd: Ad) {
    // Ensure updated ad has valid image path
    ensureAdImage(updatedAd);
    
    // Track earnings if a revisor is reviewing an ad (status changed from pending to approved/rejected)
    const oldAd = this.state.ads.find(ad => ad.id === updatedAd.id);
    const wasPending = oldAd?.status === 'pending';
    const isReviewed = (updatedAd.status === 'approved' || updatedAd.status === 'rejected') && wasPending;
    
    if (isReviewed && this.state.currentUser?.isRevisor) {
      // Award earnings for reviewing an ad (€0.50 per review)
      const earningsPerReview = 0.5;
      this.addEarnings(this.state.currentUser.id, earningsPerReview);
    }
    
    const ads = this.state.ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad);
    // Preserve currentUser
    const currentUserId = this.state.currentUser?.id;
    const updatedUser = currentUserId ? this.state.users.find(u => u.id === currentUserId) || this.state.currentUser : null;
    this.setState({ ads, currentUser: updatedUser });
    // Explicitly save to ensure persistence
    this.saveAdsToStorage(ads);
  }
  
  createStore(storeName, storeDescription) {
    if (!this.state.currentUser) return;
    const currentUserId = this.state.currentUser.id;
    const newStore: Store = {
      id: Date.now(),
      name: storeName,
      description: storeDescription,
      logo: `https://picsum.photos/seed/store${Date.now()}/100/100`,
      ownerId: currentUserId,
    };
    const updatedUser = { ...this.state.currentUser, storeId: newStore.id };
    // Update users array and ensure currentUser reference is maintained
    const updatedUsers = this.state.users.map(u => u.id === currentUserId ? updatedUser : u);
    const updatedStores = [...this.state.stores, newStore];
    this.setState({
      stores: updatedStores,
      users: updatedUsers,
      currentUser: updatedUser,
      view: { name: 'store_detail', storeId: newStore.id },
    });
    // Explicitly save to ensure persistence
    this.saveUsersToStorage(updatedUsers);
    this.saveStoresToStorage(updatedStores);
    this.saveCurrentUserIdToStorage(updatedUser.id);
  }

  updateStore(storeId, storeName, storeDescription) {
    if (!this.state.currentUser) return;
    const store = this.state.stores.find(s => s.id === storeId);
    if (!store || store.ownerId !== this.state.currentUser.id) return;
    
    const updatedStore = { ...store, name: storeName, description: storeDescription };
    const updatedStores = this.state.stores.map(s => s.id === storeId ? updatedStore : s);
    
    // Preserve currentUser
    const currentUserId = this.state.currentUser.id;
    const updatedUser = this.state.users.find(u => u.id === currentUserId) || this.state.currentUser;
    
    this.setState({ stores: updatedStores, currentUser: updatedUser });
    // Explicitly save to ensure persistence
    this.saveStoresToStorage(updatedStores);
  }

  deleteAd(adId: number) {
    if (!this.state.currentUser) return;
    const ads = this.state.ads.filter(ad => ad.id !== adId);
    // Preserve currentUser
    const currentUserId = this.state.currentUser.id;
    const updatedUser = this.state.users.find(u => u.id === currentUserId) || this.state.currentUser;
    this.setState({ ads, currentUser: updatedUser });
  }

  becomeRevisor() {
    if (!this.state.currentUser) return;
    const currentUserId = this.state.currentUser.id;
    const updatedUser = { ...this.state.currentUser, isRevisor: true, earnings: this.state.currentUser.earnings || 0 };
    const updatedUsers = this.state.users.map(u => u.id === currentUserId ? updatedUser : u);
    this.setState({ 
      users: updatedUsers, 
      currentUser: updatedUser 
    });
    // Explicitly save to ensure persistence
    this.saveUsersToStorage(updatedUsers);
    this.saveCurrentUserIdToStorage(updatedUser.id);
  }

  addEarnings(userId: number, amount: number) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;
    
    const currentEarnings = user.earnings || 0;
    const newEarnings = currentEarnings + amount;
    const updatedUser = { ...user, earnings: newEarnings };
    const updatedUsers = this.state.users.map(u => u.id === userId ? updatedUser : u);
    
    // Update currentUser if it's the same user
    let updatedCurrentUser = this.state.currentUser;
    if (this.state.currentUser?.id === userId) {
      updatedCurrentUser = updatedUser;
    }
    
    this.setState({ 
      users: updatedUsers, 
      currentUser: updatedCurrentUser 
    });
    // Explicitly save to ensure persistence
    this.saveUsersToStorage(updatedUsers);
    if (updatedCurrentUser) {
      this.saveCurrentUserIdToStorage(updatedCurrentUser.id);
    }
  }

  addToBasket(adId: number) {
    const ad = this.state.ads.find(a => a.id === adId);
    if (!ad || ad.status !== 'approved') return;
    
    const existingItem = this.state.basket.find(item => item.adId === adId);
    let updatedBasket: BasketItem[];
    
    if (existingItem) {
      updatedBasket = this.state.basket.map(item =>
        item.adId === adId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedBasket = [...this.state.basket, { adId, quantity: 1, addedAt: Date.now() }];
    }
    
    this.setState({ basket: updatedBasket });
  }

  removeFromBasket(adId: number) {
    const updatedBasket = this.state.basket.filter(item => item.adId !== adId);
    this.setState({ basket: updatedBasket });
  }

  updateBasketQuantity(adId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromBasket(adId);
      return;
    }
    
    const updatedBasket = this.state.basket.map(item =>
      item.adId === adId
        ? { ...item, quantity }
        : item
    );
    
    this.setState({ basket: updatedBasket });
  }

  clearBasket() {
    this.setState({ basket: [] });
  }

  checkout(paymentMethod: string) {
    if (!this.state.currentUser) {
      alert(i18n.t('login_required_for_checkout'));
      return;
    }
    
    if (this.state.basket.length === 0) {
      alert(i18n.t('basket_empty'));
      return;
    }
    
    // Calculate total
    const total = this.state.basket.reduce((sum, item) => {
      const ad = this.state.ads.find(a => a.id === item.adId);
      return sum + (ad ? ad.price * item.quantity : 0);
    }, 0);
    
    // Create order
    const newOrder: Order = {
      id: Date.now(),
      userId: this.state.currentUser.id,
      items: [...this.state.basket],
      total,
      status: 'completed',
      createdAt: Date.now(),
      paymentMethod,
    };
    
    // Add order and clear basket
    const updatedOrders = [...this.state.orders, newOrder];
    this.setState({ orders: updatedOrders, basket: [] });
    
    // Show success message
    alert(i18n.t('order_success').replace('{total}', i18n.formatPrice(total)));
    
    // Navigate to home
    this.setState({ view: { name: 'home' } });
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
      case 'profile':
        return renderProfile(this.state, this.actions);
      case 'my_listings':
        return renderMyListings(this.state, this.actions);
      case 'manage_store':
        return renderManageStore(this.state, this.actions);
      case 'basket':
        return renderBasket(this.state, this.actions);
      case 'checkout':
        return renderCheckout(this.state, this.actions);
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