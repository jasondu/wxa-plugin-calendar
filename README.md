# wxa-plugin-calendar
小程序插件-预约日历组件


> 已经审核通过
> APPID：wx84472d5652384779
> 版本号：1.0.0
> 名称：预约日历

## 代码片段链接
 
 **务必填写已经添加该插件的APPID**         
wechatide://minicode/HbH9Yim56XZy

## 插件效果

<img width="300" src="https://github.com/jasondu/wxa-plugin-calendar/blob/master/demo.gif"></img>

1. 申请插件
在小程序管理后台-设置-第三方服务-添加插件，插件APPID：wx84472d5652384779，已经设置为无需确认，申请后即可添加插件
2. 使用插件
在app.json中加上以下代码
```
  "plugins": {
    "myPlugin": {
      "version": "1.0.0",
      "provider": "wx84472d5652384779"
    }
  }
```
在需要使用插件的页面中的json文件添加以下代码
```
  "usingComponents": {
    "date-picker": "plugin://myPlugin/date-picker"
  }
```
在需要使用地方添加
```
<date-picker 
    startTime="{{startTime}}" 
    endTime="{{endTime}}"
    unit="{{unit}}"
    reserveUnit="{{reserveUnit}}"
    unreserveTime="{{unreserveTime}}"
    activedConst="{{activedConst}}"
    disabledConst="{{disabledConst}}"
    themeColor="#1f78d1"
    bind:selectTime="onSelectTime"
/>
```
## 插件参数解释

```
        startTime: {    // 最早预约时间
            type: String,
            value: '09:00',
        },
        endTime: {      // 最晚预约时间
            type: String,
            value: '22:00',
        },
        unit: {         // 展示时间单位（默认30分钟）
            type: Number,
            value: 15,
        },
        reserveUnit: {  // 预约时间单位（默认60分钟）
            type: Number,
            value: 60,
        },
        activedConst: { // 已经选中的常量标示
            type: Number,
            value: 101,
        },
        disabledConst: {// 不可选的常量标示
            type: Number,
            value: 102,
        },
        unreserveTime: {// 不可预约时间列表
            type: Array,
            value: [
                {
                    startTime: '2018-04-18 14:00:00',
                    endTime: '2018-04-18 15:00:00',
                    status: 102,    // 这个值指明这个时间段是 已经选择 或者 不可选     
                                    // 可以通 activedConst 和 disabledConst 进行配置
                },
            ],
        },
        themeColor: {   // 插件的主题颜色
            type: String,
            value: '#E74C75',
        }
```
