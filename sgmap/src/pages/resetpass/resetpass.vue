<template>
  <div>
    <sg-form
      ref="formCustom"
      :model="formCustom"
      :rules="ruleCustom"
      :label-width="100"
    >
      <sg-form-item
        label="原密码"
        prop="oldPwd"
        style="margin-bottom: 34px;"
      >
        <sg-input
          v-model="formCustom.oldPwd"
          type="password"
        />
      </sg-form-item>
      <sg-form-item
        label="新密码"
        prop="newPwd"
        style="margin-bottom: 34px;"
      >
        <sg-input
          v-model="formCustom.newPwd"
          type="password"
        />
      </sg-form-item>
      <sg-form-item
        label="确认新密码"
        prop="newPwd1"
        style="margin-bottom: 34px;"
      >
        <sg-input
          v-model="formCustom.newPwd1"
          type="password"
        />
      </sg-form-item>
      <sg-form-item style="float: right;">
        <sg-button
          type="primary"
          @click="handleSubmit('formCustom')"
        >
          确定
        </sg-button>
        <sg-button
          style="margin-left: 8px;"
          @click="handleReset('formCustom')"
        >
          重置
        </sg-button>
      </sg-form-item>
    </sg-form>
  </div>
</template>
<script>
import login from '@/api/login'
import sha1 from 'sha1'
import {validPass} from "../../util";
export default {
  data () {
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入你的新密码'));
      } else {
        if(this.type==0){
          callback();
        }else{
          if(this.type==1){
            if(value.length<6){
              callback(new Error('新密码长度至少6位'));  
            }
          }       
          let ret = validPass(this.type,value);
          if(!ret){
            if(this.type==2){
              callback(new Error('新密码长度至少6位，大、小写字母，数字，符号组合至少3种，且同种类不能出现3个及以上相同或顺序排列的字符')); 
            }else if(this.type==3){
              callback(new Error('密码长度至少8位，大、小写字母，数字，符号组合都出现，且同种类不能出现3个及以上相同或顺序排列的字符'));  
            }
          }
          if (this.formCustom.newPwd1 !== '') {
          // 对第二个密码框单独验证
            this.$refs.formCustom.validateField('newPwd1');
          }
          callback();
        }      
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认新密码'));
      } else if (value !== this.formCustom.newPwd) {
        callback(new Error('新密码和确认新密码两者不一致'));
      } else {
        callback();
      }
    };
    const validateOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入你的原密码'));
      }else{
        callback();  
      }    
    };

    return {
      type:'',
      formCustom: {
        oldPwd: '',
        newPwd: '',
        newPwd1: ''      
      },
      ruleCustom: {
        oldPwd: [
          {required: true, validator: validateOldPass, trigger: 'blur' }
        ],
        newPwd: [
          {required: true, validator: validateNewPass, trigger: 'blur' }
        ],
        newPwd1: [
          {required: true, validator: validatePassCheck, trigger: 'blur' }
        ]      
      }
    }
  },
  mounted(){
    this.getPassSetting();
  },
  methods: {
    getPassSetting(){
      let params = {
        sysid: "",
        catalog: "功能配置"
      }
      login.listConfigure({params:params}).then((res)=>{
        console.log(res)
        let arr = res.filter(item=>{
          return item.key === "密码强度检查";
        });
        this.type = arr[0].value;
      });
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {       
        if (valid) {
          this.$load.show({text: '加载中...'})
          Object.keys(this.formCustom).forEach(item=>{
            this.formCustom[item] = sha1(this.formCustom[item]).toUpperCase();                        
          });
          login.modifyMypwd(this.formCustom).then((res) => {
            this.$load.hide()
            if(res.success) {
              this.$msg.show({
                type:'success',
                content:'密码重置成功！,将重新跳转到登录页',
                duration:1,
                onClose:()=>{
                  window.parent.location.replace('login.html')
                }
              });
            }else{
              this.$msg.error({content:'密码重置失败！',desc:res.msg})
            }
          }).catch(() => {
            this.$load.hide()
            this.$msg.error('密码重置失败！')
          })
        } else {
          //this.$msg.error('请填写必填项！');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>
<style lang="scss">

</style>