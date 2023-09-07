<script setup lang="ts">

import GameBoard from "./components/GameBoard.vue";
import DiceRollButton from "./components/DiceRollButton.vue";

</script>

<template>
  <div class="min-w-full min-h-full bg-gray-800 text-gray-500">
    <div class="pl-4 pt-4"><DiceRollButton></DiceRollButton></div>
    <GameBoard></GameBoard>
  </div>
</template>