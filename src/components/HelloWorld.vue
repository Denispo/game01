<script setup lang="ts">
import {useGameStore} from "../gameStore";
import {computed} from "vue";
import GameTileBank from "./GameTileBank.vue";

const board = computed(()=>{
  return useGameStore().board;
})
</script>

<template>
  <div class="flex flex-row mt-20 ml-10 gap-4">
    <div v-for="(tile, index) in board.gameTiles" class="w-40">
      <template v-if="tile.tileKind === 'BANK'"><GameTileBank :my-index="index"></GameTileBank></template>

    </div>

  </div>
</template>
