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
              fontSize: '15px',
              lineHeight: '1.6em',
              fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              headings: {
                fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                fontWeight: '600'
              }
            },
            sidebar: {
              width: '288px',
              backgroundColor: '#ffffff',
              textColor: '#111827'
            },
            rightPanel: {
              backgroundColor: '#1f2937',
              width: '42%'
            }
          }
        }}
      />
    </div>
  )
}