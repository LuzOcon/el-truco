import { getAllNewsletterEmails, deleteNewsletterEmail } from './admin-api.js';

document.addEventListener('DOMContentLoaded', () => {
  const emailList = document.querySelector('#adminEmailList');
  const notificationContainer = document.querySelector('#notificationContainer');

  const deleteConfirmModalEl = document.getElementById('deleteConfirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteModal = deleteConfirmModalEl ? new bootstrap.Modal(deleteConfirmModalEl) : null;

  const searchInput = document.querySelector('#searchEmail');

  let subscribers = [];
  let emailIdToDelete = null;

  // Notificación tipo Bootstrap
  const showNotification = (message, type) => {
    notificationContainer.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>`;
    notificationContainer.appendChild(wrapper);
  };

  // Cargar correos del newsletter
  const loadSubscribers = async () => {
    try {
      subscribers = await getAllNewsletterEmails();
      renderList(subscribers);
    } catch (error) {
      console.error('Error al obtener correos:', error);
      showNotification(`Error al obtener correos: ${error.message}`, 'danger');
    }
  };

  // Filtrar resultados según búsqueda
  searchInput?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = subscribers.filter(s => s.email.toLowerCase().includes(term));
    renderList(filtered);
  });

  const renderList = (list) => {
    emailList.innerHTML = '';
    if (!list || list.length === 0) {
      emailList.innerHTML = `
        <tr><td colspan="2" class="text-center py-4 text-muted">No hay correos suscritos aún.</td></tr>`;
      return;
    }

    list.forEach(sub => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${sub.email}</td>
        <td class="text-end">
          <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${sub.id}">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>`;
      emailList.appendChild(tr);
    });
  };

  // Confirmar eliminación
  const handleTableClick = (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (!deleteBtn) return;

    emailIdToDelete = deleteBtn.dataset.id;
    if (deleteModal) {
      deleteModal.show();
    } else {
      performDelete();
    }
  };

  const performDelete = async () => {
    if (!emailIdToDelete) return;
    confirmDeleteBtn && (confirmDeleteBtn.disabled = true);

    try {
      await deleteNewsletterEmail(emailIdToDelete);
      subscribers = subscribers.filter(s => s.id != emailIdToDelete);
      renderList(subscribers);
      showNotification('Correo eliminado con éxito.', 'success');
    } catch (error) {
      console.error('Error al eliminar:', error);
      showNotification(`No se pudo eliminar: ${error.message}`, 'danger');
    } finally {
      deleteModal && deleteModal.hide();
      confirmDeleteBtn && (confirmDeleteBtn.disabled = false);
      emailIdToDelete = null;
    }
  };

  emailList.addEventListener('click', handleTableClick);
  confirmDeleteBtn?.addEventListener('click', performDelete);
  loadSubscribers();
});
