
<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="form_id" label="表单编号" required>
  <uni-easyinput placeholder="表单编号" v-model="formData.form_id" />
</uni-forms-item>
<uni-forms-item name="title" label="标题" required>
  <uni-easyinput placeholder="表单标题" v-model="formData.title" trim="both" />
</uni-forms-item>
<uni-forms-item name="enable" label="表单状态">
  <uni-data-checkbox v-model="formData.enable" :localdata="formOptions.enable_localdata" />
</uni-forms-item>
<uni-forms-item name="order" label="排序">
  <uni-easyinput placeholder="表单排序" type="number" v-model="formData.order" />
</uni-forms-item>
<uni-forms-item name="fields" label="字段" required>
  <uni-easyinput placeholder="表单记录的全部字段，以逗号分隔" v-model="formData.fields" />
</uni-forms-item>

      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/hvs-form.js';

  const db = uniCloud.database();
  const dbCollectionName = 'hvs-form';

  function getValidator(fields) {
    let reuslt = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        reuslt[key] = validator[key]
      }
    }
    return reuslt
  }

  export default {
    data() {
      return {
        formData: {
  "form_id": "",
  "title": "",
  "enable": 0,
  "order": null,
  "fields": ""
},
        formOptions: {
  "enable_localdata": [
    {
      "text": "启用",
      "value": 0
    },
    {
      "text": "禁用",
      "value": 1
    }
  ]
},
        rules: {
          ...getValidator(["form_id","title","enable","order","fields"])
        }
      }
    },
    onLoad(e) {
      const id = e.id
      this.formDataId = id
      this.getDetail(id)
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      /**
       * 触发表单提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.submit().then((res) => {
          this.submitForm(res)
        }).catch((errors) => {
          uni.hideLoading()
        })
      },

      submitForm(value) {
        // 使用 clientDB 提交数据
        db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field('form_id,title,enable,order,fields').get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }

  .uni-button {
    width: 184px;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    line-height: 1;
    margin: 0;
  }
</style>
