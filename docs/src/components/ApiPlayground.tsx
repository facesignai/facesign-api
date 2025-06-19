'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

interface ApiPlaygroundProps {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  schema?: Record<string, any>
  requiresAuth?: boolean
  examples?: Record<string, string>
}

interface ApiResponse {
  status: number
  data: any
  headers: Record<string, string>
  duration: number
}

function JsonEditor({ 
  value, 
  onChange, 
  placeholder = "Enter JSON here..." 
}: { 
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [isValid, setIsValid] = useState(true)
  
  const handleChange = (newValue: string) => {
    onChange(newValue)
    
    // Validate JSON
    if (newValue.trim()) {
      try {
        JSON.parse(newValue)
        setIsValid(true)
      } catch {
        setIsValid(false)
      }
    } else {
      setIsValid(true)
    }
  }
  
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'block w-full rounded-lg border px-3 py-2 font-mono text-sm',
          'focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500',
          isValid 
            ? 'border-zinc-300 dark:border-zinc-600' 
            : 'border-red-300 dark:border-red-600',
          'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
        )}
        rows={8}
      />
      {!isValid && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          Invalid JSON format
        </p>
      )}
    </div>
  )
}

function ResponseViewer({ response }: { response: ApiResponse | null }) {
  if (!response) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Make a request to see the response
        </p>
      </div>
    )
  }
  
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400'
    if (status >= 400 && status < 500) return 'text-red-600 dark:text-red-400'
    if (status >= 500) return 'text-red-600 dark:text-red-400'
    return 'text-zinc-600 dark:text-zinc-400'
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <span className={clsx('font-semibold', getStatusColor(response.status))}>
          {response.status}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {response.duration}ms
        </span>
      </div>
      
      <div>
        <h4 className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Response Body
        </h4>
        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950">
          <code>{JSON.stringify(response.data, null, 2)}</code>
        </pre>
      </div>
      
      <div>
        <h4 className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Response Headers
        </h4>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
          {Object.entries(response.headers).map(([key, value]) => (
            <div 
              key={key} 
              className="flex border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
            >
              <div className="w-1/3 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {key}
              </div>
              <div className="flex-1 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CodeExamples({ endpoint, method, requestBody }: { 
  endpoint: string
  method: string
  requestBody: string 
}) {
  const generateCurlExample = () => {
    const baseCommand = `curl -X ${method} https://api.facesign.ai${endpoint}`
    const headers = [
      `-H "Authorization: Bearer YOUR_API_KEY"`,
      `-H "Content-Type: application/json"`
    ]
    
    let command = `${baseCommand} \\\n  ${headers.join(' \\\n  ')}`
    
    if (requestBody.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      command += ` \\\n  -d '${requestBody}'`
    }
    
    return command
  }
  
  const generateTypeScriptExample = () => {
    const bodyParam = requestBody.trim() && ['POST', 'PUT', 'PATCH'].includes(method) 
      ? `,\n  ${requestBody}` 
      : ''
    
    return `const response = await fetch('https://api.facesign.ai${endpoint}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }${bodyParam}
})

const data = await response.json()
console.log(data)`
  }
  
  const examples = {
    curl: generateCurlExample(),
    typescript: generateTypeScriptExample()
  }
  
  return (
    <div className="space-y-4">
      <TabGroup>
        <TabList className="flex space-x-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          {Object.keys(examples).map((language) => (
            <Tab
              key={language}
              className={({ selected }) =>
                clsx(
                  'w-full rounded-md py-2 px-3 text-sm font-medium leading-5 transition-all',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white'
                    : 'text-zinc-600 hover:bg-white/[0.12] hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                )
              }
            >
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </Tab>
          ))}
        </TabList>
        
        <TabPanels className="mt-4">
          {Object.entries(examples).map(([language, code]) => (
            <TabPanel key={language} className="focus:outline-none">
              <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950">
                <code>{code}</code>
              </pre>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export function ApiPlayground({ 
  endpoint, 
  method, 
  schema: _schema, 
  requiresAuth = true,
  examples = {}
}: ApiPlaygroundProps) {
  const [apiKey, setApiKey] = useState('')
  const [requestBody, setRequestBody] = useState(JSON.stringify(examples, null, 2) || '')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSendRequest = async () => {
    if (requiresAuth && !apiKey) {
      setError('API key is required')
      return
    }
    
    setLoading(true)
    setError(null)
    
    const startTime = Date.now()
    
    try {
      // For demo purposes, we'll simulate API responses
      // In a real implementation, you'd make actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      const duration = Date.now() - startTime
      
      // Simulate different responses based on endpoint
      let mockResponse
      if (endpoint.includes('sessions')) {
        mockResponse = {
          status: 201,
          data: {
            id: "vs_1a2b3c4d5e6f",
            clientSecret: "vs_1a2b3c4d5e6f_secret_abc123def456",
            createdAt: 1640995200,
            status: "requiresInput",
            settings: JSON.parse(requestBody || '{}'),
            version: "2024-12-18"
          },
          headers: {
            'content-type': 'application/json',
            'x-request-id': 'req_' + Math.random().toString(36).substr(2, 9)
          },
          duration
        }
      } else {
        mockResponse = {
          status: 200,
          data: { message: 'Success', timestamp: Date.now() },
          headers: {
            'content-type': 'application/json',
            'x-request-id': 'req_' + Math.random().toString(36).substr(2, 9)
          },
          duration
        }
      }
      
      setResponse(mockResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="my-8 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <TabGroup>
        <TabList className="flex border-b border-zinc-200 dark:border-zinc-700">
          <Tab className={({ selected }) =>
            clsx(
              'px-4 py-2 text-sm font-medium',
              selected 
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            )
          }>
            Request
          </Tab>
          <Tab className={({ selected }) =>
            clsx(
              'px-4 py-2 text-sm font-medium',
              selected 
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            )
          }>
            Response
          </Tab>
          <Tab className={({ selected }) =>
            clsx(
              'px-4 py-2 text-sm font-medium',
              selected 
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            )
          }>
            Code Examples
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel className="p-6">
            <div className="space-y-6">
              {requiresAuth && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_test_..."
                    className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
              )}
              
              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Request Body
                  </label>
                  <div className="mt-1">
                    <JsonEditor 
                      value={requestBody}
                      onChange={setRequestBody}
                      placeholder="Enter request body JSON..."
                    />
                  </div>
                </div>
              )}
              
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}
              
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className={clsx(
                  'inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                  loading
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
                )}
              >
                {loading ? 'Sending...' : `Send ${method} Request`}
              </button>
            </div>
          </TabPanel>
          
          <TabPanel className="p-6">
            <ResponseViewer response={response} />
          </TabPanel>
          
          <TabPanel className="p-6">
            <CodeExamples 
              endpoint={endpoint}
              method={method}
              requestBody={requestBody}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}