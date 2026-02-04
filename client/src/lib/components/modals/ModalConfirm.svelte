<script>
  import { form } from "../../store/form.svelte";

  let { modalId, msg, handleConfirm } = $props();
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog id={modalId} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Confirmation</h3>
    <p class="py-4">{msg}</p>
    <div class="modal-action justify-center">
      <div class="flex flex-col gap-2">
        <form method="dialog">
          <div class="flex justify-center gap-2">
            <button
              class="bg-blue-500 text-white px-2 py-1 rounded"
              onclick={handleConfirm}>Oui</button
            >
            <!-- if there is a button in form, it will close the modal -->
            <button class="bg-red-500 text-white px-2 py-1 rounded"
              >Annuler</button
            >
          </div>
        </form>
      </div>
    </div>
    <div class="text-red-500 text-sm mt-2">
      {form.error}
    </div>
  </div>
</dialog>
