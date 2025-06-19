"use strict";exports.id=4914,exports.ids=[4914],exports.modules={4914:(e,s,n)=>{n.r(s),n.d(s,{default:()=>d,metadata:()=>t});var i=n(9510);let t={title:"Custom Flows",description:"Create custom verification flows using the FaceSign node-based flow system for advanced verification scenarios."};function d(){return(0,i.jsxs)("div",{className:"prose max-w-4xl mx-auto p-8",children:[i.jsx("h1",{children:"Custom Flows"}),i.jsx("div",{className:"lead text-lg mb-8",children:"Build sophisticated verification experiences with FaceSign's node-based flow system. Create conditional verification paths, implement complex business logic, and design user experiences that adapt to different scenarios."}),i.jsx("h2",{children:"Overview"}),i.jsx("p",{children:"While the verification modules provide a simple way to configure common verification patterns, custom flows give you complete control over the verification process. Flows are built using a node-graph system where:"}),(0,i.jsxs)("ul",{children:[(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Nodes"})," define verification steps and actions"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Edges"})," define the connections between nodes"]}),(0,i.jsxs)("li",{children:[i.jsx("strong",{children:"Outcomes"})," determine which path to take based on results"]})]}),i.jsx("h2",{children:"Flow Structure"}),i.jsx("p",{children:"A flow consists of two main components:"}),i.jsx("h3",{children:"Nodes Array"}),i.jsx("p",{children:"Each node represents a step in your verification process. Nodes have specific types and configurations that determine what happens at that step."}),i.jsx("h3",{children:"Edges Array"}),i.jsx("p",{children:"Edges connect nodes together, defining the possible paths through your flow based on outcomes and conditions."}),i.jsx("h2",{children:"Available Node Types"}),i.jsx("p",{children:"FaceSign supports 11 different node types for building flows:"}),(0,i.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 my-8",children:[(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"START"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Entry point for the flow"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"END"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Exit point for the flow"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"CONVERSATION"}),i.jsx("p",{className:"text-sm text-gray-600",children:"AI-powered conversational interactions"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"LIVENESS_DETECTION"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Detect if user is real person"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"ENTER_EMAIL"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Collect email address from user"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"DATA_VALIDATION"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Validate and process data"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"DOCUMENT_SCAN"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Scan and extract document data"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"RECOGNITION"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Facial recognition against database"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"FACE_SCAN"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Capture and analyze face images"})]}),(0,i.jsxs)("div",{className:"border rounded p-4",children:[i.jsx("h4",{className:"font-semibold",children:"TWO_FACTOR"}),i.jsx("p",{className:"text-sm text-gray-600",children:"Two-factor authentication via SMS/email"})]})]}),i.jsx("h2",{children:"Basic Flow Example"}),i.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:i.jsx("code",{children:`const basicFlow = {
  nodes: [
    { id: 'start', type: 'start' },
    { 
      id: 'liveness', 
      type: 'liveness_detection',
      outcomes: {
        livenessDetected: 'document',
        deepfakeDetected: 'end',
        noFace: 'end'
      }
    },
    {
      id: 'document',
      type: 'document_scan',
      scanningMode: 'SINGLE_SIDE',
      allowedDocumentTypes: ['MRTD_TYPE_PASSPORT'],
      outcomes: {
        scanSuccess: 'end',
        userCancelled: 'end',
        scanTimeout: 'end'
      }
    },
    { id: 'end', type: 'end' }
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'liveness' },
    { id: 'e2', source: 'liveness', target: 'document' },
    { id: 'e3', source: 'liveness', target: 'end' },
    { id: 'e4', source: 'document', target: 'end' }
  ]
}`})}),i.jsx("h2",{children:"Using Custom Flows"}),i.jsx("p",{children:"Include your custom flow in the session creation request:"}),i.jsx("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:i.jsx("code",{children:`const session = await client.sessions.create({
  clientReferenceId: 'user-123',
  metadata: { userId: '123' },
  flow: myCustomFlow,
  // Don't include modules when using custom flows
})`})}),i.jsx("h2",{children:"Best Practices"}),(0,i.jsxs)("ul",{children:[i.jsx("li",{children:"Always start with a START node and end with an END node"}),i.jsx("li",{children:"Ensure all possible outcome paths are connected"}),i.jsx("li",{children:"Test flows thoroughly with different scenarios"}),i.jsx("li",{children:"Use meaningful node IDs for easier debugging"}),i.jsx("li",{children:"Consider user experience when designing conditional paths"})]})]})}}};