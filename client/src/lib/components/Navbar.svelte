<script>
  import { getUser, loginUser, registerUser } from "../services/auth.service";
  import {
    authStore,
    clearAuth,
    isAuthenticated,
    setAuth,
  } from "../store/auth.svelte";
  import { form } from "../store/form.svelte";
  import { openModal } from "../utils/modal";
  import ModalForm from "./modals/ModalForm.svelte";

  const login = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const { token, user } = await loginUser({ username, password });

      setAuth(user, token);

      //setAuth(username, token);

      const modal = document.getElementById(`login`);
      modal.close(); // Close the modal after adding the list

      window.location.reload();
    } catch (e) {
      form.error = "Une erreur est survenue lors de la connexion.";
    }
  };

  const register = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    try {
      // Call your API to register the user
      await registerUser({ username, password, confirmPassword });

      const modal = document.getElementById(`register`);
      modal.close(); // Close the modal after adding the list
    } catch (e) {
      form.error = "Une erreur est survenue lors de l'inscription.";
    }
  };
</script>

<div class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl">O'Kanban</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      {#if !isAuthenticated()}
      <li>
        <button onclick={() => openModal(`register`)}>Inscription</button>
      </li>
      <li>
        <button onclick={() => openModal(`login`)}>Connexion</button>
      </li>
      {:else}
        <li>
          Hello, {authStore.user.username || "undefined"} : {authStore.user.role.name || "undefined"} !
          <button onclick={clearAuth}>Déconnexion</button>
        </li>
      {/if}
    </ul>
  </div>
</div>
<ModalForm title="Inscription" modalId={`register`} msg="">
  <div class="flex flex-col gap-2">
    <form onsubmit={register}>
      <div class="flex flex-col gap-2">
        <input
          type="text"
          name="username"
          class="input mb-4"
          placeholder="Nom d'utilisateur"
          required
        />
        <input
          type="password"
          name="password"
          class="input mb-4"
          placeholder="Mot de passe"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          class="input mb-4"
          placeholder="Confirmation du mot de passe"
          required
        />
        <div class="flex justify-center">
          <button class="bg-blue-500 text-white px-2 py-1 rounded"
            >Inscription</button
          >
        </div>
      </div>
    </form>
    <form method="dialog">
      <div class="flex justify-center">
        <button class="bg-red-500 text-white px-2 py-1 rounded">Annuler</button>
      </div>
    </form>
  </div>
</ModalForm>
<ModalForm title="Connexion" modalId={`login`} msg="">
  <div class="flex flex-col gap-2">
    <form onsubmit={login}>
      <div class="flex flex-col gap-2">
        <input
          type="text"
          name="username"
          class="input mb-4"
          placeholder="Nom d'utilisateur"
          required
        />
        <input
          type="password"
          name="password"
          class="input mb-4"
          placeholder="Mot de passe"
          required
        />
        <div class="flex justify-center">
          <button class="bg-blue-500 text-white px-2 py-1 rounded"
            >Connexion</button
          >
        </div>
      </div>
    </form>
    <form method="dialog">
      <div class="flex justify-center">
        <button class="bg-red-500 text-white px-2 py-1 rounded">Annuler</button>
      </div>
    </form>
  </div>
</ModalForm>