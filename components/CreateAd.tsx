import { i18n } from '../hooks/useI18n.js';
import { CATEGORY_KEYS } from '../constants.js';
import { censorImageFaces } from '../services/geminiService.js';
import { Spinner } from './ui/Spinner.js';

declare const Cropper: any;

// Helper to ensure Bootstrap is ready before use. It polls for the Modal
// component to become available, providing a robust way to handle script loading delays.
const onBootstrapReady = (callback: () => void) => {
  const checkAndExecute = () => {
    if (window.bootstrap && typeof window.bootstrap.Modal === 'function') {
      callback();
      return true; // Indicates success
    }
    return false; // Indicates bootstrap is not ready
  };

  // If bootstrap is already available, execute immediately.
  if (checkAndExecute()) {
    return;
  }

  // Otherwise, start polling.
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (checkAndExecute()) {
      // If bootstrap becomes available, stop polling.
      clearInterval(interval);
    } else if (attempts > 100) { // Timeout after 5 seconds (100 * 50ms)
      // If it's still not available after the timeout, stop polling and log an error.
      clearInterval(interval);
      console.error('Bootstrap Modal component failed to load in time. Modal cannot be opened.');
    }
  }, 50);
};

// Fix: Add types and improve error handling for file-to-base64 conversion.
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        return reject(new Error('File could not be read as string.'));
      }
      resolve(result);
    }
    reader.onerror = error => reject(error);
  });

export const renderCreateAd = (state, actions) => {
  const { currentUser } = state;
  const { addAd, setView } = actions;
  
  const container = document.createElement('div');
  container.className = 'container py-5';

  if (!currentUser) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h2 class="h2 fw-bold">${i18n.t('must_be_logged_in_to_post')}</h2>
        <button class="btn btn-primary mt-4" id="back-btn">${i18n.t('back_to_home')}</button>
      </div>`;
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
            <div class="text-center p-4 border-2 border-dashed rounded-3" id="drop-zone" style="border-style: dashed;">
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
        <div class="col-12">
            <button type="submit" class="btn btn-primary btn-lg w-100">${i18n.t('submit_ad')}</button>
        </div>
      </form>
    </div>
  `;
  
  let croppedImages: string[] = [];
  const previewContainer = formCard.querySelector<HTMLDivElement>('#image-preview')!;
  const fileInput = formCard.querySelector<HTMLInputElement>('#file-upload')!;

  const renderPreviews = () => {
    previewContainer.innerHTML = '';
    croppedImages.forEach((img, index) => {
        const preview = document.createElement('div');
        preview.className = 'col-4 col-sm-3';
        preview.innerHTML = `
            <div class="position-relative">
                <img src="${img}" class="img-fluid rounded" alt="Preview ${index}">
                <button type="button" class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .4rem; --bs-btn-font-size: .75rem;">&times;</button>
            </div>
        `;
        preview.querySelector<HTMLButtonElement>('button')!.onclick = () => {
            croppedImages.splice(index, 1);
            renderPreviews();
        };
        previewContainer.append(preview);
    });
  };

  const openCropper = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      onBootstrapReady(() => {
        const modalEl = document.createElement('div');
        modalEl.className = 'modal fade';
        modalEl.innerHTML = `
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Crop Image</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div><img id="cropper-image" src="${imageSrc}" style="max-width: 100%;"></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="crop-btn">Crop</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modalEl);
        const modal = new window.bootstrap.Modal(modalEl);
        const image = modalEl.querySelector<HTMLImageElement>('#cropper-image')!;
        
        let cropper: any;

        modalEl.addEventListener('shown.bs.modal', () => {
          cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
          });
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
          cropper.destroy();
          modal.dispose();
          modalEl.remove();
        });

        modalEl.querySelector<HTMLButtonElement>('#crop-btn')!.onclick = () => {
          const canvas = cropper.getCroppedCanvas({
              width: 512,
              height: 512,
          });
          resolve(canvas.toDataURL());
          modal.hide();
        };
        
        modal.show();
      });
    });
  };

  const handleFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const imageSrc = await fileToBase64(file);
      const croppedSrc = await openCropper(imageSrc);
      croppedImages.push(croppedSrc);
      renderPreviews();
    }
  };

  fileInput.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) handleFiles(target.files);
  };
  
  const dropZone = formCard.querySelector<HTMLDivElement>('#drop-zone')!;
  dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('bg-primary-subtle');
  });
  dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('bg-primary-subtle');
  });
  dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('bg-primary-subtle');
      if (e.dataTransfer?.files) {
        handleFiles(e.dataTransfer.files);
      }
  });


  const form = formCard.querySelector<HTMLFormElement>('#create-ad-form')!;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '';
    submitBtn.disabled = true;
    submitBtn.append(Spinner({size: 'sm'}));

    try {
      let processedImages = croppedImages;
      if ((form.querySelector('#censor-faces') as HTMLInputElement).checked && croppedImages.length > 0) {
        processedImages = await Promise.all(
          croppedImages.map(async (img) => {
            const [header, base64] = img.split(',');
            const mimeType = header.replace('data:', '').replace(';base64', '');
            const censoredBase64 = await censorImageFaces(base64, mimeType);
            return `data:${mimeType};base64,${censoredBase64}`;
          })
        );
      }
      addAd({
        title: (form.querySelector('#title') as HTMLInputElement).value,
        description: (form.querySelector('#description') as HTMLTextAreaElement).value,
        price: parseFloat((form.querySelector('#price') as HTMLInputElement).value),
        category: (form.querySelector('#category') as HTMLSelectElement).value as any,
        images: processedImages
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