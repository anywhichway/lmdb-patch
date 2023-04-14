import {open} from "lmdb";
import {patch} from "./index.js";


const db = open("test",{create:true,useVersions:true});
db.patch = patch;
db.clearSync();
db.putSync("number",1,1);
db.putSync("object",{a:1,nested:{b:2}},1);

test("patch literal",async () => {
    expect(await db.patch("number",2,2,1)).toBe(true);
    expect(db.getEntry("number")).toEqual({version:2,value:2});
})
test("patch object",async () => {
    expect(await db.patch("object",{nested:{b:undefined,c:3}},2,1)).toBe(true);
    expect(db.getEntry("object")).toEqual({version:2,value:{a:1,nested:{c:3}}});
})
