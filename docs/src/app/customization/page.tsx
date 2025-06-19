export const metadata = {
  title: 'Session Customization',
  description: 'Customize the FaceSign verification experience with branding, UI controls, and user experience settings.',
}

export default function CustomizationPage() {
  return (
    <div className="prose max-w-4xl mx-auto p-8">
      <h1>Session Customization</h1>
      
      <div className="lead text-lg mb-8">
        Tailor the FaceSign verification experience to match your brand and user experience requirements. 
        Customize colors, fonts, messaging, and UI behavior to create a seamless integration.
      </div>

      <h2>Overview</h2>
      
      <p>
        Session customization allows you to control various aspects of the verification interface 
        to match your application&apos;s look and feel. Customizations are applied when creating a session 
        and affect the entire user journey.
      </p>

      <h2>Customization Options</h2>
      
      <h3>Branding</h3>
      <p>Customize the visual appearance to match your brand:</p>
      
      <ul>
        <li><strong>Primary Color</strong> - Main brand color used for buttons and highlights</li>
        <li><strong>Secondary Color</strong> - Accent color for secondary elements</li>
        <li><strong>Logo URL</strong> - Your company logo displayed during verification</li>
        <li><strong>Background Color</strong> - Overall background color</li>
        <li><strong>Text Color</strong> - Primary text color</li>
      </ul>

      <h3>UI Controls</h3>
      <p>Control which UI elements are shown or hidden:</p>
      
      <ul>
        <li><strong>Show Progress Bar</strong> - Display verification progress</li>
        <li><strong>Show Skip Button</strong> - Allow users to skip optional steps</li>
        <li><strong>Show Help Button</strong> - Display help/support options</li>
        <li><strong>Allow Camera Switch</strong> - Let users switch between cameras</li>
        <li><strong>Show Torch Button</strong> - Display flashlight toggle for document scanning</li>
      </ul>

      <h3>Messaging</h3>
      <p>Customize text and instructions shown to users:</p>
      
      <ul>
        <li><strong>Welcome Message</strong> - Initial greeting text</li>
        <li><strong>Completion Message</strong> - Success message after verification</li>
        <li><strong>Error Messages</strong> - Custom error text for different scenarios</li>
        <li><strong>Instruction Text</strong> - Step-by-step guidance for users</li>
      </ul>

      <h2>Implementation</h2>
      
      <p>Include customization options when creating a session:</p>
      
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        <code>{`const session = await client.sessions.create({
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
})`}</code>
      </pre>

      <h2>Advanced Customization</h2>
      
      <h3>Custom CSS</h3>
      <p>For advanced styling, you can inject custom CSS:</p>
      
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        <code>{`customization: {
  css: \`
    .facesign-container {
      font-family: 'Your Custom Font', sans-serif;
      border-radius: 12px;
    }
    .facesign-button {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  \`
}`}</code>
      </pre>

      <h3>Responsive Design</h3>
      <p>Customize appearance for different screen sizes:</p>
      
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        <code>{`customization: {
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
}`}</code>
      </pre>

      <h2>Best Practices</h2>
      
      <ul>
        <li>Test customizations on different devices and browsers</li>
        <li>Ensure sufficient color contrast for accessibility</li>
        <li>Keep custom messages clear and actionable</li>
        <li>Use high-quality logos and images</li>
        <li>Consider your brand guidelines when choosing colors</li>
        <li>Test with users to ensure the customized experience is intuitive</li>
      </ul>

      <h2>Examples</h2>
      
      <h3>Minimal Branding</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        <code>{`customization: {
  branding: {
    primaryColor: '#2563eb',
    logoUrl: 'https://example.com/logo.svg'
  }
}`}</code>
      </pre>

      <h3>Full Customization</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        <code>{`customization: {
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
}`}</code>
      </pre>
    </div>
  )
}