import{_ as v,r as h,c as E,a,w as o,o as I,u as s,b as i,d as N,p as S,e as y,f as _}from"./index-DCLTfhWX.js";import{E as L,a as p}from"./el-message-CBjkPurU.js";import{a as x,E as C,b as F,c as U,d as k}from"./api-iXZFNm2E.js";const B=d=>(S("data-v-a9f13893"),d=d(),y(),d),Q={class:"login-container"},M=B(()=>_("div",{slot:"header",class:"header"},[_("span",null,"SQL Server 登录")],-1)),R={__name:"loginSQL",setup(d){const f=N();let e=h({server:"127.0.0.1",userName:"sa",password:"",database:"management"});const g=async()=>{try{if(!e.server||!e.userName||!e.password||!e.database)return m(),p.error("请重新输入");const r=await x.getupdateConfig(e);console.log(r),r.code===200?(p({message:r.msg,type:"success"}),sessionStorage.setItem("isLoggedIn","true"),f.push({name:"LoginUser"})):(m(),p.error("登录失败，请重新输入！"))}catch(r){console.log(r),m(),p.error("系统错误，请联系技术人员")}},m=()=>{e.server="127.0.0.1",e.userName="sa",e.password="",e.database="management"},V=()=>{m()};return(r,l)=>{const u=C,n=F,c=U,b=k,w=L;return I(),E("div",Q,[a(w,{class:"login-card"},{default:o(()=>[M,a(b,{model:s(e),"label-width":"100px",class:"login-form"},{default:o(()=>[a(n,{label:"服务器名："},{default:o(()=>[a(u,{modelValue:s(e).server,"onUpdate:modelValue":l[0]||(l[0]=t=>s(e).server=t),placeholder:"请输入服务器名"},null,8,["modelValue"])]),_:1}),a(n,{label:"数据库名："},{default:o(()=>[a(u,{modelValue:s(e).database,"onUpdate:modelValue":l[1]||(l[1]=t=>s(e).database=t),placeholder:"请输入数据库名"},null,8,["modelValue"])]),_:1}),a(n,{label:"用户名："},{default:o(()=>[a(u,{modelValue:s(e).userName,"onUpdate:modelValue":l[2]||(l[2]=t=>s(e).userName=t),placeholder:"请输入用户名"},null,8,["modelValue"])]),_:1}),a(n,{label:"数据库密码："},{default:o(()=>[a(u,{modelValue:s(e).password,"onUpdate:modelValue":l[3]||(l[3]=t=>s(e).password=t),placeholder:"请输入数据库密码","show-password":""},null,8,["modelValue"])]),_:1}),a(n,null,{default:o(()=>[a(c,{type:"primary",onClick:V},{default:o(()=>[i("取消")]),_:1}),a(c,{type:"primary",onClick:g},{default:o(()=>[i("登录")]),_:1})]),_:1})]),_:1},8,["model"])]),_:1})])}}},z=v(R,[["__scopeId","data-v-a9f13893"]]);export{z as default};