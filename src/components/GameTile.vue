<script setup lang="ts">
import {GameTileId, useGame} from "../gameStore";
import {computed} from "vue";

const props = defineProps<{id:GameTileId}>();

const isPlayerOnTile = computed(()=>{
    return false;
})

const currentTile = computed(()=>{
  return useGame().gameTiles[props.id];
})


</script>

<template>
    <div class="w-40" :class="[isPlayerOnTile ? 'bg-gray-700' : 'bg-gray-800' ]">
        <template v-if="currentTile">
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
