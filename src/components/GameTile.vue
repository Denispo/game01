<script setup lang="ts">
import {GameTileIndex, Player, PlayerIndex, useGame} from "../gameStore";
import {computed} from "vue";

const props = defineProps<{index:GameTileIndex}>();


const currentTile = computed(()=>{
  return useGame().gameTileList[props.index];
})

const players = computed(()=>{
    return useGame().players;
})

const currentPlayerIndex = computed(()=>{
    return useGame().currentPlayerIndex;
})

</script>

<template>
    <div class="w-40 bg-gray-800">
        <template v-if="currentTile">
            <div class="h-[30px]">
              <template v-for="playerIindex in currentTile.playersOnTile">
                  <span :class="[currentPlayerIndex === playerIindex]">{{players[playerIindex].name}}</span>
              </template>
            </div>
            <div class="text-center p-2"><span class="text-2xl">{{currentTile.name}}</span></div>
            <hr class="border-gray-500">
            <button v-if="currentTile.actionName" @click=""  class="px-2 py-1 rounded bg-green-600 text-green-200 shadow">{{currentTile.actionName}}</button>
            <div v-for="action in currentTile.tileActions">
                {{action.numbersToRoll}}: {{action.name}}
            </div>
            <hr class="border-gray-500">
            <div v-if="currentTile.tileJobName" class="p-4"><button class="px-2 py-1 rounded bg-green-600 text-green-200 shadow" >{{currentTile.tileJobName}}</button></div>
        </template>
        <template v-else>
            Tile do not exists
        </template>
    </div>
</template>
