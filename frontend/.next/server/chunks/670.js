"use strict";exports.id=670,exports.ids=[670],exports.modules={5015:(e,t,r)=>{r.d(t,{Z:()=>l});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,r(6661).Z)("Beaker",[["path",{d:"M4.5 3h15",key:"c7n0jr"}],["path",{d:"M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3",key:"m1uhx7"}],["path",{d:"M6 14h12",key:"4cwo0f"}]])},4064:(e,t,r)=>{r.d(t,{Z:()=>l});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,r(6661).Z)("Box",[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]])},6507:(e,t,r)=>{r.d(t,{Z:()=>l});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,r(6661).Z)("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]])},5374:(e,t,r)=>{r.d(t,{Z:()=>l});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,r(6661).Z)("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]])},800:(e,t,r)=>{r.d(t,{Z:()=>l});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,r(6661).Z)("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},2600:(e,t,r)=>{r.d(t,{Z:()=>l});/**
 * @license lucide-react v0.330.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,r(6661).Z)("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]])},5077:(e,t,r)=>{r.d(t,{i:()=>a});var l=r(9805),n=r(3327),s=r(90);function a({smiles:e,className:t,overlaySmiles:r}){let a=(0,n.useRef)(null),o=(0,n.useRef)(null),[d,i]=(0,n.useState)(!1),u=(0,n.useRef)(null);return(0,n.useEffect)(()=>{},[]),(0,n.useEffect)(()=>{if(!o.current||!d||!u.current)return;let t=u.current;if(!a.current){let e=t.createViewer(o.current,{backgroundColor:"rgba(0,0,0,0)"});a.current=e}let l=a.current;(async()=>{if(l.clear(),e)try{let t=await s.zG.get3DStructure(e);t&&t.sdf&&l.addModel(t.sdf,"sdf").setStyle({},{stick:{radius:.15,colorscheme:"Jmol"},sphere:{scale:.25}})}catch(e){console.error(e)}if(r)try{let e=await s.zG.get3DStructure(r);e&&e.sdf&&l.addModel(e.sdf,"sdf").setStyle({},{stick:{radius:.15,color:"#00FFFF",opacity:.7},sphere:{scale:.25,color:"#00FFFF",opacity:.7}})}catch(e){console.error(e)}l.zoomTo(),l.render()})()},[e,r,d]),l.jsx("div",{ref:o,className:`relative w-full h-full min-h-[300px] bg-transparent ${t}`,children:!d&&l.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:l.jsx("div",{className:"w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"})})})}},7594:(e,t,r)=>{r.d(t,{k:()=>l});let l=[{id:"your_model",name:"Your Model",description:"Custom trained model"},{id:"molt5",name:"MolT5",description:"Transformer for molecules"},{id:"chemberta",name:"ChemBERTa",description:"BERT-based chemistry model"}]},2832:(e,t,r)=>{r.d(t,{M:()=>k});var l=r(9805),n=r(3327),s=r(7277),a=r(6600),o=r(6094),d=r(547);class i extends n.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=this.props.sizeRef.current;e.height=t.offsetHeight||0,e.width=t.offsetWidth||0,e.top=t.offsetTop,e.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function u({children:e,isPresent:t}){let r=(0,n.useId)(),s=(0,n.useRef)(null),a=(0,n.useRef)({width:0,height:0,top:0,left:0}),{nonce:o}=(0,n.useContext)(d._);return(0,n.useInsertionEffect)(()=>{let{width:e,height:l,top:n,left:d}=a.current;if(t||!s.current||!e||!l)return;s.current.dataset.motionPopId=r;let i=document.createElement("style");return o&&(i.nonce=o),document.head.appendChild(i),i.sheet&&i.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${l}px !important;
            top: ${n}px !important;
            left: ${d}px !important;
          }
        `),()=>{document.head.removeChild(i)}},[t]),(0,l.jsx)(i,{isPresent:t,childRef:s,sizeRef:a,children:n.cloneElement(e,{ref:s})})}let c=({children:e,initial:t,isPresent:r,onExitComplete:s,custom:d,presenceAffectsLayout:i,mode:c})=>{let p=(0,a.h)(h),f=(0,n.useId)(),m=(0,n.useCallback)(e=>{for(let t of(p.set(e,!0),p.values()))if(!t)return;s&&s()},[p,s]),y=(0,n.useMemo)(()=>({id:f,initial:t,isPresent:r,custom:d,onExitComplete:m,register:e=>(p.set(e,!1),()=>p.delete(e))}),i?[Math.random(),m]:[r,m]);return(0,n.useMemo)(()=>{p.forEach((e,t)=>p.set(t,!1))},[r]),n.useEffect(()=>{r||p.size||!s||s()},[r]),"popLayout"===c&&(e=(0,l.jsx)(u,{isPresent:r,children:e})),(0,l.jsx)(o.O.Provider,{value:y,children:e})};function h(){return new Map}var p=r(8480);let f=e=>e.key||"";function m(e){let t=[];return n.Children.forEach(e,e=>{(0,n.isValidElement)(e)&&t.push(e)}),t}var y=r(3748);let k=({children:e,custom:t,initial:r=!0,onExitComplete:o,presenceAffectsLayout:d=!0,mode:i="sync",propagate:u=!1})=>{let[h,k]=(0,p.oO)(u),x=(0,n.useMemo)(()=>m(e),[e]),M=u&&!h?[]:x.map(f),v=(0,n.useRef)(!0),g=(0,n.useRef)(x),b=(0,a.h)(()=>new Map),[C,w]=(0,n.useState)(x),[E,R]=(0,n.useState)(x);(0,y.L)(()=>{v.current=!1,g.current=x;for(let e=0;e<E.length;e++){let t=f(E[e]);M.includes(t)?b.delete(t):!0!==b.get(t)&&b.set(t,!1)}},[E,M.length,M.join("-")]);let Z=[];if(x!==C){let e=[...x];for(let t=0;t<E.length;t++){let r=E[t],l=f(r);M.includes(l)||(e.splice(t,0,r),Z.push(r))}"wait"===i&&Z.length&&(e=Z),R(m(e)),w(x);return}let{forceRender:j}=(0,n.useContext)(s.p);return(0,l.jsx)(l.Fragment,{children:E.map(e=>{let n=f(e),s=(!u||!!h)&&(x===E||M.includes(n));return(0,l.jsx)(c,{isPresent:s,initial:(!v.current||!!r)&&void 0,custom:s?void 0:t,presenceAffectsLayout:d,mode:i,onExitComplete:s?void 0:()=>{if(!b.has(n))return;b.set(n,!0);let e=!0;b.forEach(t=>{t||(e=!1)}),e&&(null==j||j(),R(g.current),u&&(null==k||k()),o&&o())},children:e},n)})})}}};