import{_ as E,r as V,c as y,a as o,w as s,o as U,u as r,b as _,d as b,p as x,e as I,f as i}from"./index-DCLTfhWX.js";import{E as v,a as d}from"./el-message-CBjkPurU.js";import{a as k,E as B,b as C,c as F,d as N}from"./api-iXZFNm2E.js";const L=t=>(x("data-v-1f82d911"),t=t(),I(),t),S={class:"user-login-container"},H=L(()=>i("div",{slot:"header",class:"header"},[i("span",null,"用户登录")],-1)),M={__name:"loginUser",setup(t){const f=b();let e=V({username:"李克军",password:"202335710417"});const g=async()=>{try{if(!e.username||!e.password)return l(),d.error("请重新输入");const a=await k.postUsers(e);a.code===200?(d({message:a.msg,type:"success"}),f.push({name:"Home"})):(l(),d.error("用户名或密码错误，请重新输入"))}catch(a){l(),console.log(a),d.error("系统错误，请联系技术人员")}},l=()=>{e.userName="",e.password=""};return(a,n)=>{const u=B,c=C,m=F,h=N,w=v;return U(),y("div",S,[o(w,{class:"user-login-card"},{default:s(()=>[H,o(h,{model:r(e),"label-width":"100px",class:"user-login-form"},{default:s(()=>[o(c,{label:"用户名："},{default:s(()=>[o(u,{modelValue:r(e).username,"onUpdate:modelValue":n[0]||(n[0]=p=>r(e).username=p),placeholder:"请输入用户名"},null,8,["modelValue"])]),_:1}),o(c,{label:"密码："},{default:s(()=>[o(u,{modelValue:r(e).password,"onUpdate:modelValue":n[1]||(n[1]=p=>r(e).password=p),placeholder:"请输入密码"},null,8,["modelValue"])]),_:1}),o(c,null,{default:s(()=>[o(m,{type:"primary",onClick:l},{default:s(()=>[_("取消")]),_:1}),o(m,{type:"primary",onClick:g},{default:s(()=>[_("登录")]),_:1})]),_:1})]),_:1},8,["model"])]),_:1})])}}},q=E(M,[["__scopeId","data-v-1f82d911"]]);export{q as default};
