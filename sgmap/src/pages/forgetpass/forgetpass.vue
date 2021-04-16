<template>
    <div>
        <sg-step :step-arr="stepArr" :active-step="activeStep" direction="horizontal" style="margin-bottom: 20px;"></sg-step>
        <template v-if="activeStep == 1">
            <sg-form ref="formCustom1" :model="formCustom1" :rules="ruleCustom1" :label-width="100">
                <sg-form-item label="账户名" prop="account" style="margin-bottom: 34px;">
                    <sg-input v-model="formCustom1.account" placeholder="请输入账户名" type="text" />
                </sg-form-item>
                <sg-row>
                    <sg-col :column="10">
                        <sg-form-item label="图形验证码" prop="imageVerificationCode" style="margin-bottom: 34px;">
                            <sg-input ref="imageVerificationCode" v-model="formCustom1.imageVerificationCode" placeholder="请输入图形验证码" type="text" />
                        </sg-form-item>
                    </sg-col>
                    <sg-col :column="2">
                        <img id="kaptchaImage" @click="reflashKaptcha" :src="kaptchaImageSrc">
                    </sg-col>
                </sg-row>
                <sg-form-item style="float: right;">
                    <sg-button @click="handleReset">
                        返回登录
                    </sg-button>
                    <sg-button type="primary" @click="ToNextForm">
                        下一步
                    </sg-button>                   
                </sg-form-item>
            </sg-form>
        </template>
        <template v-if="activeStep == 2">
            <sg-form ref="formCustom2" :model="formCustom2" :rules="ruleCustom2" :label-width="100">
                <sg-form-item label="验证方式" prop="yzSelectType" style="margin-bottom: 34px;">
                    <sg-select v-model="formCustom2.yzSelectType" @on-change="changeVerificationType">
                        <sg-option v-for="(item,index) in verificationType" :key="index" :value="`${item.code}`">
                            {{ item.name }}
                        </sg-option>
                    </sg-select>
                </sg-form-item>
                <sg-form-item :label="verificationLabel" style="margin-bottom: 34px;">
                    <sg-input v-model="formCustom2.phoneNum" type="text" readonly/>
                </sg-form-item>
                <sg-row>
                    <sg-col :column="8">
                        <sg-form-item label="校验码" prop="phonecode" style="margin-bottom: 34px;">
                            <sg-input v-model="formCustom2.phonecode" placeholder="请输入校验码" type="text" />
                        </sg-form-item>
                    </sg-col>
                    <sg-col :column="1"></sg-col>
                    <sg-col :column="3">
                        <sg-button @click="getSMSCode" :disabled="smsCodeBtnStatus">{{ smsCodeBtn }}</sg-button>
                    </sg-col>
                </sg-row>
                <sg-form-item style="float: right;">
                    <sg-button @click="handleReset">
                        返回登录
                    </sg-button>
                    <sg-button @click="ToBackForm">
                        上一步
                    </sg-button>
                    <sg-button type="primary" @click="ToNextForm">
                        下一步
                    </sg-button>                   
                </sg-form-item>
            </sg-form>
        </template>
        <template v-if="activeStep == 3">
            <div>
             <sg-form ref="formCustom3" :model="formCustom3" :rules="ruleCustom3" :label-width="100">
                <sg-form-item label="新密码" prop="pwd" style="margin-bottom: 34px;">
                    <sg-input v-model="formCustom3.pwd" type="password" placeholder="请输入新密码" :can-see='true'/>
                </sg-form-item> 
                <sg-form-item label="确认密码" prop="rpwd" style="margin-bottom: 34px;">
                    <sg-input v-model="formCustom3.rpwd" type="password" placeholder="请输入确认密码" :can-see='true'></sg-input>
                </sg-form-item>
                <sg-form-item style="float: right;">
                    <sg-button @click="handleReset">
                        返回登录
                    </sg-button>
                    <sg-button @click="ToBackForm">
                        上一步
                    </sg-button>
                    <sg-button type="primary" @click="ToNextForm">
                        下一步
                    </sg-button>                   
                </sg-form-item>
             </sg-form>
            </div>
        </template>
        <template v-if="activeStep == 4">
            <div class="modifyResult" style="text-align: center; margin-top: 80px;"> 
                <p style="font-size: 26px;">密码已修改成功，请重新登录该账户！</p>
                <div>
                    <sg-button @click="handleReset">
                        登录
                    </sg-button>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import login from '@/api/login'
import sha1 from 'sha1'
import {validPass} from "../../util";
export default {
  data () {
    const validateNewPass = (rule, value, callback) => {
      console.log('------',value)
      if (value === '') {
        callback(new Error('请输入你的新密码'));
      } else {
        if(this.pwdType==0){
          callback();
        }else{
          if(this.pwdType==1){
            if(value.length<6){
              callback(new Error('新密码长度至少6位'));  
            }
          }       
          let ret = validPass(this.pwdType,value);
          if(!ret){
            if(this.pwdType==2){
              callback(new Error('新密码长度至少6位，大、小写字母，数字，符号组合至少3种，且同种类不能出现3个及以上相同或顺序排列的字符')); 
            }else if(this.pwdType==3){
              callback(new Error('密码长度至少8位，大、小写字母，数字，符号组合都出现，且同种类不能出现3个及以上相同或顺序排列的字符'));  
            }
          }
          if (this.formCustom3.pwd !== '') {
          // 对第二个密码框单独验证
            this.$refs.formCustom3.validateField('rpwd');
          }
          callback();
        }      
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.formCustom3.pwd) {
        callback(new Error('新密码和确认密码两者不一致'));
      } else {
        callback();
      }
    };
    return {
      pwdType: 0,
      sysTitle: '',
      activeStep: 1, //当前步骤
      kaptchaImageSrc: '/mainweb/public/personal/register/captcha-image',
      formCustom1: {
        account: '',
        imageVerificationCode: ''     
      },
      formCustom2: {
        yzSelectType:'',
        phoneNum:'',
        phonecode:'',
        userid:''
      },
      formCustom3: {
        pwd:'',
        rpwd:''
      },
      stepArr: [
        {
          name: '填写账户名',
          number: 1
        },
        {
          name: '验证身份',
          number: 2
        },
        {
          name: '设置新密码',
          number: 3
        },
        {
          name: '完成',
          number: 4
        }
      ],
      verificationType:[], //验证方式
      verificationLabel:'',
      phoneAndMailObj:{},
      smsCodeBtn: '获取验证码',
      smsCodeBtnStatus: false,
      timer:{}, //定时器对象
      ruleCustom1: {
        account: [
          {required: true, message: '账户名不能为空', trigger: 'blur' }
        ],
        imageVerificationCode: [
          {required: true, message: '图形验证码不能为空', trigger: 'blur' }
        ]
      },
      ruleCustom2: {
        yzSelectType: [
          {required: true, message: '验证方式不能为空', trigger: 'change' }
        ],
        phonecode: [
          {required: true, message: '校验码不能为空', trigger: 'blur' }
        ]
      },
      ruleCustom3: {
        pwd: [
          {required: true, validator: validateNewPass, trigger: 'blur' }
        ],
        rpwd: [
          {required: true,validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    timestamp: {
      get: function(){
        return this.kaptchaImageSrc;
      },
      set: function(newValue){
        this.kaptchaImageSrc = `/mainweb/public/personal/register/captcha-image?date=${newValue}`  
      }      
    }
  },
  mounted(){
    let _href = window.location.href;
    let params = _href.split('?')[1];
    let paramArr = params.split('&');
    this.pwdType = paramArr[0].split('=')[1];
    this.sysTitle = decodeURI(paramArr[1].split('=')[1]);
  },
  methods: {
    reflashKaptcha(){
      this.timestamp = new Date().getTime();
      this.formCustom1.imageVerificationCode = '';
      this.$nextTick(function () {
        this.$refs.imageVerificationCode.focus()
      })
    },
    changeVerificationType(value){
      if(value == 'sms'){
        this.formCustom2.phoneNum = this.phoneAndMailObj.phone == '未绑定'? '':this.phoneAndMailObj.phone;
        this.verificationLabel = '已验证手机';
      }else if(value == 'mail'){
        this.formCustom2.phoneNum = this.phoneAndMailObj.email == '未绑定'? '':this.phoneAndMailObj.email;
        this.verificationLabel = '已验证邮箱';
      }
      if(this.formCustom2.phoneNum == ''){
        this.smsCodeBtnStatus = true;
      }else{
        this.smsCodeBtnStatus = false;  
      }
    },
    getSMSCode(){
      let data = {
        address:this.formCustom2.phoneNum,
        msgtype:this.formCustom2.yzSelectType,
        sysTitle:this.sysTitle
      }
      login.sendPhoneCodeSMS(data).then((res) => {
        console.log(res);
        this.invokeSettime();      
      });
    },
    invokeSettime(){
      let count = 60;
      const settime = ()=>{
        if(count == 0){
          this.smsCodeBtnStatus = false;
          this.smsCodeBtn = '获取验证码';
          count = 60;
          this.clearTime();
          return;
        }else{
          this.smsCodeBtnStatus = true;
          this.smsCodeBtn = `${count} s 重新发送`;
          count--;
        }
      };
      this.timer = setInterval(()=>{settime()},1000)
    },
    handleReset(){
      window.parent.location.replace('login.html')
    },
    ToBackForm(){
      if(this.activeStep == 2){
        Object.keys(this.formCustom2).forEach(item=>{
          this.formCustom2[item] = '';
        });
        this.verificationType = [];
        this.verificationLabel = '';
        this.phoneAndMailObj = {};
        this.formCustom1.imageVerificationCode = '';
        this.smsCodeBtnStatus = false;
        this.clearTime();
      }else if(this.activeStep == 3){
        Object.keys(this.formCustom3).forEach(item=>{
          this.formCustom3[item] = '';
        });
      }
      this.activeStep--;
    },
    clearTime(){
      try{
        clearInterval(this.timer);
      }catch(err){
        console.log(err);
      }
    },
    ToNextForm () {
      if(this.activeStep == 1){
        this.$refs.formCustom1.validate((valid) => {
          if (valid) {
            this.$load.show({text: '加载中...'})
            login.verificationOfAccountInformation(this.formCustom1).then((res) => {
              this.$load.hide()
              if(res.Status){
                let _verificationType = res.verificationType;
                this.phoneAndMailObj = res.Result;
                _verificationType.forEach(item=>{
                  let _obj = {};
                  _obj.code = item;
                  if(item == 'sms'){                  
                    _obj.name = '手机';
                  }else if(item == 'mail'){
                    _obj.name = '邮箱';
                  }
                  this.verificationType.push(_obj);
                });
                //设置默认
                if(this.verificationType.length){
                  this.formCustom2.yzSelectType = this.verificationType[0].code;
                  if(this.formCustom2.yzSelectType == 'sms'){
                    this.formCustom2.phoneNum = this.phoneAndMailObj.phone == '未绑定'? '':this.phoneAndMailObj.phone;
                    this.verificationLabel = '已验证手机';
                  }else if(this.formCustom2.yzSelectType == 'mail'){
                    this.formCustom2.phoneNum = this.phoneAndMailObj.email == '未绑定'? '':this.phoneAndMailObj.email;
                    this.verificationLabel = '已验证邮箱';
                  }                 
                }   
                this.formCustom2.userid = this.phoneAndMailObj.userid;  
                if(this.formCustom2.phoneNum == ''){
                  this.smsCodeBtnStatus = true;
                }          
                this.activeStep = 2;
                this.clearTime();           
              }else{
                this.$msg.warning(res.Msg);   
              }
            })
          }                
        })     
      }else if(this.activeStep == 2){       
        this.$refs.formCustom2.validate((valid) => {
          if (valid) {
            let data = {
              type: this.formCustom2.yzSelectType,
              address: this.formCustom2.phoneNum,
              verificationCode: this.formCustom2.phonecode,
              userid: this.formCustom2.userid
            };
            login.verificationCode(data).then(res=>{
              if(res.Status){
                this.activeStep = 3;   
              }else{
                this.$msg.warning(res.Msg);    
              }               
            }).catch(err => {
              console.log(err);
              this.$msg.warning('校验码校验失败，请选择不同的校验方式或输入正确的校验码');
            });
          }
        });      
      }else if(this.activeStep == 3){
        this.$refs.formCustom3.validate((valid) => {
          if (valid) {
            let data = {
              userid: this.formCustom2.userid,
              password: sha1(this.formCustom3.pwd).toUpperCase()
            }
            login.saveNewPasword(data).then(res=>{
              if(res.Status){
                this.activeStep = 4;   
              }else{
                this.$msg.warning(res.Msg);    
              }
            })
          }
        }); 
      }
    }
  }
}
</script>
<style lang="scss">

</style>