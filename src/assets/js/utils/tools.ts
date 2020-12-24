import _ from 'lodash'

/**
 * 树的递归查找
 * @param items 
 * @param attrs 
 * @param sonField 
 */
export const findTree = (items: any[], attrs: Function | Object, sonField = 'children') => {
  if (!_.isFunction(attrs) && _.isEmpty(attrs)) {
    return null;
  }
  
  let node = null;
  let callback = _.iteratee(attrs);
  let level = 0;

  // 递归查找子级所有节点
  while (items && items.length) {
      let children = [] as any[];
      level++;

      node = _.find(items, (item: any) => {
        children = children.concat(item[sonField] || []);
        
        return callback(item, level);
      });
      
      if (node) {
        break;
      }

      items = children;
  }

  return node;
}

/**
 * uuid
 * @param len 
 */
export const uuid = (len = 6) => {
  const scopes = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z'
  ];

  let res = '';
  for(let i = 0; i < len; i++) {
    const index = Math.floor(Math.random() * 62);
    res += scopes[index];
  }
  return res
};