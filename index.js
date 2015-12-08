'use strict';
var Picker = require('picker');

var seeditDistrict = function(option) {
	this.picker;
	this.option = option || ''; // 设置选项
	this.flag = 0; // 判断是否为第一次加载，0 为第一次
	this.province = []; // 省份名称
	this.province_id = []; // 省份 id
	this.city = []; // 城市名称
	this.city_id = []; // 城市 id
	this.region = []; // 区域名称
	this.region_id = []; // 区域 id
	this.all_data = {}; // 所有名称和 id 对应的对象
	this.doc_width = document.documentElement.clientWidth; //手机 viewport 宽度
	this.init();
	return this;
}

seeditDistrict.prototype.init = function() {
	this.getProvince();
}

seeditDistrict.prototype.getApi = function() {
	var url = window.location.host;
	var apiUrl;
	if(/office||(192\.168)/.test(url)) {
		apiUrl = 'http://common.office.bzdev.net/bbs/common_district.jsonp';
	} else if(/online/.test(url)) {
		apiUrl = 'http://common.online.seedit.cc/bbs/common_district.jsonp';
	} else {
		apiUrl = 'http://common.bozhong.com/bbs/common_district.jsonp';
	}
	return apiUrl;
}

seeditDistrict.prototype.getProvince = function() {
	var self = this;

	$.ajax({
		type: 'GET',
		url: self.getApi(),
		dataType : 'jsonp',
		jsonp: '__c',
		jsonpCallback: "jsonp" + new Date().getTime(),
		success: function(data) {
			if(data.error_code === 0) {
				var prov_data = data.data;
				var cols = self.option.cols;
				for(var i = 0; i < prov_data.length; i++) {
					var value = prov_data[i];

					if(typeof self.all_data[value.id] === 'undefined') {
						self.all_data[value.id] = value.name;
					}
					self.province_id.push(value.id);
					self.province.push(value.name);
				}

				if(cols !== 2 && cols !== 3) {
					self.createObj();
				} else if(cols === 2 || cols === 3) {
					self.getCity(prov_data[0].id);
				}

			}
		},
		error: function(data) {
			self.errorHandle(data, self.picker, 'province');
		}
	})
}

seeditDistrict.prototype.getCity = function(upid, picker) {
	var self = this;
	var post_data = {'upid': upid};
	var picker = picker || '';
	this.city = []; // 每次调用该函数时，清空数组，下同
	this.city_id = [];

	$.ajax({
		type: 'GET',
		url: self.getApi(),
		data: post_data,
		dataType: 'jsonp',
		jsonp: '__c',
		jsonpCallback: "jsonp" + new Date().getTime(),
		success: function(data) {
			if(data.error_code === 0 && typeof data.data[0] !== 'undefined') {
				var city_data = data.data;
				var cols = self.option.cols;

				for(var i = 0; i < city_data.length; i++) {
					var value = city_data[i];

					if(typeof self.all_data[value.id] === 'undefined') {
						self.all_data[value.id] = value.name;
					}
					self.city.push(value.name);
					self.city_id.push(value.id);
				}
				
				if(cols === 2 && self.flag === 0) { // 省市，第一次加载
					self.createObj();
					self.flag = 1;
				} else if(cols === 2){ //省市，非第一次加载，重绘第二列
					picker.cols[1].replaceValues(self.city_id, self.city);
					picker.inputSelf.value = picker.params.formatValue(picker, picker._getValues());
				}

				if(cols === 3 && self.flag === 0) { // 省市区，第一次加载，加载第三列
					self.getRegion(city_data[0].id);
				} else if(cols === 3) { // 省市区，非第一次加载，重绘第二列城市，同时加载城市对应的第三列
					picker.cols[1].replaceValues(self.city_id, self.city);
					picker.inputSelf.value = picker.params.formatValue(picker, picker._getValues());
					self.getRegion(city_data[0].id, picker);
				}
			} else {
				self.errorHandle(data, picker, 'city');
			}
		},
		error: function(data) {
			self.errorHandle(data, picker, 'city');
		}
	});
}

seeditDistrict.prototype.getRegion = function(upid, picker) {
	var self = this;
	var post_data = {'upid': upid};
	var picker = picker || '';
	this.region = []; // 每次调用该函数时，清空数组，下同
	this.region_id = [];

	$.ajax({
		type: 'GET',
		url: self.getApi(),
		data: post_data,
		dataType: 'jsonp',
		jsonp: '__c',
		jsonpCallback: "jsonp" + new Date().getTime(),
		success: function(data) {
			if(data.error_code === 0 && typeof data.data[0] !== 'undefined') {
				var region_data = data.data;
				var cols = self.option.cols;

				for(var i = 0; i < region_data.length; i++) {
					var value = region_data[i];

					if(typeof self.all_data[value.id] === 'undefined') {
						self.all_data[value.id] = value.name;
					}
					self.region.push(value.name);
					self.region_id.push(value.id);
				}

				if(cols === 3 && self.flag === 0) { // 省市区，第一次加载
					self.createObj();
					self.flag = 1;
				} else if(cols === 3) { // 省市区，非第一次加载，重绘第三列
					picker.cols[2].replaceValues(self.region_id, self.region);
					picker.inputSelf.value = picker.params.formatValue(picker, picker._getValues());
				}
			} else {
				self.errorHandle(data, picker, 'region');
			}
		},
		error: function(data) {
			self.errorHandle(data, picker, 'region');
		}
	});
}

seeditDistrict.prototype.createObj = function() {
	var self = this;
	var cols;
	var width;
	var cols_number = this.option.cols;
	if(cols_number === 2) { // 加载省市两列
		width = 0.4 * self.doc_width;
		cols = [{
			width: width,
			textAlign: 'left',
			values: self.province_id,
			displayValues: self.province,
			onChange: function(picker, cur, old) {
				self.getCity(cur, picker);
			}
		},
		{
			width: width,
			textAlign: 'left',
			values: self.city_id,
			displayValues: self.city
		}];
	} else if (cols_number === 3) { // 加载省市区三列
		width = 0.3 * self.doc_width;
		cols = [{
			width: width,
			textAlign: 'left',
			values: self.province_id,
			displayValues: self.province,
			onChange: function(picker, cur, old) {
				self.getCity(cur, picker);
			}
		},
		{
			width: width,
			textAlign: 'left',
			values: self.city_id,
			displayValues: self.city,
			onChange: function(picker, cur, old) {
				self.getRegion(cur, picker);
			}
		},
		{
			width: width,
			textAlign: 'left',
			values: self.region_id,
			displayValues: self.region
		}];
	} else { // 默认只加载省份一列
		cols = [{
			textAlign: 'center',
			values: self.province_id,
			displayValues: self.province,
		}];
	}

	var picker_option = self.option.picker || {};
	self.picker = new Picker({
		input: self.option.input,
		itemsNumber: picker_option.itemsNumber || '',
		itemHeight: picker_option.itemHeight || '',
		container: picker_option.container || '',
		formatValue: function(picker, val){
			var str = '';
			var data_str = '';
			if(val[0] !== null) {
				if(typeof val[0] !== 'undefined' && val[0] !== '') {
					str += self.all_data[val[0]];
					data_str += self.all_data[val[0]];
				}

				if(typeof val[1] !== 'undefined' && val[1] !== '') {
					str += self.all_data[val[1]];
					data_str += '$$' + self.all_data[val[1]];
				}

				if(typeof val[2] !== 'undefined' && val[2] !== '') {
					str += self.all_data[val[2]];
					data_str += '$$' + self.all_data[val[2]];
				}
				$(self.option.input).attr('data-string', data_str);
			}
			return str;
		},
		cols: cols,
		onClose: function(picker) {
			self.picker = picker;
		},
		onChange: picker_option.onChange,
		onOpen: picker_option.onOpen,
		toolbarTemplate: picker_option.toolbarTemplate,
	})
}

seeditDistrict.prototype.errorHandle = function(data, picker, type) {
	var cols = this.option.cols;
	var type = type || '';
	if(type === 'province') {
		this.createObj();
	} else if (cols === 2) {
		picker.cols[1].replaceValues([''], ['']);
	} else if(type === 'region') {
		picker.cols[2].replaceValues([''], ['']);
	} else if (cols === 3) {
		picker.cols[1].replaceValues([''], ['']);
		picker.cols[2].replaceValues([''], ['']);
	}

	if(type !== 'province') {
		picker.inputSelf.value = picker.params.formatValue(picker, picker._getValues());
	}

}

module.exports = seeditDistrict;