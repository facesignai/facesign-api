import '../styles/tailwind.css'

export const metadata = {
  title: 'FaceSign API Documentation',
  description: 'Complete API documentation for FaceSign identity verification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}