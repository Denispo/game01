<script setup lang="ts">
import {useGameStore} from "../gameStore";
import {computed} from "vue";
import {defineStore} from "pinia";

const props = defineProps<{myIndex:number}>();

const player = computed(()=>{
  return useGameStore().currentPlayer;
})

const isPlayerOnTile = computed<boolean>(()=>{
  return player.value.player.tileIndex === props.myIndex;
})

const canPlayerApplyForJob = computed<boolean>(()=>{
  return isPlayerOnTile && player.value.player.inteligence >= 5;
})

// Kazdy GameTile se stara sam o to, zda jeho akce mohou/nemohou byt provedeny.
// Tzn. Napr. pouze tato komponenta vi, ze pro praci v bance je potreba mit inteligenci 5.
// Tato  komponenta takz musi resit, jestli danou praci jiz nevykonava jiny hrac.
// Proste kazda komponenta GameTile si zjistuje stav hry a podle toho umoznuje/neumoznuje provadet sve akce.
// gameStore jen tupe drzi hodnoty stavu hry, ale sam logiku hry moc/vubec? nezna
</script>

<template>
    <div class="w-40" :class="[isPlayerOnTile ? 'bg-gray-700' : 'bg-gray-800' ]">
      <div class="text-center p-2"><span class="text-2xl">BANKA</span></div>
      <hr class="border-gray-500">
      <div class="p-4"><button class="px-2 py-1 rounded" :class="[canPlayerApplyForJob ? 'bg-green-600 text-green-200 shadow' : 'bg-gray-600' ]">Bankéř INT:5</button></div>
    </div>
</template>
