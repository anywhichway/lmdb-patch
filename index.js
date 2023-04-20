
const deleteUndefined = (target,value) => {
    Object.entries(value).forEach(([key,value]) => {
        if(value===undefined) delete target[key];
        else if(typeof(value)==="object") deleteUndefined(target[key],value);
    })
}

async function patch(key,value,version,ifVersion) {
    const entry = this.getEntry(key,{versions:true});
    if(!entry || (ifVersion && entry.version!==ifVersion)) return false;
    const type = typeof(value),
        oldType = typeof(entry.value);
    if(type==="function") {
        entry.value = value(entry.value,entry.version);
    } else if(type!==oldType || value===null || entry.value===null) {
        entry.value = value;
    } else if(type==="object" && oldType==="object") {
        Object.assign(entry.value,value);
        deleteUndefined(entry.value,value);
    } else {
        entry.value = value;
    }
    return this.put(key,entry.value,version,ifVersion);
}

import {withExtensions} from "lmdb-extend";

export {patch as default,patch,withExtensions}
