"use strict";exports.id=5090,exports.ids=[5090],exports.modules={5090:(e,s,o)=>{o.r(s),o.d(s,{default:()=>n,metadata:()=>i});var r=o(9510);let i={title:"Session Customization",description:"Customize the FaceSign verification experience with branding, UI controls, and user experience settings."};function n(){return(0,r.jsxs)("div",{className:"prose max-w-4xl mx-auto p-8",children:[r.jsx("h1",{children:"Session Customization"}),r.jsx("div",{className:"lead text-lg mb-8",children:"Tailor the FaceSign verification experience to match your brand and user experience requirements. Customize colors, fonts, messaging, and UI behavior to create a seamless integration."}),r.jsx("h2",{children:"Overview"}),r.jsx("p",{children:"Session customization allows you to control various aspects of the verification interface to match your application's look and feel. Customizations are applied when creating a session and affect the entire user journey."}),r.jsx("h2",{children:"Customization Options"}),r.jsx("h3",{children:"Branding"}),r.jsx("p",{children:"Customize the visual appearance to match your brand:"}),(0,r.jsxs)("ul",{children:[(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Primary Color"})," - Main brand color used for buttons and highlights"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Secondary Color"})," - Accent color for secondary elements"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Logo URL"})," - Your company logo displayed during verification"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Background Color"})," - Overall background color"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Text Color"})," - Primary text color"]})]}),r.jsx("h3",{children:"UI Controls"}),r.jsx("p",{children:"Control which UI elements are shown or hidden:"}),(0,r.jsxs)("ul",{children:[(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Show Progress Bar"})," - Display verification progress"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Show Skip Button"})," - Allow users to skip optional steps"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Show Help Button"})," - Display help/support options"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Allow Camera Switch"})," - Let users switch between cameras"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Show Torch Button"})," - Display flashlight toggle for document scanning"]})]}),r.jsx("h3",{children:"Messaging"}),r.jsx("p",{children:"Customize text and instructions shown to users:"}),(0,r.jsxs)("ul",{children:[(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Welcome Message"})," - Initial greeting text"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Completion Message"})," - Success message after verification"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Error Messages"})," - Custom error text for different scenarios"]}),(0,r.jsxs)("li",{children:[r.jsx("strong",{children:"Instruction Text"})," - Step-by-step guidance for users"]})]}),r.jsx("h2",{children:"Implementation"}),r.jsx("p",{children:"Include customization options when creating a session:"}),r.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:r.jsx("code",{children:`const session = await client.sessions.create({
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
})`})}),r.jsx("h2",{children:"Advanced Customization"}),r.jsx("h3",{children:"Custom CSS"}),r.jsx("p",{children:"For advanced styling, you can inject custom CSS:"}),r.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:r.jsx("code",{children:`customization: {
  css: \`
    .facesign-container {
      font-family: 'Your Custom Font', sans-serif;
      border-radius: 12px;
    }
    .facesign-button {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  \`
}`})}),r.jsx("h3",{children:"Responsive Design"}),r.jsx("p",{children:"Customize appearance for different screen sizes:"}),r.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:r.jsx("code",{children:`customization: {
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
}`})}),r.jsx("h2",{children:"Best Practices"}),(0,r.jsxs)("ul",{children:[r.jsx("li",{children:"Test customizations on different devices and browsers"}),r.jsx("li",{children:"Ensure sufficient color contrast for accessibility"}),r.jsx("li",{children:"Keep custom messages clear and actionable"}),r.jsx("li",{children:"Use high-quality logos and images"}),r.jsx("li",{children:"Consider your brand guidelines when choosing colors"}),r.jsx("li",{children:"Test with users to ensure the customized experience is intuitive"})]}),r.jsx("h2",{children:"Examples"}),r.jsx("h3",{children:"Minimal Branding"}),r.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:r.jsx("code",{children:`customization: {
  branding: {
    primaryColor: '#2563eb',
    logoUrl: 'https://example.com/logo.svg'
  }
}`})}),r.jsx("h3",{children:"Full Customization"}),r.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:r.jsx("code",{children:`customization: {
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
}`})})]})}}};