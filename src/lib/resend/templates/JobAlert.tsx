import { Html, Head, Body, Container, Section, Text, Button, Hr } from '@react-email/components'

interface JobAlertProps {
  jobTitle: string
  company: string
  location: string
  jobUrl: string
}

export function JobAlert({ jobTitle, company, location, jobUrl }: JobAlertProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0f', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' }}>HamedProDev</Text>
          <Section style={{ padding: '20px 0' }}>
            <Text style={{ fontSize: '18px', color: '#f8fafc' }}>New Job Alert! 🔔</Text>
            <Text style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
              A new job matching your interests has been posted:
            </Text>
            <Text style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 'bold' }}>{jobTitle}</Text>
            <Text style={{ fontSize: '14px', color: '#94a3b8' }}>{company} — {location}</Text>
          </Section>
          <Section style={{ textAlign: 'center', padding: '20px 0' }}>
            <Button href={jobUrl} style={{ backgroundColor: '#6366f1', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              View Job
            </Button>
          </Section>
          <Hr style={{ borderColor: '#252550' }} />
          <Text style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            Unsubscribe from job alerts in your dashboard settings.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
