<script setup lang="ts">
import {_storeGame, GameTileId} from "../gameStore";
import {computed} from "vue";
import {useGameTile} from "../useGameTile";

const props = defineProps<{gameTileId:GameTileId}>();

const {gameTileData} = useGameTile(()=>props.gameTileId);

const players = computed(()=>{
   return _storeGame().players;
})

const currentPlayerIndex = computed(()=>{
   return _storeGame().currentPlayerIndex;
})

</script>

<template>
   <div class="flex flex-row mt-20 ml-10 gap-8">
      <div class="flex-1 max-w-48 border-dashed border-2 border-gray-600">
         <div class="m-2 bg-gray-800">
            <div class="h-[30px]">
               <template v-for="(playerData, playerIndex) in players">
                  <span v-if="playerData.tileIndex === tileIndex" :class="[currentPlayerIndex === playerIndex ? 'font-bold' : '']">{{playerData.name}}</span>
               </template>
            </div>
            <div class="text-center p-2"><span class="text-2xl">{{gameTileData.name}}</span></div>
            <hr class="border-gray-500">
            <template v-if="gameTileData.actionName">
               <button  @click=""  class="px-2 py-1 rounded-sm bg-green-600 text-green-200 shadow-sm">{{gameTileData.actionName}}</button>
            </template>
            <template v-for="action in gameTileData.tileActions">
               <div>
                  {{action.numbersToRoll}}: {{action.name}}
               </div>
            </template>
            <hr class="border-gray-500">
            <template  v-if="gameTileData.tileJobName" >
               <div class="p-4"><button class="px-2 py-1 rounded-sm bg-green-600 text-green-200 shadow-sm" >{{gameTileData.tileJobName}}</button></div>
            </template>
         </div>
      </div>
   </div>

</template>
