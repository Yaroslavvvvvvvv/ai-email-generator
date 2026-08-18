<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <main class="flex-1 grid place-items-center p-8">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-semibold tracking-tight">AI Email Generator</h1>
      <p class="text-[var(--aeg-muted)]">Skeleton is live. Build in progress.</p>
      <Button
        :label="colorMode.value === 'dark' ? 'Light' : 'Dark'"
        @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
      />
    </div>
  </main>
</template>
