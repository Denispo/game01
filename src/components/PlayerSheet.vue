<script setup lang="ts">
import { useGame} from "../gameStore";
import {computed} from "vue";

const props = defineProps<{playerIndex:number}>();

const player = computed(()=>{
  return useGame().players[props.playerIndex];
})


</script>

<template>
    <div class="bg-gray-800 w-60">
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
