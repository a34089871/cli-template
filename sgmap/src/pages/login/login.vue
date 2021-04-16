<template>
  <div class="login">
    <div class="layout">
      <div class="wrap">
        <span class="form-title">{{ loginsetInfo.sysTitle }}</span>
        <span class="form-title-line" />
        <sg-form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          style="margin-top: 20px;"
        >
          <sg-form-item prop="selectedSystem">
            <sg-select
              v-model="formValidate.selectedSystem"
              placeholder="子系统"
              :clearable="selectSysClearFlag"
              @on-change="onChange"
            >
              <sg-option
                v-for="(item,index) in sysList"
                :key="index"
                :value="`${item.sysCode}_${item.visitUrl}`"
              >
                {{ item.sysName }}
              </sg-option>
            </sg-select>
          </sg-form-item>
          <sg-form-item prop="username">
            <sg-input
              v-model="formValidate.username"
              placeholder="请输入账号"
            />
          </sg-form-item>
          <sg-form-item prop="password">
            <sg-input
              v-model="formValidate.password"
              type="password"
              can-see
              placeholder="请输入密码"
            />
          </sg-form-item>
          <sg-form-item>
            <div class="flex">
              <div
                class="flex-item"
                @click="handleRemember('formValidate')"
              >
                <sg-checkbox
                  v-model="keep"
                  class="keep"
                >
                  记住账号
                </sg-checkbox>
              </div>
              <div class="flex-item">
                <p @click="forgetPassword">忘记密码？</p>
              </div>
            </div>
          </sg-form-item>
          <sg-form-item>
            <sg-button
              :class="{'is-login': isCanLogin}"
              block
              type="primary"
              @click="handleLogin('formValidate')"
            >
              登录
            </sg-button>
          </sg-form-item>
        </sg-form>
        <div class="info-layout">
          <span class="way">版权信息</span>
          <span style="margin-top: 15px;">{{ loginsetInfo.copyright }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import login from "@/api/login";
import utils from "../../assets/js/utils";
import { SgButton, SgInput, SgForm, SgFormItem, SgCheckbox } from "southgisui";
import {getCode} from "../../util";

export default {
  components: { SgButton, SgInput, SgForm, SgFormItem, SgCheckbox },
  data() {
    return {
      //表单属性信息
      formValidate: {
        username: "",
        password: "",
        selectedSystem: ''
      },
      //是否记住账号
      keep: false,
      //子系统下拉框清除标志
      selectSysClearFlag:false,
      //表单验证规则
      ruleValidate: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      },
      //子系统
      selectSystem: {},
      //子系统列表
      sysList: [],
      //是否展示系统切换
      showDropdown: false,
      //平台统一信息
      loginsetInfo:{}
    };
  },
  computed: {
    //未登录时，登录按钮的状态
    isCanLogin() {
      return !!(this.formValidate.username && this.formValidate.password);
    }
  },
  async mounted() {
    if (localStorage.getItem('userName') != null && localStorage.getItem('passWord') != null) {
      let userName = utils.decrypt(localStorage.getItem('userName'));
      let passWord = utils.decrypt(localStorage.getItem('passWord'), '');
      this.formValidate.username = userName;
      this.formValidate.password = passWord;
      this.keep = true;
    } else {
      this.keep = false;
    }
    // Enter login
    document.addEventListener("keydown", this.EnterLogin);
    await this.listAllSubSystems();
    this.loginset()
    this.initEnvironmentConfigure();
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.EnterLogin);
  },
  methods: {
    /**
     * 获取所有子系统列表
     */
    async listAllSubSystems() {
      await login.listAllSubSystems().then(res => {
        this.sysList = res;
        //apiMgr有些问题，对于返回的数据没有做统一处理
        //this.selectSystem = this.sysList[0];
        //默认选中默认系统
        this.sysList.forEach(item => {
          let _sortValue = item.sortValue;
          if (_sortValue < 0) {
            this.selectSystem = item;
            this.formValidate.selectedSystem = `${item.sysCode}_${item.visitUrl}`;
          }
        });
      }).catch(err => {
        console.log("err===>", err)
        //this.sysList = [{"sortValue":-1.0,"creator":"","visitUrl":"","sysName":"主系统","sysCode":"os","funcUrl":"","rid":"00000000-0000-0015-0001-000000000001","createTime":1593501909000},{"sortValue":0.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"/mainProject/home.html?xhb","sysName":"南方数码空间基础信息平台","sysCode":"xhb","funcUrl":"","rid":"232188b7-0aec-44bf-9a29-1cc426ffdb0e","createTime":1581472992000},{"sortValue":0.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"/mainProject/home?scode=emap","sysName":"国土空间基础信息平台","sysCode":"emap","funcUrl":"","rid":"6a540462-214c-454c-bded-87b387cfda85","createTime":1592181997000},{"sortValue":0.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"/mainProject/index.html?scode=dmc","sysName":"数据中心","sysCode":"dmc","funcUrl":"","rid":"9aeb7b4a-f14c-43a6-9290-6dd5db0225fd","createTime":1575583203000},{"sortValue":1.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"http://192.168.10.126/mainProject/home.html?scode=kk12345","sysName":"测试0701","sysCode":"kk12345","funcUrl":"","rid":"71671bb4-e8b3-45d8-8c4a-15a6ed72e808","createTime":1593596854000},{"sortValue":1.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"/sinfo/home.html","sysName":"测软测试","sysCode":"sinfo","funcUrl":"","rid":"89e2caa2-902f-4496-8dc8-37184d9ef6f2","createTime":1590043018000},{"sortValue":2.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"/mainPorject/home.html?scode=tgy","sysName":"土地调查数据管理与辅助决策系统","sysCode":"tgy","funcUrl":"","rid":"47248bc3-efb4-4cd7-aa45-716dcf81dd9d","createTime":1588730403000},{"sortValue":3.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"mainProject/index.html?scode=app","sysName":"应用中心","sysCode":"app","funcUrl":"","rid":"494ea4cf-92dc-4d6b-ab5c-06da5341334a","createTime":1593503371000},{"sortValue":5.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"mainProject/home.html?scode=rmg","sysName":"深圳成果管理","sysCode":"rmg","funcUrl":"","rid":"c10fb93d-29f9-49fb-868e-d85bb0c7ab98","createTime":1588730428000},{"sortValue":7.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"/mainPorject/home.html?scode=wl","sysName":"工作列表","sysCode":"wl","funcUrl":"","rid":"573e77b5-58b4-45a8-86a4-a1f1573ccd6b","createTime":1588787969000},{"sortValue":11.0,"creator":"00000001-0000-0000-0010-000000000001","visitUrl":"http://www.baidu.com","sysName":"00","sysCode":"00","funcUrl":"","rid":"47af2e28-4898-46d8-a682-0fe87f4af91c","createTime":1593502367000}];
        //this.selectSystem = this.sysList[0];
      });
    },
    async initEnvironmentConfigure(){
      let _sysid = this.selectSystem.rid;
      console.log('-------_sysid---------',_sysid)
      await login.environmentConfigure({params:{sysid:_sysid}})
        .then(config=>{
          let _protocol = window.parent.location.protocol;
          let _host = window.parent.location.host.indexOf('localhost')!=-1?'192.168.10.126':window.parent.location.host;
          let pre_url = _protocol+"//"+_host+"/";
          let backgroundImgSrc = config["登录页底图"] === ''|| config["登录页底图"] === null || typeof config["登录页底图"]=='undefined'?"":pre_url+config["登录页底图"]+"?"+parseInt(Math.random()*(999999-100000)+100000);
          if(backgroundImgSrc != ""){
            document.querySelector(".login").style.backgroundImage = `url(${backgroundImgSrc})`;
          }else{
            document.querySelector(".login").style.backgroundImage = "url('static/login/loginBg.jpg')";           
          }       
        })
    },
    /**
     * 获取统一信息配置
     */
    loginset(){
      login.loginset()
        .then(res=>{
          this.loginsetInfo=res
        })
    },
    onChange(value){
      let _sysCode = value.split("_")[0];
      let _selectItem = this.sysList.filter(item=>{
        if(item.sysCode === _sysCode){
          return item;
        }
      });
      this.selectSystem = _selectItem[0];
      this.initEnvironmentConfigure();
    },
    /**
     * @Description:用户登陆系统，登陆规则详见***
     * @author huangjianhui
     * @date 2019/10/26
     */
    handleLogin(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const params = {
            grant_type: "password",
            client_id: "sfpasys",
            username: this.formValidate.username,
            // eslint-disable-next-line no-undef
            password: sha1(this.formValidate.password).toUpperCase()
          };
          login
            .login({ params: params })
            .then(res => {
              //记住密码则存localStorage
              if (this.keep == true) {
                localStorage.setItem(
                  "userName",
                  utils.encrypt(this.formValidate.username, "")
                );
                localStorage.setItem(
                  "passWord",
                  utils.encrypt(this.formValidate.password, "")
                );
              }
              localStorage.setItem("loginTicket", JSON.stringify(res));
              //组装跳转URL
              // 此处调整逻辑，在开发环境下，跳转的是home.html
              let redirectUrl = "";
              const env=process.env.NODE_ENV
              //获取scode，登陆页有scode，优先跳转到改子系统
              const scode=getCode(location.href).scode
              if(env==='development') {
                redirectUrl = `/home.html?scode=${scode?scode:this.selectSystem.sysCode}`
              } else {
                if (!this.selectSystem.visitUrl || this.selectSystem.visitUrl === "null" || this.selectSystem.visitUrl.trim() === "") {
                  redirectUrl = `/mainProject/home.html?scode=${scode?scode:this.selectSystem.sysCode}`
                } else {
                  redirectUrl = this.selectSystem.visitUrl;
                }
              }
              if(redirectUrl === ''){
                this.$msg.warning('该子系统没有配置系统主地址，请选择其他的子系统！！！');
              }else{
                window.location.href = redirectUrl;
              }                                      
            })
            .catch(error => {
              console.log(error);
              if(!error.response){
                this.$msg.warning({
                  content: '该子系统登录异常，请选择其他的子系统！！！',
                  desc: '错误码：500',
                  duration: 3
                }) 
              }else{
                if (error.response.status === 401) {
                  this.$msg.warning({
                    content: decodeURI(error.response.headers['x-auth-emsg']),
                    desc: '错误码：401',
                    duration: 5
                  })
                }else{
                  this.$msg.warning({
                    content: '该子系统登录异常，请选择其他的子系统！！！',
                    desc: '错误码：500',
                    duration: 3
                  })
                }
              }        
            });
        }
      });
    },
    EnterLogin(e) {
      if (e.keyCode === 13) {
        this.handleLogin("formValidate");
      }
    },
    handleRemember(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let rememberStates = this.keep;
          this.keep = !rememberStates;
        } else {
          this.keep = false;
          console.log("error");
        }
      });
      console.log(this.keep);
    },
    //忘记密码
    forgetPassword(){
      login.forgetPwd().then(res=>{
        if(res.Status){
          let pwdType = res.Result.pwdType;
          let sysTitle = res.sysTitle;
          const env=process.env.NODE_ENV;
          let forgetPassHtmlSrc = "";
          if(env==='development') {
            forgetPassHtmlSrc = '/forgetpass.html?pwdType='+pwdType+"&sysTitle="+encodeURI(sysTitle);
          }else{
            forgetPassHtmlSrc = '/mainProject/forgetpass.html?pwdType='+pwdType+"&sysTitle="+encodeURI(sysTitle);
          }
          this.$modal.show({
            title: '按下面步骤，设置新密码',         
            similar: true,
            footerHide: true,
            closable: true,
            className: 'forgetPassModal',
            render: (h) =>{
              return h('iframe',{
                attrs:{
                  src: forgetPassHtmlSrc
                },
                style:{
                  height: '400px',
                  width: '700px'
                }
              })
            }
          })
        }else{
          this.$msg.warning(res.Msg); 
        }
      });     
    }
  }
};
</script>

