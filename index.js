
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
    if(type!==oldType || value===null || entry.value===null) {
        return this.put(key,value,version,ifVersion)
    }
    if(type==="object" && oldType==="object") {
        Object.assign(entry.value,value);
        deleteUndefined(entry.value,value);
    } else {
        entry.value = value;
    }
    return this.put(key,entry.value,version,ifVersion);
}

export {patch as default,patch}