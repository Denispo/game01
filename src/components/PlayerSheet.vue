<script setup lang="ts">
import {PlayerId, useGame} from "../gameStore";
import {computed} from "vue";

const props = defineProps<{playerId:PlayerId}>();

const player = computed(()=>{
  return useGame().players[props.playerId];
})

const currentPlayerId = computed(()=>{
    return useGame().currentPlayerId
})

</script>

<template>
    <div class="w-60 p-4" :class="[currentPlayerId === props.playerId ? 'bg-gray-600 text-gray-200 ' : 'bg-gray-800 ']">
        <div class="text-center p-2"><span class="text-2xl">{{player.name}}</span></div>
        <hr class="border-gray-500">
        <div>Peníze: {{player.moneyCarried}}</div>
        <div>Peníze doma: {{player.moneyHome}}</div>
        <div>Věk: {{player.age}}</div>
        <div>Věk smrti: {{player.deathAge}}</div>
        <div>Síla: {{player.strength}}</div>
        <div>Inteligence: {{player.inteligence}}</div>
    </div>
</template>
