// utils/dictUtil.js

// 内部缓存变量
let dictTypes = [];       // 存放字典类型集合，元素格式：{ code: number, name: string }
let dictValuesMap = {};   // 存放字典值集合，键为字典类型 code，对应值为数组，元素格式：{ id, dictCode, dictName }

/**
 * 设置或更新字典类型数据
 * @param {Array} types - 字典类型集合 List<DictTypeVo>
 */
function setDictTypes(types) {
  dictTypes = types || [];
}

/**
 * 设置或更新字典值数据
 * @param {Object} valuesMap - 字典值集合 Map<String, List<DictAllListVo>>
 */
function setDictValuesMap(valuesMap) {
  dictValuesMap = valuesMap || {};
}

/**
 * 根据字典类型 code 获取字典类型名称
 * @param {Number|String} dictTypeCode 
 * @returns {String} 如果存在返回字典类型名称，否则返回空字符串
 */
function getDictTypeName(dictTypeCode) {
  const dt = dictTypes.find(item => item.code == dictTypeCode);
  return dt ? dt.name : '';
}

/**
 * 根据字典类型 code 获取该类型下的字典值集合
 * @param {Number|String} dictTypeCode 
 * @returns {Array} 字典值数组，若不存在返回空数组
 */
function getDictValues(dictTypeCode) {
  return dictValuesMap[dictTypeCode] || [];
}

/**
 * 根据字典类型 code 和字典 id 获取字典名称
 * @param {Number|String} dictTypeCode 
 * @param {Number|String} id 
 * @returns {String} 字典名称或空字符串
 */
function getDictNameById(dictTypeCode, id) {
  const values = getDictValues(dictTypeCode);
  const item = values.find(v => v.id == id);
  return item ? item.dictName : '';
}

/**
 * 根据字典类型 code 和字典值中的 dictCode 获取字典名称
 * @param {Number|String} dictTypeCode 
 * @param {Number|String} dictCode 
 * @returns {String} 字典名称或空字符串
 */
function getDictNameByDictCode(dictTypeCode, dictCode) {
  const values = getDictValues(dictTypeCode);
  const item = values.find(v => v.dictCode == dictCode);
  return item ? item.dictName : '';
}

module.exports = {
  setDictTypes,
  setDictValuesMap,
  getDictTypeName,
  getDictValues,
  getDictNameById,
  getDictNameByDictCode
};
