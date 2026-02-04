<script>
  import { createCard, updateCard } from "../services/card.service";
  import Card from "./Card.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { Plus, Trash2, Pen } from "@lucide/svelte";
  import { form } from "../store/form.svelte";
  import { deleteList, updateList } from "../services/list.service";
  import ModalForm from "./modals/ModalForm.svelte";
  import ModalConfirm from "./modals/ModalConfirm.svelte";
  import { openModal } from "../utils/modal";
  import { authStore } from "../store/auth.svelte";

  let { lists = $bindable(), list } = $props();

  let hovered = $state(false);

  const handleConsider = (e) => {
    list.cards = e.detail.items; // Update the lists with the new order
  };

  const handleDrop = (e) => {
    const cardId = e.detail.info.id; // Get the ID of the card being moved

    // find the card in the lists
    const listHoldingCard = lists.find((list) =>
      list.cards.find((card) => card.id === cardId)
    );

    const card = listHoldingCard.cards.find((card) => card.id === cardId);

    list.cards = e.detail.items;
    // if in the same list as before, update the positions of the cards in the list
    if (card.list_id === listHoldingCard.id) {
      list.cards.forEach((card) => {
        card.position = list.cards.indexOf(card) + 1; // Update the position based on the new order
        updateCard(card);
      });
    } else {
      // if in a different list, update the positions of the cards of the original list and the new list
      const originalList = lists.find((list) => list.id === card.list_id);
      originalList.cards = originalList.cards.filter((c) => c.id !== cardId);
      originalList.cards.forEach((card) => {
        card.position = originalList.cards.indexOf(card) + 1; // Update the position based on the new order
        updateCard(card);
      });
      card.list_id = listHoldingCard.id;

      listHoldingCard.cards.forEach((card) => {
        card.position = listHoldingCard.cards.indexOf(card) + 1; // Update the position based on the new order
        updateCard(card);
      });
    }
  };

  const editList = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    try {
      const updatedList = await updateList({ id: list.id, title: text });

      list.title = updatedList.title; // Update the list title in the local state

      e.target.reset();

      const modal = document.getElementById(`edit-list-${list.id}`);
      modal.close(); // Close the modal after adding the list
    } catch (e) {
      form.error =
        "Une erreur s'est produite lors de la mise à jour de la liste.";
    }
  };

  const removeList = () => {
    try {
      deleteList(list.id);
      lists = lists.filter((l) => l.id !== list.id); // Remove the deleted list from the local state
    } catch (e) {
      form.error =
        "Une erreur s'est produite lors de la suppression de la liste.";
    }
  };

  const addCard = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    try {
      const card = await createCard({
        content: text,
        position: list.cards.length + 1,
        list_id: list.id,
      });

      list.cards.push(card);

      e.target.reset();

      const modal = document.getElementById(`add-card-${list.id}`);
      modal.close(); // Close the modal after adding the list
    } catch (e) {
      form.error = "Une erreur s'est produite lors de la création de la carte.";
    }
  };
</script>

<div
  onmouseover={() => {
    hovered = true;
  }}
  onfocus={() => {
    hovered = true;
  }}
  onblur={() => {
    hovered = false;
  }}
  onmouseout={() => {
    hovered = false;
  }}
  role="list"
  class="bg-gray-100 shadow-md rounded-lg p-4 border border-2 min-w-[500px]"
>
  <div class="flex justify-between items-center relative pb-2">
    <div>
      <h2>
        {list.title}
      </h2>
    </div>
    <!-- {#if authStore.user.role.name === "admin"} -->
    <div
      class={`flex gap-2 absolute right-0 items-center h-ful ${hovered ? "opacity-100" : "opacity-0"}`}
    >
      <button
        onclick={() => openModal(`edit-list-${list.id}`)}
        class="bg-yellow-500 text-white px-2 py-1 rounded"
      >
        <Pen />
      </button>
      <button
        onclick={() => openModal(`confirm-delete-list-${list.id}`)}
        class="bg-red-500 text-white px-2 py-1 rounded"
      >
        <Trash2 />
      </button>
      <button
        onclick={() => openModal(`add-card-${list.id}`)}
        class="flex bg-blue-500 text-white px-2 py-1 rounded"
      >
        <Plus /> Add Card
      </button>
    </div>
    <ModalForm
      title="Modifier la liste"
      modalId={`edit-list-${list.id}`}
      msg=""
    >
      <div class="flex flex-col gap-2">
        <form onsubmit={editList}>
          <input
            type="text"
            name="text"
            value={list.title}
            class="input mb-4"
            required
          />
          <div class="flex justify-center">
            <button class="bg-blue-500 text-white px-2 py-1 rounded"
              >Modifier</button
            >
          </div>
        </form>
        <form method="dialog">
          <div class="flex justify-center">
            <button class="bg-red-500 text-white px-2 py-1 rounded"
              >Annuler</button
            >
          </div>
        </form>
      </div>
    </ModalForm>
    <ModalConfirm
      modalId={`confirm-delete-list-${list.id}`}
      msg="Confirmez que vous souhaitez supprimer cette liste"
      handleConfirm={removeList}
    />
    <ModalForm title="Ajouter une carte" modalId={`add-card-${list.id}`} msg="">
      <div class="flex flex-col gap-2">
        <form onsubmit={addCard}>
          <textarea class="textarea" name="text"></textarea>
          <div class="flex justify-center">
            <button class="bg-blue-500 text-white px-2 py-1 rounded"
              >Ajouter</button
            >
          </div>
        </form>
        <form method="dialog">
          <div class="flex justify-center">
            <button class="bg-red-500 text-white px-2 py-1 rounded"
              >Annuler</button
            >
          </div>
        </form>
      </div>
    </ModalForm>
    <!-- {/if} -->
  </div>
  <div
    use:dndzone={{ items: list.cards, type: "card" }}
    onconsider={handleConsider}
    onfinalize={handleDrop}
    class="flex flex-col gap-2 mt-2 min-h-[50px]"
  >
    {#each list.cards as card (card.id)}
      <Card {list} {card} />
    {/each}
  </div>
</div>
