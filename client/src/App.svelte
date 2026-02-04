<script>
  import { onMount } from "svelte";
  import List from "./lib/components/List.svelte";
  import { dndzone } from "svelte-dnd-action";
  import Navbar from "./lib/components/Navbar.svelte";
  import { openModal } from "./lib/utils/modal";
  import {
    createList,
    getLists,
    updateList,
  } from "./lib/services/list.service";
  import { getCards } from "./lib/services/card.service";
  import { form } from "./lib/store/form.svelte";
  import ModalForm from "./lib/components/modals/ModalForm.svelte";
  import { authStore, getAuth, isAuthenticated } from "./lib/store/auth.svelte";

  let lists = $state([]);

  onMount(() => {
    getLists().then((fetchedLists) => {
      const promises = fetchedLists.map((list) =>
        getCards(list.id).then((cards) => {
          list.cards = cards.sort((a, b) => a.position - b.position); // Trier les cartes par la propriété position
          return list;
        })
      );

      Promise.all(promises).then((completedLists) => {
        // Trier les listes par la propriété position
        lists = completedLists.sort((a, b) => a.position - b.position);
      });
    });
  });

  $effect(() => {
    getAuth();
  });

  const handleConsider = (e) => {
    lists = e.detail.items;
  };

  const handleDrop = (e) => {
    lists = e.detail.items;
    lists.forEach((list) => {
      list.position = lists.indexOf(list) + 1; // Update the position based on the new order

      updateList(list);
    });
  };

  const addList = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    try {
      const list = await createList({
        title: text,
        position: lists.length + 1,
      });

      lists.push({ ...list, cards: [] });

      e.target.reset();

      const modal = document.getElementById(`add-list`);
      modal.close(); // Close the modal after adding the list
    } catch (e) {
      form.error = "Une erreur s'est produite lors de la création de la liste.";
    }
  };
</script>

<Navbar />

{#if isAuthenticated()}
<section class="container mx-auto pr-8">
  <div class="flex justify-between mt-4">
    <!-- {#if authStore.user.role.name === "admin"} -->
    <button
      onclick={() => openModal(`add-list`)}
      class="bg-blue-500 text-white px-4 py-2 rounded">Add List</button
    >
    <ModalForm title="Ajouter une liste" modalId={`add-list`} msg="">
      <div class="flex flex-col gap-2">
        <form onsubmit={addList}>
          <input
            type="text"
            name="text"
            class="input mb-4"
            placeholder="Nom de la liste"
            required
          />

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
    use:dndzone={{ items: lists, type: "list" }}
    onconsider={handleConsider}
    onfinalize={handleDrop}
    class="flex gap-4 mt-4"
  >
    {#if lists.length}
      {#each lists as list (list.id)}
        <List bind:lists {list} />
      {/each}
    {:else}
      <div
        class="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg"
      >
        <p class="text-gray-500">No lists available</p>
      </div>
    {/if}
  </div>
</section>
{:else}
  <section class="container mx-auto pr-8">
    <div class="flex justify-center mt-4">
      <h1 class="text-2xl font-bold">
        Veuillez vous connecter pour voir les listes
      </h1>
    </div>
  </section>
{/if} 
