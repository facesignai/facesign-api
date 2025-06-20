'use client'

import { RedocStandalone } from 'redoc'

export function ApiReferenceClient() {
  return (
    <div className="min-h-screen w-full">
      <RedocStandalone
        specUrl="/openapi.yaml"
        options={{
          scrollYOffset: 60,
          hideDownloadButton: false,
          hideLoading: false,
          hideSchemaPattern: false,
          expandResponses: '200,201',
          jsonSampleExpandLevel: 2,
          hideSingleRequestSampleTab: true,
          theme: {
            colors: {
              primary: {
                main: '#10b981'
              },
              success: {
                main: '#059669'
              }
            },
            typography: {
              fontSize: '14px',
              lineHeight: '1.5em',
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              headings: {
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                fontWeight: '600'
              }
            },
            sidebar: {
              width: '300px',
              backgroundColor: '#f9fafb',
              textColor: '#374151'
            },
            rightPanel: {
              backgroundColor: '#1f2937',
              width: '40%'
            }
          }
        }}
      />
    </div>
  )
}