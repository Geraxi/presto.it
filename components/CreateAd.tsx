import { i18n } from '../hooks/useI18n.js';
import { CATEGORY_KEYS } from '../constants.js';
import { censorImageFaces } from '../services/geminiService.js';
import { Spinner } from './ui/Spinner.js';

// Fix: Add types and improve error handling for file-to-base64 conversion.
const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        return reject(new Error('File could not be read as string.'));
      }
      const [mimeType, base64] = result.split(',');
      resolve({ base64, mimeType: mimeType.replace('data:', '').replace(';base64', '') });
    }
    reader.onerror = error => reject(error);
  });

export const renderCreateAd = (state, actions) => {
  const { currentUser, stores } = state;
  const { addAd, setView } = actions;
  const userStore = currentUser?.storeId ? stores.find(s => s.id === currentUser.storeId) : null;
  
  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!currentUser) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h2 class="h2 fw-bold">${i18n.t('must_be_logged_in_to_post')}</h2>
        <button class="btn btn-primary mt-4" id="back-btn">${i18n.t('back_to_home')}</button>
      </div>`;
    // Fix: Add type assertion to resolve 'onclick' property error.
    container.querySelector<HTMLButtonElement>('#back-btn')!.onclick = () => setView({ name: 'home' });
    return container;
  }
  
  const formCard = document.createElement('div');
  formCard.className = 'card shadow-xl border-0 mx-auto';
  formCard.style.maxWidth = '700px';

  formCard.innerHTML = `
    <div class="card-body p-5">
      <h2 class="card-title h2 fw-bold text-dark mb-4">${i18n.t('create_new_ad')}</h2>
      <form id="create-ad-form" class="row g-3">
        <div class="col-md-12">
          <label for="title" class="form-label">${i18n.t('title')}</label>
          <input type="text" class="form-control" id="title" required>
        </div>
        <div class="col-md-6">
          <label for="price" class="form-label">${i18n.t('price')} (€)</label>
          <input type="number" class="form-control" id="price" required>
        </div>
        <div class="col-md-6">
          <label for="category" class="form-label">${i18n.t('category')}</label>
          <select id="category" class="form-select">
            ${CATEGORY_KEYS.map(cat => `<option value="${cat}">${i18n.tCategory(cat)}</option>`).join('')}
          </select>
        </div>
        <div class="col-12">
          <label for="description" class="form-label">${i18n.t('description')}</label>
          <textarea class="form-control" id="description" rows="4" required></textarea>
        </div>
        <div class="col-12">
            <label class="form-label">${i18n.t('upload_images')}</label>
            <div class="text-center p-4 border-2 border-dashed rounded-3" id="drop-zone">
                <i class="bi bi-cloud-arrow-up fs-1 text-primary"></i>
                <p class="m-0"><label for="file-upload" class="text-primary fw-bold" style="cursor: pointer;">${i18n.t('upload_a_file')}</label> ${i18n.t('or_drag_and_drop')}</p>
                <input type="file" id="file-upload" multiple class="d-none" accept="image/png, image/jpeg">
                <p class="text-muted small">${i18n.t('file_types_and_size')}</p>
            </div>
            <div id="image-preview" class="mt-3 row g-2"></div>
        </div>
        <div class="col-12">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="censor-faces">
                <label class="form-check-label" for="censor-faces">${i18n.t('anonymize_faces')}</label>
            </div>
        </div>
        ${userStore ? `
        <div class="col-12">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="add-to-store" checked>
                <label class="form-check-label" for="add-to-store">
                    ${i18n.t('add_to_store')} "${userStore.name}"
                </label>
            </div>
        </div>
        ` : ''}
        <div class="col-12">
            <button type="submit" class="btn btn-primary btn-lg w-100">${i18n.t('submit_ad')}</button>
        </div>
      </form>
    </div>
  `;
  
  let images: string[] = [];
  const previewContainer = formCard.querySelector<HTMLDivElement>('#image-preview')!;
  // Fix: Add type assertion to resolve 'onchange' property error.
  const fileInput = formCard.querySelector<HTMLInputElement>('#file-upload')!;

  const renderPreviews = () => {
    previewContainer.innerHTML = '';
    images.forEach((img, index) => {
        const preview = document.createElement('div');
        preview.className = 'col-4 col-sm-3';
        preview.innerHTML = `
            <div class="position-relative">
                <img src="${img}" class="img-fluid rounded" alt="Preview ${index}">
                <button type="button" class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .4rem; --bs-btn-font-size: .75rem;">&times;</button>
            </div>
        `;
        // Fix: Add type assertion to resolve 'onclick' property error.
        preview.querySelector<HTMLButtonElement>('button')!.onclick = () => {
            images.splice(index, 1);
            renderPreviews();
        };
        previewContainer.append(preview);
    });
  }

  fileInput.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const filesArray = Array.from(target.files);
      // Fix: Improved file to base64 conversion now provides correct types.
      const base64Images = await Promise.all(filesArray.map(file => fileToBase64(file).then(r => `data:${r.mimeType};base64,${r.base64}`)));
      images = [...images, ...base64Images];
      renderPreviews();
    }
  };

  // Fix: Add type assertion to resolve 'onsubmit' property error.
  const form = formCard.querySelector<HTMLFormElement>('#create-ad-form')!;
  form.onsubmit = async (e) => {
    e.preventDefault();
    // Fix: Add type assertion to resolve 'disabled' property error.
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '';
    submitBtn.disabled = true;
    submitBtn.append(Spinner({size: 'sm'}));

    try {
      let processedImages = images;
      // Fix: Add type assertion to resolve 'checked' property error.
      if ((form.querySelector('#censor-faces') as HTMLInputElement).checked && images.length > 0) {
        processedImages = await Promise.all(
          images.map(async (img) => {
            const [header, base64] = img.split(',');
            const mimeType = header.replace('data:', '').replace(';base64', '');
            const censoredBase64 = await censorImageFaces(base64, mimeType);
            return `data:${mimeType};base64,${censoredBase64}`;
          })
        );
      }
      // Fix: Add type assertions to resolve 'value' property errors.
      const addToStoreCheckbox = form.querySelector('#add-to-store') as HTMLInputElement;
      const addToStore = userStore && addToStoreCheckbox && addToStoreCheckbox.checked;
      
      addAd({
        title: (form.querySelector('#title') as HTMLInputElement).value,
        description: (form.querySelector('#description') as HTMLTextAreaElement).value,
        price: parseFloat((form.querySelector('#price') as HTMLInputElement).value),
        category: (form.querySelector('#category') as HTMLSelectElement).value as any,
        images: processedImages,
        storeId: addToStore ? userStore.id : undefined
      });
    } catch (error) {
      console.error("Error processing ad:", error);
      alert(i18n.t('ad_processing_error'));
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  };

  container.appendChild(formCard);
  return container;
};