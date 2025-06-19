(()=>{var e={};e.id=2594,e.ids=[2594,5090],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},6162:e=>{"use strict";e.exports=require("stream")},7360:e=>{"use strict";e.exports=require("url")},1764:e=>{"use strict";e.exports=require("util")},2623:e=>{"use strict";e.exports=require("worker_threads")},3537:(e,s,r)=>{"use strict";r.r(s),r.d(s,{GlobalError:()=>n.a,__next_app__:()=>h,originalPathname:()=>u,pages:()=>d,routeModule:()=>p,tree:()=>c}),r(5090),r(412),r(2523);var i=r(3191),o=r(8716),t=r(7922),n=r.n(t),a=r(5231),l={};for(let e in a)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);r.d(s,l);let c=["",{children:["customization",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,5090)),"/Users/davidgonen/Github/facesign-all/facesign-api/docs/src/app/customization/page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,9873))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,412)),"/Users/davidgonen/Github/facesign-all/facesign-api/docs/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.bind(r,2523)),"/Users/davidgonen/Github/facesign-all/facesign-api/docs/src/app/not-found.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,9873))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["/Users/davidgonen/Github/facesign-all/facesign-api/docs/src/app/customization/page.tsx"],u="/customization/page",h={require:r,loadChunk:()=>Promise.resolve()},p=new i.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/customization/page",pathname:"/customization",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},5303:()=>{},5090:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>t,metadata:()=>o});var i=r(9510);let o={title:"Session Customization",description:"Customize the FaceSign verification experience with branding, UI controls, and user experience settings."};function t(){return(0,i.jsxs)("div",{className:"prose max-w-4xl mx-auto p-8",children:[i.jsx("h1",{children:"Session Customization"}),i.jsx("div",{className:"lead text-lg mb-8",children:"Tailor the FaceSign verification experience to match your brand and user experience requirements. Customize colors, fonts, messaging, and UI behavior to create a seamless integration."}),i.jsx("h2",{children:"Overview"}),i.jsx("p",{children:"Session customization allows you to control various aspects of the verification interface to match your application's look and feel. Customizations are applied when creating a session and affect the entire user journey."}),i.jsx("h2",{children:"Customization Options"}),i.jsx("h3",{children:"Branding"}),i.jsx("p",{children:"Customize the visual appearance to match your brand:"}),(0,i.jsxs)("ul",{children:[(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Primary Color"})," - Main brand color used for buttons and highlights"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Secondary Color"})," - Accent color for secondary elements"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Logo URL"})," - Your company logo displayed during verification"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Background Color"})," - Overall background color"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Text Color"})," - Primary text color"]})]}),i.jsx("h3",{children:"UI Controls"}),i.jsx("p",{children:"Control which UI elements are shown or hidden:"}),(0,i.jsxs)("ul",{children:[(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Show Progress Bar"})," - Display verification progress"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Show Skip Button"})," - Allow users to skip optional steps"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Show Help Button"})," - Display help/support options"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Allow Camera Switch"})," - Let users switch between cameras"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Show Torch Button"})," - Display flashlight toggle for document scanning"]})]}),i.jsx("h3",{children:"Messaging"}),i.jsx("p",{children:"Customize text and instructions shown to users:"}),(0,i.jsxs)("ul",{children:[(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Welcome Message"})," - Initial greeting text"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Completion Message"})," - Success message after verification"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Error Messages"})," - Custom error text for different scenarios"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Instruction Text"})," - Step-by-step guidance for users"]})]}),i.jsx("h2",{children:"Implementation"}),i.jsx("p",{children:"Include customization options when creating a session:"}),i.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:i.jsx("code",{children:`const session = await client.sessions.create({
  clientReferenceId: 'user-123',
  metadata: { userId: '123' },
  modules: [
    { type: 'identityVerification' },
    { type: 'documentAuthentication' }
  ],
  customization: {
    branding: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      logoUrl: 'https://your-domain.com/logo.png',
      backgroundColor: '#ffffff',
      textColor: '#333333'
    },
    ui: {
      showProgressBar: true,
      showSkipButton: false,
      showHelpButton: true,
      allowCameraSwitch: true,
      showTorchButton: true
    },
    messaging: {
      welcomeMessage: 'Welcome to our secure verification process',
      completionMessage: 'Verification completed successfully!',
      errorMessages: {
        cameraPermission: 'Please allow camera access to continue',
        networkError: 'Connection error. Please check your internet.'
      }
    }
  }
})`})}),i.jsx("h2",{children:"Advanced Customization"}),i.jsx("h3",{children:"Custom CSS"}),i.jsx("p",{children:"For advanced styling, you can inject custom CSS:"}),i.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:i.jsx("code",{children:`customization: {
  css: \`
    .facesign-container {
      font-family: 'Your Custom Font', sans-serif;
      border-radius: 12px;
    }
    .facesign-button {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  \`
}`})}),i.jsx("h3",{children:"Responsive Design"}),i.jsx("p",{children:"Customize appearance for different screen sizes:"}),i.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:i.jsx("code",{children:`customization: {
  responsive: {
    mobile: {
      fontSize: '14px',
      padding: '16px'
    },
    desktop: {
      fontSize: '16px',
      padding: '24px'
    }
  }
}`})}),i.jsx("h2",{children:"Best Practices"}),(0,i.jsxs)("ul",{children:[i.jsx("li",{children:"Test customizations on different devices and browsers"}),i.jsx("li",{children:"Ensure sufficient color contrast for accessibility"}),i.jsx("li",{children:"Keep custom messages clear and actionable"}),i.jsx("li",{children:"Use high-quality logos and images"}),i.jsx("li",{children:"Consider your brand guidelines when choosing colors"}),i.jsx("li",{children:"Test with users to ensure the customized experience is intuitive"})]}),i.jsx("h2",{children:"Examples"}),i.jsx("h3",{children:"Minimal Branding"}),i.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:i.jsx("code",{children:`customization: {
  branding: {
    primaryColor: '#2563eb',
    logoUrl: 'https://example.com/logo.svg'
  }
}`})}),i.jsx("h3",{children:"Full Customization"}),i.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:i.jsx("code",{children:`customization: {
  branding: {
    primaryColor: '#059669',
    secondaryColor: '#d1fae5',
    logoUrl: 'https://example.com/logo.svg',
    backgroundColor: '#f9fafb',
    textColor: '#111827'
  },
  ui: {
    showProgressBar: true,
    showHelpButton: true,
    allowCameraSwitch: true
  },
  messaging: {
    welcomeMessage: 'Let\\'s verify your identity securely',
    completionMessage: 'All set! Your identity has been verified.'
  }
}`})})]})}}};var s=require("../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),i=s.X(0,[8948,7213,3525],()=>r(3537));module.exports=i})();