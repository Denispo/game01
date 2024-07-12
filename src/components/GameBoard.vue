<script setup lang="ts">
import {useGame} from "../gameStore";
import {computed} from "vue";

const gameTileList = computed(()=>{
    return useGame().gameTileList;
})

const players = computed(()=>{
    return useGame().players;
})

const currentPlayerIndex = computed(()=>{
    return useGame().currentPlayerIndex;
})
</script>

<template>
    <div class="flex flex-row mt-20 ml-10 gap-8">
        <div v-for="(currentTile, tileIndex) in gameTileList" :key="tileIndex" class="flex-1 max-w-48 border-dashed border-2 border-gray-600">
            <div class="m-2 bg-gray-800">
                <div class="h-[30px]">
                    <template v-for="(playerData, playerIndex,) in players">
                        <span v-if="playerData.tileIndex === tileIndex" :class="[currentPlayerIndex === playerIndex ? 'font-bold' : '']">{{playerData.name}}</span>
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

            </div>
        </div>
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
            </div>
        </template>

    </div>
</template>
