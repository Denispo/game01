<script setup lang="ts">
import {ref} from "vue";
import {rollDiceNumber} from "../utils";
import {useGame} from "../gameStore";

const diceValue = ref<number>(1);
let lastValue:number;
let tmp:number;

setInterval(()=>{
  if (useGame().dice.diceRolling) {
    tmp = diceValue.value;
    diceValue.value = rollDiceNumber(diceValue.value, lastValue); // At se neroluje 2x za sebou stejne cislo
    lastValue = tmp;
  } else {
     diceValue.value = useGame().dice.rolledNumber
  }
},50)

function rollDice() {
  if (!useGame().dice.diceRolling) {
    useGame().rollDice();
  }
}

</script>

<template>
  <div @click="rollDice" class="border border-gray-600 text-2xl w-10 h-10 text-center cursor-pointer select-none">{{diceValue}}</div>
</template>
