import { form } from "../store/form.svelte";

export const openModal = (modalId) => {
  form.error = "";
  const modal = document.getElementById(modalId);
  modal.showModal();
};
