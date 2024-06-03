<script setup lang="ts">
import {useGame} from "../gameStore";
import {computed} from "vue";
import GameTile from "./GameTile.vue";

const gameTileList = computed(()=>{
  return useGame().gameTileList;
})
</script>

<template>
  <div class="flex flex-row mt-20 ml-10 gap-4">
    <div v-for="(tileId) in gameTileList" :key="tileId" class="w-40">
      <GameTile :id="tileId"></GameTile>

    </div>

  </div>
</template>
