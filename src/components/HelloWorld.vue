<script setup lang="ts">
import {useGameStore} from "../gameStore";
import {computed} from "vue";

const board = computed(()=>{
  return useGameStore().board;
})
</script>

<template>
  <div class="flex flex-row mt-20 ml-10 gap-4">
    <div v-for="tile in board.gameTiles" class="w-40">
      {{tile.tileKind}}
    </div>

  </div>
</template>
