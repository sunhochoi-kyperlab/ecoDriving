<template>
  <div class="app-area">
      <div class="app-slider" :style='{transform: "translateX(" + xPos + "px) translateZ(0px)"}' @mousedown='dragStart' @touchstart='dragStart' ref='appSlide' >
        <Panel />
        <History />
      </div>

      <div class="paging">
        <span v-for='(item, idx) in getMaxPage()' :class="item - 1 === currAppSlideIndex ? 'on' : '' " :key="idx"></span>
      </div>
  </div>
</template>

<script>
import Panel from './EcoPanel/EcoPanel'
import History from './History/History'

const CONTAINER_WIDTH = 1154

export default {
  name: 'AppSlider',
  components: {
    'Panel': Panel,
    'History': History
  },
  data () {
    return {
      xPos: 0,
      isDrag: false,
      currAppSlideIndex: 0
    }
  },
  methods: {
    dragStart (e) {
      this.isDrag = false
      const maxPage = this.getMaxPage()
      if (maxPage <= 1) {
        return
      }
      e = e.touches ? e.touches[0] : e
      if (e.type === 'mousedown') {
        this.$refs.appSlide.addEventListener('mousemove', this.dragMove)
        this.$refs.appSlide.addEventListener('mouseup', this.dragEnd)
        this.$refs.appSlide.addEventListener('mouseleave', this.dragEnd)
      } else {
        this.$refs.appSlide.addEventListener('touchmove', this.dragMove)
        this.$refs.appSlide.addEventListener('touchend', this.dragEnd)
        this.$refs.appSlide.addEventListener('touchcancel', this.dragEnd)
      }
      this.beforeX = e.clientX
      this.startX = this.xPos
    },
    dragMove (e) {
      e = e.touches ? e.touches[0] : e
      const currentX = e.clientX

      this.xPos = this.xPos - (this.beforeX - currentX)

      this.beforeX = currentX
    },
    dragEnd (e) {
      e = e.changedTouches ? e.changedTouches[0] : e
      if (e.type === 'mouseup' || e.type === 'mouseleave') {
        this.$refs.appSlide.removeEventListener('mousemove', this.dragMove)
        this.$refs.appSlide.removeEventListener('mouseup', this.dragEnd)
        this.$refs.appSlide.removeEventListener('mouseleave', this.dragEnd)
      } else {
        this.$refs.appSlide.removeEventListener('touchmove', this.dragMove)
        this.$refs.appSlide.removeEventListener('touchend', this.dragEnd)
        this.$refs.appSlide.removeEventListener('touchcancel', this.dragEnd)
      }
      if (this.startX === this.xPos) {
        return
      }
      if (this.currAppSlideIndex === 0 && this.xPos < -350 || this.currAppSlideIndex === 1 && this.xPos < this.startX) { // 다른 페이지로 이동
        this.xPos = -CONTAINER_WIDTH
        this.currAppSlideIndex = 1
      } else { // 원상복구
        this.xPos = 0
        this.currAppSlideIndex = 0
      }
    },
    getMaxPage () {
      return 2
    }
  },
  mounted () {
    this.beforeX = -1
    this.startX = -1
    this.dragMove = this.dragMove.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.destXPos = 0
    if (this.currAppSlideIndex === 0) {
      this.xPos = 0
    } else {
      this.xPos = -CONTAINER_WIDTH
    }
  }
}
</script>
<style lang='scss' scoped >
.app-area{
  width:1154px;
  height:100%;
  .app-slider{
    position:relative;
    width:2308px;
    height:100%;
    display:flex;
    flex-direction:row;
  }
    .paging{
        display:flex;
        flex-direction:row;
        width: 100%;
        height: 20px;
        position: absolute;
        left: 0;
        bottom: 43px;
        justify-content: center;
        align-items: center;
        span{
            display: block;
            width: 16px;
            height: 16px;
            background-color: #fff;
            border-radius: 100%;
            margin:0 9px;
            &.on{
            width: 20px;
            height: 20px;
            background-color: #00b1fb;
            }
        }
    }
}
</style>
