(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c460990c"],{6612:function(e,t,n){"use strict";n("ae57")},ae57:function(e,t,n){},ef2e:function(e,t,n){"use strict";n.r(t);var a=n("7a23"),r=function(e){return Object(a["v"])("data-v-d18a63f2"),e=e(),Object(a["t"])(),e},c={class:"post-wrap"},o=r((function(){return Object(a["g"])("h3",{class:"title py-3 border bg-white text-center mb-4"},"張貼動態",-1)})),i={class:"rounded-card card"},s={class:"card-body p-4"},d={class:"mb-3"},u=r((function(){return Object(a["g"])("label",{for:"content",class:"form-label"},"貼文內容",-1)})),l={class:"mb-3"},b=r((function(){return Object(a["g"])("label",{for:"upload-file",class:"btn form-label bg-black text-white shadow-none py-1 mb-0"},"上傳圖片",-1)})),f={class:"image-wrap border rounded overflow-hidden"},p=["src"],g={key:0,class:"text-danger text-center d-block mt-3"},m={class:"submit-btn-wrap mx-auto"},h=["disabled"],O={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},j=Object(a["h"])(" 送出貼文 ");function v(e,t,n,r,v,w){return Object(a["s"])(),Object(a["f"])("div",c,[o,Object(a["g"])("div",i,[Object(a["g"])("div",s,[Object(a["g"])("div",d,[u,Object(a["K"])(Object(a["g"])("textarea",{class:"form-control rounded-0",rows:"3",id:"content",placeholder:"輸入您的貼文內容","onUpdate:modelValue":t[0]||(t[0]=function(e){return v.info.content=e})},null,512),[[a["G"],v.info.content]])]),Object(a["g"])("div",l,[b,Object(a["g"])("input",{class:"form-control d-none",type:"file",id:"upload-file",accept:"image/png, image/jpeg",ref:"upload-file",onChange:t[1]||(t[1]=function(e){return w.getPreviewFile()})},null,544)]),Object(a["K"])(Object(a["g"])("div",f,[Object(a["g"])("img",{src:v.imagePreview,class:"w-100"},null,8,p)],512),[[a["H"],v.imagePreview]]),v.errorMessage?(Object(a["s"])(),Object(a["f"])("div",g,[Object(a["g"])("small",null,Object(a["C"])(v.errorMessage),1)])):Object(a["e"])("",!0),Object(a["g"])("div",m,[Object(a["g"])("button",{type:"button",class:"btn btn-secondary w-100 mt-3",disabled:!v.info.content||v.isLoading,onClick:t[2]||(t[2]=function(e){return w.submitPost()})},[v.isLoading?(Object(a["s"])(),Object(a["f"])("span",O)):Object(a["e"])("",!0),j],8,h)])])])])}var w=n("1da1"),k=n("5530"),P=(n("96cf"),n("d3b7"),n("3ca3"),n("ddb0"),n("2b3d"),n("9861"),n("5502")),x={name:"AddPost",data:function(){return{info:{content:"",image:""},imagePreview:"",errorMessage:"",isLoading:!1}},computed:Object(k["a"])({},Object(P["c"])({token:function(e){return e.token}})),mounted:function(){},methods:{getPreviewFile:function(){var e=this.$refs["upload-file"];this.imagePreview=URL.createObjectURL(e.files[0])},uploadFile:function(){var e=this;return new Promise((function(t,n){var a=e.$refs["upload-file"],r=new FormData;r.append("image",a.files[0]),a.files=(new DataTransfer).files;var c={method:"POST",url:"".concat("https://peaceful-citadel-43202.herokuapp.com","/api/v1/file"),headers:{authorization:"Bearer ".concat(e.token)},data:r};e.$http(c).then((function(n){e.info.image=n.data.data,t()}))["catch"]((function(e){n(e.response.data.message)}))}))},uploadPost:function(){var e=this;return new Promise((function(t,n){var a={method:"POST",url:"".concat("https://peaceful-citadel-43202.herokuapp.com","/api/v1/post"),headers:{authorization:"Bearer ".concat(e.token)},data:e.info};e.$http(a).then((function(n){e.$router.push({name:"Home"}),t(n.data.data)}))["catch"]((function(e){n(e.response.data.message)}))}))},submitPost:function(){var e=this;return Object(w["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(t.prev=0,e.isLoading=!0,!e.imagePreview){t.next=5;break}return t.next=5,e.uploadFile();case 5:return t.next=7,e.uploadPost();case 7:e.isLoading=!1,t.next=14;break;case 10:t.prev=10,t.t0=t["catch"](0),e.errorMessage=t.t0,e.isLoading=!1;case 14:case"end":return t.stop()}}),t,null,[[0,10]])})))()}}},y=(n("6612"),n("6b0d")),L=n.n(y);const F=L()(x,[["render",v],["__scopeId","data-v-d18a63f2"]]);t["default"]=F}}]);
//# sourceMappingURL=chunk-c460990c.65fb5d1e.js.map