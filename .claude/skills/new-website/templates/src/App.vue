<script setup lang="ts">
import { onMounted } from 'vue'

import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

onMounted(() => auth.init())
</script>

<template>
  <main class="min-h-screen bg-paper text-ink flex flex-col items-center justify-center gap-4 p-6">
    <h1 class="text-4xl font-bold text-brand">__TITLE__</h1>
    <p>Your site is live. Start building.</p>

    <!-- Smoke test for Firebase Auth + the admins collection; remove once real UI exists. -->
    <div v-if="auth.ready" class="text-sm">
      <template v-if="auth.user">
        <span>{{ auth.user.email }} ({{ auth.isAdmin ? 'admin' : 'not an admin' }})</span>
        <button class="ml-2 underline" @click="auth.signOutUser()">Sign out</button>
      </template>
      <button v-else class="underline" @click="auth.signInWithGoogle()">Admin sign-in</button>
      <p v-if="auth.error" class="text-red-600">{{ auth.error }}</p>
    </div>
  </main>
</template>
