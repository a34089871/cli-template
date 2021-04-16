<template>
  <div id="mainProject" :class="{'menu-collapse': isCollapse}">
    <sg-container
      direction="vertical"
      class="home"
    >
      <!--        系统头部 start-->
      <transition mode="out-in">
        <sg-header
          v-show="!collapse"
          class="home-header"
                :class="{ 'only-top-menu-wrap': menuStyle !== 'topAndLeft'}"
                :height="menuStyle !== 'topAndLeft' ? 50 : 78"
                :style="headerStyle"
        >
          <sg-row>
              <template v-if="menuStyle !== 'topAndLeft'">
                  <img :class="{titleIcon1:activeIcon}" :src="systemTitleIcon" alt="">
              </template>
              <template v-else>
                  <img :class="{titleIcon:activeIcon}" :src="systemTitleIcon" alt="">
              </template>
            <div
              class="logo"
              style="flex: 1;"
            >
              <h1 id="system-title" style="margin-right: 10px;">
                {{ mpdata.sysTitle }}
              </h1>

              <h2 style="margin: 0;">
                {{ subSysTitle }}
              </h2>
            </div>
            <sg-scroll v-if="menuStyle !== 'onlyLeft'">
              <i-menu
                v-if="direction==='vertical'"
                :data="JSON.parse(mpdata.mTree).children"
              />
              <template v-if="menuStyle === 'topAndLeft'">
                <div class="flex">
                  <div
                    v-for="(item,index) in firstMdl"
                    :key="index"
                  >
                    <div
                      v-if="item.children?true:item.pageUrl!==''"
                      :class="item.moduleId===activeName?'item active':'item'"
                      @click.stop="handleTopMenuClick(item)"
                    >
                      <img
                        :src="item.imageUrl"
                        alt=""
                      >
                      <p>{{ item.name }}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="menuStyle === 'onlyTop'">
                <top-menu horizontal :data="JSON.parse(this.mpdata.mTree).children"/>
              </template>
            </sg-scroll>
            <div class="unit-wrap">
              <div style="padding: 0 22px;">
                <span
                  id="msg-switch"
                  class="msg-icon"
                  @click="clickMp"
                >
                  <sg-badge
                    :value="totalMsg"
                    style="vertical-align: top; margin-top: -5px; margin-left: 12px;"
                  />
<!--                  <message-service-->
<!--                    :top="menuStyle === 'onlyTop' ? 50 : 78"-->
<!--                    :socket="socket"-->
<!--                    :show-message-push.sync="messagePushVisible"-->
<!--                    :show-online-message="showOnlineMsg"-->
<!--                    @on-total-change="handleTotalChange"-->
<!--                  />-->
                </span>
              </div>
              <div class="unit">
                <sg-dropdown
                  placement="bottom-end"
                  offset="15px,0"
                >
                  <div class="letter">
                    {{ mpdata.loginName[0] }}
                  </div>
                  <sg-icon type="icon-sort-desc" />
                  <div
                    slot="menu"
                    class="user-info"
                    :style="setDropdownStyle"
                  >
                    <div class="info">
                      <div class="letter" @click="forwardPersonalSetting">
                        {{ mpdata.loginName[0] }}
                      </div>
                      <div class="person">
                        <p>{{ mpdata.loginName }}</p>
                        <p>{{ mpdata.realName }}</p>
                      </div>
                      <span
                        class="logout"
                        @click="logoutUrl"
                      >
                        <sg-icon type="icon-tuichu2" />
                      </span>
                    </div>
                    <sg-dropdown-item
                      v-for="item in sysList"
                      :key="item.sysCode"
                      @click.native="changeSys(item.sysCode,item.visitUrl)"
                    >
                      <i class="icon shuju" />
                      {{ item.sysName }}
                    </sg-dropdown-item>
                  </div>
                </sg-dropdown>
              </div>
            </div>
          </sg-row>
        </sg-header>
      </transition>
      <!--        系统头部  end-->

      <!-- 这里是消息服务组件，更新了显示在屏幕中间 -->
      <msg-service
        :top="menuStyle === 'onlyTop' ? 50 : 78"
        :socket="socket"
        :show-message-push.sync="messagePushVisible"
        @on-total-change="handleTotalChange"
      ></msg-service>

      <!--        内容区  start-->
      <sg-container
        :direction="direction"
        style="height: calc(100% - 78px);"
      >
        <template v-if="menuStyle === 'onlyLeft'">
          <sg-aside :style="asideWidth" class="only-left-menu" :class="{collapsed: isCollapse}">
            <sg-scrollbar>
              <i-menu class="left-menu-bar"
                      :data="firstMdl"
                      :horizontal="false"
                      @collapse="collapseHandler"
                      :collapse="isCollapse"
                      :showTooltip="true"
              />
            </sg-scrollbar>
            <div class="collapse-btn" @click="toggleMenuBar">
              <span v-if="isCollapse">→</span>
              <span v-else>← 收起侧边栏</span>
            </div>
          </sg-aside>
          <div class="nav-content-wrap">
        <div
          v-for="(nav,index) in firstMdl"
          :key="index"
                    :class="nav.moduleId===activeName?'nav-content show':'nav-content hidden'">
              <sg-main
                      :ref="nav.moduleId"
                      class="tab-wrap">
                <div
                        v-if="nav.children"
                        :id="nav.moduleId" />
                <iframe
                        v-else
                        :id="nav.moduleId"
                        :src="nav.pageUrl"
                        :style="setStyle(nav)"
                        frameborder="0" />
              </sg-main>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(nav,index) in firstMdl"
            :key="index"
            :class="nav.moduleId===activeName?'nav-content show':'nav-content hidden'">
            <template v-if="nav.name==='首页'">
              <iframe :src="nav.pageUrl" frameborder="0" />
          </template>
          <template v-else>
            <!--            侧边栏 放置纵向菜单-->
            <sg-aside
              v-if="menuStyle === 'topAndLeft' && nav.children"
              :style="asideWidth"
            >
              <sg-scrollbar>
                <i-menu :ref="'leftMenu' + nav.moduleId"
                  :moduleId="nav.moduleId===activeName?nav.children:''"
                  :data="nav.children"
                  :horizontal="false"
                  :active="nav.active"
                  @collapse="collapseHandler"
                />
              </sg-scrollbar>
            </sg-aside>
            <sg-main
              :ref="nav.moduleId"
              class="tab-wrap"
            >
              <div
                v-if="nav.children"
                :id="nav.moduleId"
              />
              <iframe
                v-else
                :id="nav.moduleId"
                :src="nav.pageUrl"
                :style="setStyle(nav)"
                frameborder="0"
              />
            </sg-main>
          </template>
        </div>
        </template>
      </sg-container>
      <!--        内容去 end-->
    </sg-container>
  </div>
</template>

<script>
import IMenu from '_c/menu/index.vue'
import TopMenu from '_c/menu/topmenu.vue'
import login from '@/api/login'
import home from '@/api/home'
import {mapGetters,mapMutations} from 'vuex'
//引入tab操作相关操作类
import {Tabs} from "../../assets/js/tabs";
import {getCode} from "../../util";
import cloneDeep from 'lodash.clonedeep';
// import MessageService from 'messageservice'

export default {
  name: 'MainProject',
  components: { IMenu, TopMenu },
  data() {
    return {
      menuStyle: 'topAndLeft', // 菜单风格，顶部onlyTop，侧边onlyLeft，顶部+侧边topAndLeft
      menuLayoutOptions: ['topAndLeft', 'onlyLeft', 'onlyTop'],
      socket: `${window.location.host}/message/websocket`,
      totalMsg: 0,
      messagePushVisible: false,
      showOnlineMsg: false,
      //菜单默认纵向
      direction: 'horizontal',
      //子系统列表
      sysList: [],
      activeName: '',
      collapse:false,
      //tab实例队列，避免重复初始化tab实例
      tabList:[],
      globalTab: null,
      //一级功能
      mdl:[],
      //aside宽度样式
      asideWidth:{},
      //系统副标题
      subSysTitle:"",
      //系统标题图标
      systemTitleIcon:"",
      activeIcon:false,
      isCollapse: false // 菜单是否折叠
    }
  },
  computed: {
    /**
       * @Description:
       * @author huangjianhui
       * @date 2019/10/25
       * @param mpdata 系统信息
       * @param tabs  tab列表
       * @param active 菜单和tab选中高亮
       */
    ...mapGetters({
      mpdata: 'getMpData',
      environment:'getEnvironment'
    }),
    firstMdl:{
      set:function(val){
        this.mdl.push(val)
      },
      get:function(){
        let _mTree = JSON.parse(this.mpdata.mTree);
        if(typeof _mTree.children === 'undefined' || !_mTree.children){
          return [...this.mdl];
        }else{
          return [...this.mdl,...JSON.parse(this.mpdata.mTree).children]
        }
      }
    },
    //自定义header颜色
    headerStyle(){
      return {
        backgroundColor:this.mpdata.headColor
      }
    },
    setDropdownStyle(){
      const height=document.body.clientHeight;
      let _h = height-179+'px';
      return {
        'height':_h,
        'overflow-y':'auto',
        'overflow-x':'hidden'
      };
    }
  },
  mounted() {
    console.log('------------mounted-------------');
    this.initEnvironmentConfigure();
    //获取用户可选列表
    this.listAllSubSystems();

    //监听addTab
    // eslint-disable-next-line vue/no-deprecated-events-api
    this.$on('addTab', this.onMenuItemClick)
    this.getModuleByAliasName()

  },
  methods: {
    ...mapMutations({
      saveEnvironmentConfigure: 'saveEnvironmentConfigure'
    }),
    toggleMenuBar () {
      this.isCollapse = !this.isCollapse
    },
    setGlobalTab () {
      let module = this.firstMdl[0]
      if (module.name !== '首页' && module.children && module.children.length) {
        this.globalTab = this.tabList[0]
      } else {
        let target = this.firstMdl.find(item => item.children && item.children.length)
        let tab = new Tabs(target.moduleId)
        tab.init(this.$refs[target.moduleId])
        this.tabList.push(tab)
        this.globalTab = tab
      }
    },
    /**
     * @description 处理顶部一级菜单的点击事件
     */
    handleTopMenuClick (menuItem) {
      this.switchMdl(menuItem)
    },
    /**
       * 初始化
       */
    async initEnvironmentConfigure(){
      //登录成功后获取环境相关配置
      await home.environmentConfigure()
        .then(config=>{
          this.saveEnvironmentConfigure(config)
          let _protocol = window.parent.location.protocol;
          let _host = window.parent.location.host.indexOf('localhost')!=-1?'192.168.10.126':window.parent.location.host;
          let pre_url = _protocol+"//"+_host+"/";
          let _loginTitle= typeof config["登录提示信息"] === 'undefined'?"登录成功":config["登录提示信息"];
          let _sysTitle = typeof config["系统主标题"] === 'undefined'?"":config["系统主标题"];
          this.subSysTitle = typeof config["系统副标题"] === 'undefined'?"":config["系统副标题"];
          this.systemTitleIcon = config["系统标题图标"] === "" || config["系统标题图标"] == null?"":pre_url+config["系统标题图标"]+"?"+parseInt(Math.random()*(999999-100000)+100000);
          this.menuStyle = config["菜单布局"] ? this.menuLayoutOptions[parseInt(config["菜单布局"])] : this.menuLayoutOptions[0]
          if(this.systemTitleIcon == ''){
            this.activeIcon = false;
          }else{
            this.activeIcon = true;
          }
          //将首页添加到firstMdl里，如果没有则添加默认首页
          if (config['首页地址']) {
            this.firstMdl={
              name: '首页',
              pageUrl: config['首页地址'],
              imageUrl: '/bootstrap/beijing/首页.png',
              moduleId:'123456789984567893456789'
            }
          }
          //并且选中第一个
          this.activeName = this.firstMdl[0].moduleId
          this.registeWindow()
          this.switchMdl(null,this.activeName)
          if (this.menuStyle && this.menuStyle !== 'topAndLeft') {
            this.$nextTick(() => {
              this.setGlobalTab()
            })
          }

          if(_loginTitle !== '' && _loginTitle != null && _loginTitle != 'null'){
            this.$notice.open({
              type: 'success',
              title: _loginTitle,
              duration:1.5,
              render: (h) => {
                return h('span',{
                  style:{
                    display: 'block',
                    marginLeft: '26px',
                    color: this.headerStyle,
                    fontSize: '13px',
                    lineHeight: '20px'
                  }
                },`欢迎使用${_sysTitle}`)
              }
            });
          }
        })
    },
    /**
     * 支持外部系统嵌入偏移
     */
    setStyle(item){
      const height=document.body.clientHeight
      const top=getCode(item.pageUrl).topmove?getCode(item.pageUrl).topmove:'',
        left=getCode(item.pageUrl).leftmove?getCode(item.pageUrl).leftmove:''
      let h=height-Number(top.substring(0,left.length-2))+'px'
      if(top===''){
        h='100%'
      }
      return {
        'margin-top':top,
        'margin-left':left,
        'width':'100%',
        'height':h
      }
    },
    /**
     * @description 打开叶子节点菜单
     * @param menuId: 子菜单ID，字符串类型
     **/
    openLeafMenu (menuId) {
      if (!menuId) return
      let tree = []
      findFamilyTree(cloneDeep(this.firstMdl), tree)
      let topMenu = tree.pop()
      let leafMenu = tree.shift()
      this.switchMdl(null, topMenu.moduleId, leafMenu)

      function findFamilyTree(menu, result) {
        for (let i = 0; i < menu.length; i++) {
          let menuItem = menu[i]
          if (menuItem.moduleId === menuId) {
            result.push(menuItem)
            return true
          } else if (Array.isArray(menuItem.children) && menuItem.children.length) {
            let flag = findFamilyTree(menuItem.children, result)
            if (flag) {
              result.push(menuItem)
              return true
            }
          }
        }
      }
    },
    switchMdl(item,moduleId,openTab) {
      console.log('--------item----------',item,openTab);
      //优先使用外部传入的moduleid
      const id=moduleId?moduleId:item.moduleId
      this.activeName = id
      this.$nextTick(()=>{
        const tab=this.tabList.filter(f=>f.id===id)
        if(tab.length===0){
          let ibaseTab=null
          ibaseTab=new Tabs(id)
          //初始化tab，需要传入dom元素获取宽高
          ibaseTab.init(this.$refs[id])
          this.tabList.push(ibaseTab)
          //如果item为空，利用moduleid去获取item，打开第一个tab
          if(!item){
            this.firstMdl.forEach(sub=>{
              if(sub.moduleId===id){
                item=sub
              }
            })
          }
          //优先使用外部传入的tab对象
          if(openTab){
            this.addTab(openTab)
          }else{
            //添加第一个tab
            if(item.pageUrl!==''){
              this.addTab(item,ibaseTab)
            }else {
              this.addTab(getSubMenu(item.children),ibaseTab)
            }
          }
        }
        if(openTab){
          this.addTab(openTab)
        }
      })
      //递归找子菜单
      function getSubMenu(menu){
        for (let i = 0; i < menu.length; i++) {
          if (Array.isArray(menu[i].children) && menu[i].children.length) {
            return getSubMenu(menu[i].children)
          } else if (menu[i].pageUrl.trim()) {
            return menu[i]
          }
        }
      }
    },
    /**
       * @Description:获取用户可选系统列表
       * @author xiejiahui
       * @date 2019/12/06
       */
    listAllSubSystems() {
      login.listAllSubSystems()
        .then(res => {
          this.sysList = res;
        })
    },
    /**
       * @Description:切换系统。需要传子系统代码
       * @author huangjianhui
       * @date 2019/10/26
       */
    changeSys(scode,visitUrl) {
      if(visitUrl !== ""){
        window.location.href = visitUrl;
      }else{
        window.location.href = window.location.pathname + `?scode=${scode}`
      }
    },
    //跳转到个人设置页面
    forwardPersonalSetting(){
      // window.location.href = '/businessmodule-web/personalSetting.html';
      this.addOrUpdateTab({
        pageUrl: '/businessmodule-web/personalSetting.html',
        name: '个人设置',
        moduleId:'d7fe0b88-e85a-4cb0-9799-7b5b0f04bcdc'
      });
    },
    /**
       * @Description:退出登陆，注销系统并返回登录页
       * @author huangjianhui
       * @date 2019/10/26
       */
    logoutUrl() {
      this.$modal.confirm({
        title: '提示',
        content: '确定退出系统?',
        closable: true,
        similar: true,
        onOk: () => {
          // 注销处理逻辑：
          // 1）调用casLogoutUrl设置的注销地址（空忽略）
          // 2）调用logoutUrl设置的注销地址（需要处理开头的@符，替换为当前mainweb路径），
          // 如：@/public/slogout ----> /mainweb/public/slogout
          // 3）循环调用appUrl中设置的注销地址
          const casLogoutUrl=this.mpdata.casLogoutUrl
          let logoutUrl=this.mpdata.logoutUrl
          const appUrl = JSON.parse(this.mpdata.appUrl)
          const axiosArr=[]
          //截取@替换成mainweb
          // logoutUrl='/mainweb'+logoutUrl.substring(logoutUrl.indexOf('@')+1,logoutUrl.length)
          appUrl.push(logoutUrl)
          appUrl.forEach(item=>{
            axiosArr.push(axios.get(item))
          })
          axios.get(this.urlHandler(casLogoutUrl)).then(()=>{
            //不管成功与否，都推出登陆
            axios.all(axiosArr)
              .then(()=>{
                window.location.replace('login.html')
              })
              .catch(()=>{
                window.location.replace('login.html')
              })
          })
            .catch(()=>{
              alert('cas注销登陆失败！')
            })
        }
      })

    },
    /**
     * 添加tab方法
     * @param item tab数据
     * @param ibaseTab 如果有传入ibasetab实例，优先使用实例
     */
    addTab(item,ibaseTab){
      console.log('+++++item1+++++',item)
      //在这里针对模块的启动方式进行相应的处理
      if(!item.position || item.position == 100 || item.position == 1 || item.position == 2){
        // 优先使用ibaseTab实例
        let tab=ibaseTab
        if(!tab){
        //找出当前高亮tab实例
          tab=this.getSelectTab(this.activeName)[0]
        }
        tab.add(item)
      }else if(item.position == 101){ //新窗口打开
        window.open(item.pageUrl,item.name);
      }else if(item.position == 6){ //全屏打开
        window.open(item.pageUrl,item.name,'width='+(window.screen.availWidth-10)+',height='+(window.screen.availHeight-30)+ ',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes');
      }else if(item.position == 5){ //弹出对话框
        this.$modal.alert({
          title: item.name,
          footerHide:true,
          closable: true,
          maximize:true,
          similar: true,
          className:'iframPageClass',
          render: (h) =>{
            return h('iframe',{
              attrs:{
                src: item.pageUrl
              }
            })
          }
        })
      }
    },
    /**
       * @description 菜单项点击事件处理
       * @param menuItem 菜单项
       * @param isFirstLevel 是否是顶层节点
     **/
    onMenuItemClick (menuItem, isFirstLevel) {
      if (this.menuStyle !== 'topAndLeft') {
        if (isFirstLevel && !menuItem.children) {
          window.switchMdl(menuItem)
          return
        }
        if (this.activeName !== this.globalTab.id) {
          window.switchMdl(null, this.globalTab.id, menuItem)
        } else {
          this.addTab(menuItem, this.globalTab)
        }
      } else {
        this.addTab(menuItem)
      }
    },
    /**
       * 如果不存在即添加，或者更新
       */
    addOrUpdateTab(item,ibaseTab){
      // 优先使用ibaseTab实例
      let tab=ibaseTab
      if(!tab){
        //找出当前高亮tab实例
        tab=this.getSelectTab(this.activeName)[0]
      }
      tab.addOrUpdate(item)
    },
    /**
     * 根据moduleId关闭当前高亮tab
     */
    closeTab(moduleId){
      this.getSelectTab(this.activeName)[0].close(moduleId)
    },
    /**
     * 根据moduleId和title修改当前高亮tab
     */
    setTabName(moduleId,title){
      const index=this.getSelectTab(this.activeName)[0].getTabById(moduleId)['index']
      //这样写可能不太严谨，但基本能满足需求了
      const el=$("#" + this.activeName).find('.tabs .tabs-title')[index]
      $(el).text(title)
    },

    /**
     * 通过moduleId获取tab实例，可根据tab实例操作当前选中tab
     * @param moduleId
     * @returns {*[]}
     */
    getSelectTab(moduleId){
      return this.tabList.filter(f=>f.id===moduleId)
    },
    closeCurrTab(){
      this.getSelectTab(this.activeName)[0].closeCurr()
    },
    getActiveModule(){
      if(this.getSelectTab(this.activeName)[0]){
        return this.getSelectTab(this.activeName)[0].getCur()[0].firstElementChild.id
      }
    },
    /**
     * 通过别名获取模块信息
     */
    getModuleByAliasName(aliasName){
      const module = []
      // 树拍平
      const fn = (source)=>{
        source.forEach(el=>{
          module.push(el)
          el.children && el.children.length>0 ? fn(el.children) : ""
        })
      }
      fn(this.firstMdl)
      return module.filter(item=>item.aliasName===aliasName)
    },
    // 设置系统主标题
    setSysTitle (title) {
      let el = document.getElementById('system-title')
      el.textContent = title
    },
    /**
     * 全局注册，供外部调用
     */
    registeWindow(){
      window.openLeafMenu = this.openLeafMenu
      window.setSysTitle = this.setSysTitle
      window.addTab = this.addTab
      window.addOrUpdateTab = this.addOrUpdateTab
      //为了兼容表达式写法
      window.addTap = this.addTab
      window.closeTab = this.closeTab
      window.setTabName = this.setTabName
      //伸缩布局
      window.setCollapse=this.setCollapse
      //关闭当前高亮tab
      window.closeCurrTab=this.closeCurrTab
      //返回activeModule
      window.currModule=this.getActiveModule
      //跳转到指定模块
      window.switchMdl=this.switchMdl
      //通过别名获取模块信息
      window.getModuleByAliasName=this.getModuleByAliasName
    },
    /**
     * 处理cas相关地址
     * @param url
     * @returns {string}
     */
    urlHandler(url){
      return url.substring(url.indexOf('/cas'),url.length)
    },
    clickMp(){
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.timer = null
        this.messagePushVisible = !this.messagePushVisible
      },300)
    },
    dblclickMp() {
      this.timer && clearTimeout(this.timer)
      this.showOnlineMsg = true
    },
    handleTotalChange (total) {
      this.totalMsg = total
    },
    /**
     * 菜单收缩触发宽度变化
     * @param boo emit后回调参数
     * @type boolean
     */
    collapseHandler(boo) {
      if(boo){
        this.asideWidth={
          width:'100px'
        }
      }else {
        this.asideWidth={
          width:'180px'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./index.scss";

  $topMenuHeight: 50px;

  .home {
    .sg-aside.only-left-menu {
      position: relative;
      flex: none;

      ~ .nav-content-wrap {
        flex: 1 auto;
        max-width: calc(100% - 180px);
      }

      &.collapsed {
        width: 50px;

        ~ .nav-content-wrap {
          max-width: calc(100% - 50px);

          .nav-content {
            iframe,
            /deep/ div {
              width: 100% !important;
            }
          }
        }
      }
    }

    .collapse-btn {
      height: 40px;
      line-height: 40px;
      color: #455563;
      background: #fff;
      z-index: 999;
      cursor: pointer;
      position: absolute;
      border-top: 1px solid #afafaf;
      bottom: 8px;
      left: 10px;
      right: 10px;
      text-align: center;
    }
  }

  .nav-content-wrap {
    flex: 1 auto;
  }

  .only-top-menu-wrap {
    &.home-header .sg-row {
      height: $topMenuHeight;
    }

    .logo,
    .unit-wrap {
      height: $topMenuHeight;
      line-height: $topMenuHeight;
    }

    .logo h1,
    .logo h2 {
      line-height: $topMenuHeight;
    }

    /deep/ .sg-menu .sg-menu-item,
    /deep/ .sg-menu .sg-menu-submenu-title {
      height: $topMenuHeight;
      line-height: $topMenuHeight;
    }
  }

  @media (max-width: 1800px) and (min-width: 0) {
    .sg-header.only-top-menu-wrap {
      background-size: 467px 50px;
    }
  }
</style>
<style lang="scss">
  #mainProject.menu-collapse {
    ~ .collapse-transfer {
      .sub-cover {
        text-align: left;
      }
    }
  }

  .only-left-menu .left-menu-bar > .sg-menu {
    > .menu-wrap:last-child {
      margin-bottom: 48px;
    }
  }

  //鼠标右键菜单
  .tab-contextmenu {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    list-style: none;
    padding: 0;
    background-color: #fff;
    text-align: center;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 12px;
    z-index: 999;

    > li {
      line-height: 30px;

      &:hover {
        background-color: #f1f1f1;
      }
    }
  }

  .contextmenu-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    opacity: 0;
    z-index: 998;
  }

  .titleIcon {
    width: 70px;
    height: 70px;
    border-radius: 50px;
    margin-top: 4px;
  }

  .titleIcon1 {
    width: 46px;
    height: 46px;
    border-radius: 50px;
    margin-top: 2px;
  }

  .resetPassModal {
    .sg-modal {
      min-width: 600px !important;
    }

    .sg-modal-body {
      height: 300px !important;
      min-height: 300px;
      padding: 20px 20px 0 20px !important;
    }

    .sg-modal-footer {
      display: none;
    }

    .sg-modal-header-inner {
      background: #213751;
      color: #fff;
      height: 40px;
      line-height: 40px;
    }
  }
</style>
