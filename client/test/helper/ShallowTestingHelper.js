export default class ShallowTestingHelper {
   static filterChildrenElements(children, ref) {
     let filterChildrens = [];
     if(children === Array) {
       for(let child of children) {
         if(child.refs === ref) {
           filterChildrens.push(child);
         }
       }
     }else if(children.ref === ref) {
       filterChildrens.push(children);
     }
     return filterChildrens;
   }
}
