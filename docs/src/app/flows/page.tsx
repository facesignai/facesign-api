export const metadata = {
  title: 'Custom Flows',
  description: 'Create custom verification flows using the FaceSign node-based flow system for advanced verification scenarios.',
}

export default function CustomFlowsPage() {
  return (
    <div className="prose max-w-4xl mx-auto p-8">
      <h1>Custom Flows</h1>
      
      <div className="lead text-lg mb-8">
        Build sophisticated verification experiences with FaceSign&apos;s node-based flow system. 
        Create conditional verification paths, implement complex business logic, and design 
        user experiences that adapt to different scenarios.
      </div>

      <h2>Overview</h2>
      
      <p>
        While the verification modules provide a simple way to configure common verification patterns, 
        custom flows give you complete control over the verification process. Flows are built using 
        a node-graph system where:
      </p>
      
      <ul>
        <li><strong>Nodes</strong> define verification steps and actions</li>
        <li><strong>Edges</strong> define the connections between nodes</li>
        <li><strong>Outcomes</strong> determine which path to take based on results</li>
      </ul>

      <h2>Flow Structure</h2>
      
      <p>A flow consists of two main components:</p>
      
      <h3>Nodes Array</h3>
      <p>
        Each node represents a step in your verification process. Nodes have specific types 
        and configurations that determine what happens at that step.
      </p>
      
      <h3>Edges Array</h3>
      <p>
        Edges connect nodes together, defining the possible paths through your flow based 
        on outcomes and conditions.
      </p>

      <h2>Available Node Types</h2>
      
      <p>FaceSign supports 11 different node types for building flows:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <div className="border rounded p-4">
          <h4 className="font-semibold">START</h4>
          <p className="text-sm text-gray-600">Entry point for the flow</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">END</h4>
          <p className="text-sm text-gray-600">Exit point for the flow</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">CONVERSATION</h4>
          <p className="text-sm text-gray-600">AI-powered conversational interactions</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">LIVENESS_DETECTION</h4>
          <p className="text-sm text-gray-600">Detect if user is real person</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">ENTER_EMAIL</h4>
          <p className="text-sm text-gray-600">Collect email address from user</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">DATA_VALIDATION</h4>
          <p className="text-sm text-gray-600">Validate and process data</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">DOCUMENT_SCAN</h4>
          <p className="text-sm text-gray-600">Scan and extract document data</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">RECOGNITION</h4>
          <p className="text-sm text-gray-600">Facial recognition against database</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">FACE_SCAN</h4>
          <p className="text-sm text-gray-600">Capture and analyze face images</p>
        </div>
        <div className="border rounded p-4">
          <h4 className="font-semibold">TWO_FACTOR</h4>
          <p className="text-sm text-gray-600">Two-factor authentication via SMS/email</p>
        </div>
      </div>

      <h2>Basic Flow Example</h2>
      
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        <code>{`const basicFlow = {
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
}`}</code>
      </pre>

      <h2>Using Custom Flows</h2>
      
      <p>Include your custom flow in the session creation request:</p>
      
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        <code>{`const session = await client.sessions.create({
  clientReferenceId: 'user-123',
  metadata: { userId: '123' },
  flow: myCustomFlow,
  // Don't include modules when using custom flows
})`}</code>
      </pre>

      <h2>Best Practices</h2>
      
      <ul>
        <li>Always start with a START node and end with an END node</li>
        <li>Ensure all possible outcome paths are connected</li>
        <li>Test flows thoroughly with different scenarios</li>
        <li>Use meaningful node IDs for easier debugging</li>
        <li>Consider user experience when designing conditional paths</li>
      </ul>
    </div>
  )
}