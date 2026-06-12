import { Html, Head, Body, Container, Text, Hr } from '@react-email/components'

export function ContactConfirm({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0f', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' }}>HamedProDev</Text>
          <Text style={{ fontSize: '18px', color: '#f8fafc' }}>Thanks for reaching out, {name}!</Text>
          <Text style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
            I&apos;ve received your message and will get back to you within 24-48 hours. In the meantime, feel free to check out my latest projects and blog posts.
          </Text>
          <Hr style={{ borderColor: '#252550' }} />
          <Text style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>© 2024 HamedProDev</Text>
        </Container>
      </Body>
    </Html>
  )
}
