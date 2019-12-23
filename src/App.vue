<template>
  <div id='app'>
    <ul class="gnb">
      <li class="back" @click="onBack"></li>
      <li class="home" @click="onHome"></li>
    </ul>
    <router-view :onInputFooter="onInputFooter"></router-view>
    <!-- <obg-footer :mask=false @back='onBack' @input="onInputFooter" :options="options" :animation="false">
    </obg-footer> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import popup from 'obigo-js-ui/components/popup'
import footer from 'obigo-js-ui/components/footer'
import tripData from './lib/TripData'
import {Mixins} from 'obigo-js-ui'

export default {
  name: 'eco-challenger',
  components: {
    'obg-popup': popup,
    'obg-footer': footer
  },
  mixins: [Mixins.page],
  computed: {
    ...mapGetters([
      'getDrivingStatus',
      'getEcoScore',
      'getUnit'
    ])
  },
  data () {
    return {
      application: {},
      aicOrigin: 'http://www.obigo.com/renault/common/eco?filter-name=',
      options: [{name: 'history', label: 'History'}, {name: 'setting', label: 'Setting'}, {name: 'reset', label: 'Reset Trip'}],
      timer: null,
      hardkeyCodes: this.$hardkey.getCodes()
    }
  },
  beforeCreate () {
    // get City data from localStorage
    const ecoData = window.localStorage.getItem('eco-data')
    if (ecoData) {
      this.$store.dispatch('initStackedDataFromStorage', JSON.parse(ecoData))
    }
    const aicMessage = ['ECO_REQ_INIT_DATA', 'ECO_RES_INIT_DATA', 'ECO_UPDATE_UNIT', 'ECO_UPDATE_DRIVING_STATUS']
    if (window.applicationFramework) {
      aicMessage.map((id) => {
        window.applicationFramework.applicationManager.getOwnerApplication(window.document).registerMessageListener(id)
      })
    }
  },
  mounted () {
    if (window.applicationFramework) {
      this.application = window.applicationFramework.applicationManager.getOwnerApplication(window.document)

      // App Communication
      this.application.addEventListener('ApplicationMessage', this.onAICEventHandler, false)
      // this.application.postMessage(JSON.stringify({'ecoScore': this.getEcoScore}), this.aicOrigin + 'ECO_RES_INIT_DATA', false)
      // this.application.postMessage(JSON.stringify({'drivingStatus': this.getDrivingStatus}), this.aicOrigin + 'ECO_UPDATE_DRIVING_STATUS', false)
      // this.application.postMessage(JSON.stringify(this.getUnit), this.aicOrigin + 'ECO_UPDATE_UNIT', false)

      // Back behavior
      this.$hardkey.addHardkeyListener(this.hardkeyCodes.code.HARDKEY_BUTTON_BACK, (e) => {
        this.onBack()
      })

      window.navigator.vehicle.start(() => {
        tripData.init(this.$store)
      }, err => {
        console.log(err)
      })
      this.application.setStatusBarTitle('Eco Challenger')
      this.application.addEventListener('ApplicationShown', () => {
        this.setTitle('Eco Challenger')
        this.application.setStatusBarTitle('Eco Challenger')
      }, false)
    }
  },
  beforeDestroy () {
    tripData.stopGathering()
  },
  methods: {
    onAICEventHandler (message, origin) {
      const filterName = (origin.indexOf('filter-name=') > -1) ? origin.slice(origin.indexOf('filter-name=') + 12) : ''
      switch (filterName) {
        case 'ECO_REQ_INIT_DATA':
          this.application.postMessage(JSON.stringify({'ecoScore': this.getEcoScore}), this.aicOrigin + 'ECO_RES_INIT_DATA', false)
          this.application.postMessage(JSON.stringify({'drivingStatus': this.getDrivingStatus}), this.aicOrigin + 'ECO_UPDATE_DRIVING_STATUS', false)
          break
        default:
          break
      }
    },
    onBack (evt) {
      const currentPath = this.$route.path
      if (window.applicationFramework && currentPath === '/') {
        this.application.back()
      } else {
        this.$router.back()
      }
    },
    onHome () {
      if (window.applicationFramework) {
        window.applicationFramework.applicationManager.getOwnerApplication(window.document).home()
      }
    },
    onInputFooter (val) {
      switch (val) {
        case 'history':
          this.$router.push('history')
          break
        case 'setting':
          this.$router.push('setting')
          break
        case 'reset':
          // reset data
          this.showPopup({title: 'Reset Trip', msg: 'Are you sure you want to reset trip?'})
          break
        default:
          break
      }
    },
    showPopup (e) {
      const resetPopup = popup.show({
        title: e.title,
        content: e.msg,
        onClose: () => {
        },
        buttons: [{
          label: 'No',
          onClick: function () {
            resetPopup.close()
          }
        }, {
          label: 'Yes',
          onClick: () => {
            console.log('reset yes')
            this.$store.dispatch('resetData')
            tripData.resetData()
            resetPopup.close()
          }
        }]
      })
    }
  }
}
</script>

<style lang="scss">

@font-face {
  font-family:'NotoSansCJKkr-Regular';
  src: local('Noto Sans CJK KR Regular');
}
@font-face {
  font-family:'NotoSansCJKkr-Medium';
  src: local('Noto Sans CJK KR Medium');
}
#app{
  font-family:'NotoSansCJKkr-Regular';
  position: relative;
  width: 1280px;
  height: 650px;
  display: flex;
  flex-direction: row;
  background: #0b0d1f;
  .gnb {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 126px;
    height: 100%;
    background: url("./img/gnb_bg.png") no-repeat;
    z-index: 10;
    li{
        width: 100%;
        height: 100px;
        background: url('./img/ico_gnb.png') no-repeat;
        &.back{
            margin-top:10px;
            &:active{
                background-position: -126px 0;
            }
        }
        &.home{
            margin-bottom: 17px;
            background-position: 0 -100px;
            &:active{
                background-position: -126px -100px;
            }
        }
        
    }
  }
  .obg-list{
      width: 1154px;
  }
}
.overlay{
	position: fixed;
	top: 0;
	left: 126px;
	width: calc(100% - 126px);
	height: 100%;
	background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  .popup{
    position: absolute;
    top: 117px;
    left: 50%;
    margin-left: -330px;
    width: 660px !important;
    height: 416px;
    color: #ffffff;
    text-align: center;
    background-color: #212347;
    overflow: hidden;
    border-radius: 15px;
    border: none;
    .title{
        height: auto;
    }
    .title-inner{
      padding-top: 36px;
      margin: 0 auto;
      width: 90%;
      font-size: 33px !important;
      line-height: 37px !important;
      overflow: hidden;
    }
    .text{
      margin: 56px auto 0;
      width: 90%;
      height: 90px;
      font-size: 33px !important;
      line-height: 43px;
      overflow: hidden;
      white-space: pre;
    }
    .content-area{
        flex: none;
        margin-top: 65px;
    }
    .btn-area{
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 99px;
	  border-top: 1px solid #444673;
    //   &::before{
    //     position: absolute;
    //     top: -1px;
    //     left: 0;
    //     content: '';
    //     display: block;
    //     width: 100%;
    //     height: 1px;
    //     background-color: #616161;
    //   }
      button{
        width: 100%;
        height: 100%;
        float: left;
        text-align: center;
        color: #fff;
        font-size: 30px;
        line-height: 100px;
        &:active{
          background-color: #3a3d60;
          color: #ffffff;
        }
        & + button {
	        border-left: 1px solid #444673;
        }
      }
    }
  }
}
</style>

