<script setup lang="ts">
import {ref} from "vue";
import {useDiceStore} from "../diceStore";
import {rollDiceNumber} from "../utils";

const diceValue = ref<number>(1);
let lastValue:number;
let tmp:number;

setInterval(()=>{
  if (useDiceStore().dice.diceRolling) {
    tmp = diceValue.value;
    diceValue.value = rollDiceNumber(diceValue.value, lastValue); // At se neroluje 2x za sebou stejne cislo
    lastValue = tmp;
  }
},50)


</script>

<template>
  <div @click="useDiceStore().rollDice()" class="border border-gray-600 text-2xl w-10 h-10 text-center cursor-pointer select-none">{{diceValue}}</div>
</template>
