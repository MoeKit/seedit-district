# 用法

---

## 省份单列

<input type="text" id="JS_input_1">

````javascript
var $ = require('zepto'); //如果页面已引入 zepto 或 jquery，请忽略这行
var seeditDistrict = require('seedit-district');
new seeditDistrict({
	'input': '#JS_input_1',
	'cols': 1
})
````

## 省市两列

<input type="text" id="JS_input_2">

````javascript
var seeditDistrict = require('seedit-district');
new seeditDistrict({
	'input': '#JS_input_2',
	'cols': 2
})
````

## 省市区三列
<input type="text" id="JS_input_3">

````javascript
var seeditDistrict = require('seedit-district');
new seeditDistrict({
	'input': '#JS_input_3',
	'cols': 3
})
````