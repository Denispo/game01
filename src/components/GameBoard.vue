<script setup lang="ts">
import {useGame} from "../gameStore";
import {computed} from "vue";
import GameTileBank from "./GameTileBank.vue";
import GameTileDarkStreet from "./GameTileDarkStreet.vue";

const board = computed(()=>{
  return useGame().board;
})
</script>

<template>
  <div class="flex flex-row mt-20 ml-10 gap-4">
    <div v-for="(tile, index) in board.gameTiles" class="w-40">
      <template v-if="tile.tileKind === 'BANK'"><GameTileBank :my-index="index"></GameTileBank></template>
      <template v-if="tile.tileKind === 'DARKSTREET'"><GameTileDarkStreet :my-index="index"></GameTileDarkStreet></template>

    </div>

  </div>
</template>
