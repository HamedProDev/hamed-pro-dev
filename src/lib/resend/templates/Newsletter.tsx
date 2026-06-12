import { Html, Head, Body, Container, Text, Button, Hr } from '@react-email/components'

export function NewsletterEmail({ name, content }: { name: string; content: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0f', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' }}>HamedProDev Newsletter</Text>
          <Text style={{ fontSize: '18px', color: '#f8fafc' }}>Hello, {name}!</Text>
          <Text style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {content}
          </Text>
          <Hr style={{ borderColor: '#252550' }} />
          <Text style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            Unsubscribe at hamedpro.rw/newsletter
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
