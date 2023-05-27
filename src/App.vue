<script setup lang="ts">

import HelloWorld from "./components/HelloWorld.vue";
import {useGameStore} from "./gameStore";

</script>

<template>
  <div class="min-w-full min-h-full bg-gray-800 text-gray-500">
    <div class="pl-4 pt-4 text-2xl"><div class="border border-gray-600 w-10 h-10 text-center">{{useGameStore().diceRoledNumber}}</div></div>
    <HelloWorld></HelloWorld>
  </div>
</template>