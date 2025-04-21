### 前言
在项目中有一个需求，做一个流程图，本来想着ctrl+c/v来着方便些，网上查了一下，少之又少，就干脆自己写了一下，供大家参考。示例图如下。
本次开发用的是vue+scss形式，不过基本上都是css3+js而已，简单易懂，同样也好拓展。
#### 图例
![avatar](https://images.cnblogs.com/cnblogs_com/sqh17/1184225/t_211102140027_progress.jpg)
#### 思路
1. 父元素设置flex布局，子元素都是自适应，可随着屏幕宽度变化而变化。
2. 设置双伪元素::before/::after，一个在前，一个在后，通过设置border-top/bottom/left的大小，让与父元素契合。
3. 通过:first-child/:last-child设置第一个和最后一个不显示伪元素。
4. 需要给flow-charts-single设置右圆角，因为正常的情况下会有一条白线。设置圆角，并向伪元素再往左移动1px。看起来更加毫无违和感。
5. js相对简单，也可以设置步骤，事件，颜色等等，通过js去设置即可
#### 页面
```html
<div class="flow-charts">
    <div class="flow-charts-single" :class="{'disabled-flow-charts-single':item.isDisabled}" v-for="(item) in dealpieData" :key="item.id" :style="{'--color':!item.isDisabled?item.color:'#f5f5f5'}">
        <div class="number">{{!item.isDisabled?item.count:'暂无该功能'}}</div>
        <div class="name">{{item.name}}人数</div>
    </div>
</div>
```
#### 样式
```scss
.flow-charts{
    width: 100%;
    display: flex;
    justify-content: center;

    .flow-charts-single{
        flex: 1;
        height: 72px;
        background: var(--color);
        position: relative;
        display: inline-block;
        margin-right: 34px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-bottom-right-radius: 2px;
        border-top-right-radius: 2px;
        .name{
            font-size: 12px;
            color: #fff;
            line-height: 18px;
            margin-top: 5px;
            font-weight: 400;
        }
        .number{
            font-size: 22px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 22px;
        }
        &::after{
            content:'';
            border-bottom: 36px solid transparent;
            border-left: 26px solid var(--color);
            border-top: 36px solid transparent;
            // display: inline-block;
            position: absolute;
            right: -25px;
            top: 0;
        }
        &::before{
            content:'';
            border-bottom: 36px solid var(--color);
            border-left: 26px solid transparent;
            border-top: 36px solid var(--color);
            // display: inline-block;
            position: absolute;
            left: -25px;
            top: 0;
        }
        &:first-child{
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            
            &::before{
                display: none;
            }
        }
        &:last-child{
            margin-right: 0;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            
            &::after{
                display: none;
            }
        }
    }
    .disabled-flow-charts-single{
        .name{
            color: #bfbfbf;
        }
        .number{
            color: #BFBFBF;
            font-size: 14px;
        }
    }
}
```

#### js
```javascript
export default {
    name:'progress',
    data:function(){
        return {
            dealpieData:[{
                name:'通知',
                color:'red',
                count:100
            },{
                name:'签到',
                color:'pink',
                count:200
            },{
                name:'报到',
                color:'green',
                count:0,
                isDisabled:true
            },{
                name:'参与',
                color:'red',
                count:120
            }]
            
        }
    },
```
