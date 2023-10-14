<script setup lang="ts">
import {useGame} from "../gameStore";
import {computed} from "vue";

const props = defineProps<{myIndex:number}>();

const player = computed(()=>{
  return useGame().currentPlayer;
})

const isPlayerOnTile = computed<boolean>(()=>{
  return player.value.player.tileIndex === props.myIndex;
})

// Jak udelat at kdyz player vstoupi na toto pole, at se nastavi, ze nemuze hazet na pohyb, dokud se nevyresi co se stalo v ulicce?

const canPlayerApplyForJob = computed<boolean>(()=>{
  return isPlayerOnTile && player.value.player.inteligence >= 5;
})

const canPlayerRoolForCausality = computed<boolean>(()=>{
  return isPlayerOnTile && player.value.state === 'WAITFORACTION';
})

function roleForCausality(){
  useGame().rollDice();
  switch(useGame().diceRoledNumber){
    case 2:
    case 3:
    case 4:
    case 5:{
      useGame().addMoneyToCurrentPLayer(5000)
      break;
    }
    case 6:{
      useGame().addMoneyToCurrentPLayer(10000)
      break
    }
  }
}


// Kazdy GameTile se stara sam o to, zda jeho akce mohou/nemohou byt provedeny.
// Tzn. Napr. pouze tato komponenta vi, ze pro praci v bance je potreba mit inteligenci 5.
// Tato  komponenta takz musi resit, jestli danou praci jiz nevykonava jiny hrac.
// Proste kazda komponenta GameTile si zjistuje stav hry a podle toho umoznuje/neumoznuje provadet sve akce.
// gameStore jen tupe drzi hodnoty stavu hry, ale sam logiku hry moc/vubec? nezna
</script>

<template>
    <div class="w-40" :class="[isPlayerOnTile ? 'bg-gray-700' : 'bg-gray-800' ]">
      <div class="text-center p-2"><span class="text-2xl">TEMNÁ ULIČKA</span></div>
      <hr class="border-gray-500">
      <button @click="roleForCausality" class="px-2 py-1 rounded" :class="[canPlayerRoolForCausality ? 'bg-green-600 text-green-200 shadow' : 'bg-gray-600' ]">Událost</button>
      <div>1: přepadli tě síla 8</div>
      <div>2-3: přepadli tě síla 8</div>
      <div>4-5: nic</div>
      <div>6: potkal jsi dealera</div>
      <hr class="border-gray-500">
      <div class="p-4"><button class="px-2 py-1 rounded" :class="[canPlayerApplyForJob ? 'bg-green-600 text-green-200 shadow' : 'bg-gray-600' ]">Bankéř INT:5</button></div>
    </div>
</template>
