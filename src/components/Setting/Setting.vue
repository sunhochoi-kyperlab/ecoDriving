<template>
  <obg-list >
    <obg-list-item @click="onInput">
      <div class="content"><p>Unit</p></div>
      <div class="choice">{{this.distance ? "mile" : "km"}}-{{this.fuel ? "gallon" : "liter"}}</div>
      <!-- <div class="tail">
        <obg-toggle @input="onInput" :items="distanceData" v-model="distance"/>
      </div> -->
    </obg-list-item>
    <obg-list-item @click="onReset">
      <div class="content"><p>Reset Trip</p></div>
    </obg-list-item>
    <!-- <obg-list-item>
      <div class="content"><p>Unit of volume</p></div>
      <div class="tail">
        <obg-toggle @input="onInput" :items="fuelData" v-model="fuel"/>
      </div>
    </obg-list-item> -->
  </obg-list>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {list, listItem} from 'obigo-js-ui/components/list'
  import toggle from 'obigo-js-ui/components/toggle'
  const FUEL_UNIT = {'LITER': 'liter', 'GALLON': 'gallon'}
  const DISTANCE_UNIT = {'METER': 'meter', 'MILE': 'mile'}
  export default{
    name: 'Setting',
    components: {
      'obg-list': list,
      'obg-list-item': listItem,
      'obg-toggle': toggle
    },
    data () {
      return {
        fuel: this.$store.state.unit.fuel === FUEL_UNIT.GALLON ? 1 : 0,
        distance: this.$store.state.unit.distance === DISTANCE_UNIT.MILE ? 1 : 0,
        fuelData: ['liter', 'gallon'],
        distanceData: ['km', 'mile']
      }
    },
    computed: {
      ...mapGetters([
        'getUnit'
      ])
    },
    methods: {
      onInput () {
        this.fuel = this.fuel === 0 ? 1 : 0
        this.distance = this.distance === 0 ? 1 : 0
        this.$store.dispatch('updateUnit', {fuel: this.fuel ? FUEL_UNIT.GALLON : FUEL_UNIT.LITER, distance: this.distance ? DISTANCE_UNIT.MILE : DISTANCE_UNIT.METER})
      },
      onReset (e) {
        this.$parent.onInputFooter('reset')
      }
    }
  }
</script>
<style lang='scss' scoped>
.obg-list .obg-list-item{
    min-height: 104px;
    height: 104px;
    background-color: transparent;
    border-bottom: 1px solid #31345f;
    align-items: center;
    &:before{
        display: none;
    }
    .content{
        margin-left: 49px;
    }
    .choice{
        font-size: 33px;
        color: #00b1fb;
        margin-right: 44px;
    }
}
</style>
