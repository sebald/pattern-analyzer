import { Container, Link, Title } from 'components';

const About = () => (
  <main className="pt-10 pb-6 md:pt-16">
    <Container size="narrow">
      <Title>About</Title>

      <h2 className="prose mt-16 mb-4 text-2xl font-bold">Why!?</h2>

      <p className="prose mb-8 text-lg text-secondary-900">
        The X-Wing community has already built some amazing tools to study and
        analyze tournament data. Examples of these are sites like{' '}
        <Link href="https://meta.listfortress.com/">listfortress</Link>,{' '}
        <Link href="https://www.pinksquadron.dk/pbm/">PBM</Link>, and{' '}
        <Link href="http://advancedtargeting.computer/">
          advancedtargetingcomputer.
        </Link>{' '}
        These are great tools for gaining deep insight into a tournament after
        it has finished, but they require the data to be exported from the
        tournament page and manually uploaded.
      </p>
      <p className="prose mb-8 text-lg text-secondary-900">
        Furthermore, with the sunsetting of TTO and the switch to Longshank, it
        has become harder to scan through an ongoing tournament. And, as far as
        I know, there is currently no way to export the tournament data from
        Longshank. Don’t get me wrong the, I am very thankful that we have this
        tool and it is great for organizing tournaments, but it can be
        cumbersome to click through the participants or teams to get to the
        lists, which are not always displayed in a readable form.
      </p>

      <p className="prose mb-8 text-lg text-secondary-900">
        <strong>TL;DR</strong> I&apos;m very lazy and want to quickly scan
        through ongoing tournaments. Since the data is gathered automatically,
        it&apos;s possible to do some additional statistical analysis. Pattern
        Analyzer is not a replacement for other tools; it&apos;s just another
        tool for the X-Wing community!
      </p>

      <h2 className="prose mt-16 mb-4 text-2xl font-bold">
        How does it work!?
      </h2>

      <p className="prose mb-8 text-lg text-secondary-900">
        Pattern Analyzer crawls Longshank for the &quot;data&quot;. It&apos;s
        not structure data, but rather the same website you are seeing when
        visiting an event page. Pattern Analyzer goes through the source code
        and extracts information. Currently, it is looking for player names and
        their lists, which are given as plain text. If this text contains a link
        to <Link href="https://yasb.app/">YASB</Link>, it can be converted to
        the{' '}
        <Link href="https://github.com/elistevens/xws-spec">XWS format</Link>.
        This standard, established by the X-Wing community, is then used to
        generate and display squads in a comprehensible form and also create
        some statistics.
      </p>
    </Container>
  </main>
);

export default About;
