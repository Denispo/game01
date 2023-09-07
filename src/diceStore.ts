import {defineStore} from "pinia";
import {computed, readonly, ref} from "vue";

type Store = {
    diceRolling:boolean,
    rolledNumber:number,
    rolledAt:number, // timestamp, kdy se nastavila hodnota. Aby na to sel udelat watch
}

export const useDiceStore = defineStore('diceStore',()=>{

    const store = ref<Store>({
        diceRolling:false,
        rolledNumber:1,
        rolledAt:0,
    })


    const diceRoledNumber = computed(()=>{
        return store.value.rolledNumber;
    })

    function rollDice(){
        if (store.value.diceRolling) {
            return;
        }
        store.value.diceRolling = true;
        setTimeout(()=>{
            store.value.diceRolling = false;
            store.value.rolledNumber = Math.floor(6 * Math.random())+1;
            store.value.rolledAt = Date.now();
        },Math.floor(700 * Math.random())+500)
    }


    return {
        dice: readonly(store),
        rollDice:rollDice,
    }


});
