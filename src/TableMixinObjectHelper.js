/**
 * @author 冯天鹤
 * @description 对象通过属性路径获取属性值
 * @param obj example: {user: {name: '王二'}}
 * @param path example: user.name
 * @param strict
 * @param def 默认值，在 strict = true时生效
 * @returns {*}
 */
function getPropByPath(obj, path, strict = false, def = undefined) {
    let tempObj = obj;
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    let keyArr = path.split('.');
    let pathLen = keyArr.length;
    for (let i = 0; i < pathLen; ++i) {
        if (!tempObj && !strict) break;
        let pathKey = keyArr[i];
        if (tempObj[pathKey]) {
            tempObj = tempObj[pathKey];
        } else {
            if (strict) {
                if (def !== undefined) {
                    return def
                }
                throw new Error('please transfer a valid prop path to form item!');
            }
            break;
        }
    }
    return tempObj;
}

export default {
    getPropByPath
}
