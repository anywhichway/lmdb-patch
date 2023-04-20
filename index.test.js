import {open} from "lmdb";
import {patch,withExtensions} from "./index.js";


const db = withExtensions(open("test",{create:true,useVersions:true}),{patch});
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
test("patch non-existent",async () => {
    expect(await db.patch("number",3,5,4)).toBe(false);
    expect(db.getEntry("number")).toEqual({version:2,value:2});
})
test("patch different type",async () => {
    expect(await db.patch("number","1")).toBe(true);
    expect(db.get("number")).toEqual("1");
})
test("patch with function",async () => {
    expect(await db.patch("number",(previousValue) => 10)).toBe(true);
    expect(db.get("number")).toEqual(10);
})
