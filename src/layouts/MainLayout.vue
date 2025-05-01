<template>
  <q-layout view="lHh Lpr lFf">
    <HeaderNav />
    <q-page-container>
      <router-view />
    </q-page-container>
    <AppFooter />
  </q-layout>
</template>

<script setup>
import HeaderNav from 'components/HeaderNav.vue'
import AppFooter from 'components/AppFooter.vue'
</script>
