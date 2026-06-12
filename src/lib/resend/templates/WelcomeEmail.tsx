import { Html, Head, Body, Container, Section, Text, Button, Hr } from '@react-email/components'

interface WelcomeEmailProps {
  name: string
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0f', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1' }}>HamedProDev</Text>
          </Section>
          <Section style={{ padding: '20px 0' }}>
            <Text style={{ fontSize: '18px', color: '#f8fafc' }}>Welcome, {name}!</Text>
            <Text style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
              Thank you for joining the HamedProDev community. You now have access to free courses, job listings, and developer tools.
            </Text>
          </Section>
          <Section style={{ textAlign: 'center', padding: '20px 0' }}>
            <Button href="https://hamedpro.rw/dashboard" style={{ backgroundColor: '#6366f1', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              Go to Dashboard
            </Button>
          </Section>
          <Hr style={{ borderColor: '#252550' }} />
          <Text style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            © 2024 HamedProDev. Built with ❤️ in Kigali, Rwanda.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
