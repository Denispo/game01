<script setup lang="ts">
import {_storeGame} from "../gameStore";
import {computed} from "vue";
import GameTile from "./GameTile.vue";

const gameTileList = computed(()=>{
    return _storeGame().gameTileList;
})

const players = computed(()=>{
    return _storeGame().players;
})

const currentPlayerIndex = computed(()=>{
    return _storeGame().currentPlayerIndex;
})

function doRollForMove(playerIndex: number) {
   _storeGame().rollDice().then((result)=>{
      _storeGame().moveCurrentPlayer(result);
   })
}
</script>

<template>
    <div class="flex flex-row mt-20 ml-10 gap-8">
       <template v-for="(oneGameTile) in gameTileList" :key="oneGameTile.tileId" >
          <GameTile :gameTileId="oneGameTile.tileId"/>
       </template>
    </div>

    <div class="flex flex-row mt-20 ml-10 gap-4 pb-10">
        <template v-for="(playerData, playerIndex) in players" :key="playerIndex">
            <div class="w-60 p-4" :class="[currentPlayerIndex === playerIndex ? 'bg-gray-600 text-gray-200 ' : 'bg-gray-800 ']">
                <div class="text-center p-2"><span class="text-2xl">{{playerData.name}}</span></div>
                <hr class="border-gray-500">
                <div>Peníze: {{playerData.moneyCarried}}</div>
                <div>Peníze doma: {{playerData.moneyHome}}</div>
                <div>Věk: {{playerData.age}}</div>
                <div>Věk smrti: {{playerData.deathAge}}</div>
                <div>Síla: {{playerData.strength}}</div>
                <div>Inteligence: {{playerData.inteligence}}</div>
               <button @click="doRollForMove(playerIndex)"  class="px-2 py-1 rounded-sm" :class="[playerData.canRollForMove ? 'bg-green-600 text-green-200 shadow-sm cursor-pointer' : 'bg-gray-500 text-gray-200 cursor-default']">Pohyb</button>
            </div>
        </template>

    </div>
</template>
