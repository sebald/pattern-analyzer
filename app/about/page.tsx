import { Container, Link, Title } from 'components';

const About = () => (
  <main className="p-4">
    <Container>
      <Title>About</Title>

      <p>
        The X-Wing community has already built some amazing tools to study and
        analyze tournament data. Examples of these are sites like{' '}
        <Link href="https://meta.listfortress.com/">listfortress</Link>,{' '}
        <Link href="https://www.pinksquadron.dk/pbm/">PBM</Link>, and
        advancedtargetingcomputer.com. These are great tools for gaining deep
        insight into a tournament after it has finished, but they require the
        data to be exported from the tournament page and manually uploaded.
      </p>
    </Container>
  </main>
);

export default About;
