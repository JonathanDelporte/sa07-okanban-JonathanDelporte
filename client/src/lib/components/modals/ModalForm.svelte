<script>
  import { form } from "../../store/form.svelte";

  let { modalId, msg, title, children } = $props();
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog id={modalId} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">
      {title}
    </h3>
    <p class="py-4">{msg}</p>
    <div class="modal-action justify-center">
      {@render children?.()}
    </div>
    <div class="text-red-500 text-sm mt-2">
      {form.error}
    </div>
  </div>
</dialog>
