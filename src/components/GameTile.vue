<script setup lang="ts">
import {GameTileId, Player, PlayerId, useGame} from "../gameStore";
import {computed} from "vue";

const props = defineProps<{id:GameTileId}>();


const currentTile = computed(()=>{
  return useGame().gameTiles[props.id];
})

const playersOnTile = computed(()=>{
    const result:Array<PlayerId> = [];
    currentTile.value.playersOnTile.forEach((playerId)=>{
        result.push(playerId);
    })
    return result;
})

const players = computed(()=>{
    return useGame().players;
})

const currentPlayerId = computed(()=>{
    return useGame().currentPlayerId;
})

</script>

<template>
    <div class="w-40 bg-gray-800">
        <template v-if="currentTile">
            <div class="h-[30px]">
              <template v-for="(playerId) in playersOnTile">
                  <span :class="[currentPlayerId === playerId]">{{players[playerId].name}}</span>
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
