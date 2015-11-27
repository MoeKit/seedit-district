# seedit-district [![spm version](https://moekit.com/badge/seedit-district)](https://moekit.com/package/seedit-district)

---

## Usage

```js
var seeditDistrict = require('seedit-district');
var options = {
	input: '#input-id',
	cols: 1
}
var district = new seeditDistrict(options);

```

### 选项 options
- input: `String` 用于触发省市选择器，input 的 id ，需要带 # 号
- cols: `Number` 显示省市区列数，1 - 省份，2 - 省份和城市， 3 - 省份、城市和区域

## Note

选择完成之后，会在 input 标签中添加 `data-string` 属性，需要发送数据到服务器时，可以获取该属性的值。