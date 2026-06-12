import { Html, Head, Body, Container, Text, Button, Hr } from '@react-email/components'

export function CourseEnrolment({ name, courseName, courseUrl }: { name: string; courseName: string; courseUrl: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0f', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' }}>HamedProDev</Text>
          <Text style={{ fontSize: '18px', color: '#f8fafc' }}>You&apos;re enrolled! 🎓</Text>
          <Text style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
            Hi {name}, you&apos;ve successfully enrolled in <strong style={{ color: '#f8fafc' }}>{courseName}</strong>. Start learning right away!
          </Text>
          <Button href={courseUrl} style={{ backgroundColor: '#6366f1', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Start Course
          </Button>
          <Hr style={{ borderColor: '#252550' }} />
          <Text style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>© 2024 HamedProDev</Text>
        </Container>
      </Body>
    </Html>
  )
}
