<script setup lang="ts">
import {useGame} from "../gameStore";
import {computed} from "vue";
import GameTile from "./GameTile.vue";
import PlayerSheet from "./PlayerSheet.vue";

const gameTileList = computed(()=>{
  return useGame().gameTileList;
})

const players = computed(()=>{
  return useGame().players;
})
</script>

<template>
  <div class="flex flex-row mt-20 ml-10 gap-4">
    <div v-for="(tileId) in gameTileList" :key="tileId" class="w-40">
      <GameTile :id="tileId"></GameTile>
    </div>

  </div>
  <div class="flex flex-row mt-20 ml-10 gap-4 pb-10">
    <template v-for="(value, index) in players" :key="index">
      <PlayerSheet :player-index="index"></PlayerSheet>
    </template>

  </div>
</template>
