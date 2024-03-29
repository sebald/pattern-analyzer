import { createMetadata } from '@/lib/metadata';
import { Headline, Link, List, Text, Title } from '@/ui';

export const metadata = createMetadata({ title: 'About' });

const About = () => (
  <div className="mx-auto text-secondary-900">
    <Title>About</Title>
    <Headline level="2" className="pt-14">
      About Pattern Analyzer
    </Headline>
    <Text size="large" prose>
      The X-Wing community has already built some amazing tools to study and
      analyze tournament data. Examples of these are sites like{' '}
      <Link href="https://meta.listfortress.com/">MetaWing</Link>,{' '}
      <Link href="https://www.pinksquadron.dk/pbm/">PBM</Link>, and{' '}
      <Link href="http://advancedtargeting.computer/">
        Advanced Targeting Computer
      </Link>
      .
    </Text>
    <Text size="large" prose>
      These are great tools for gaining deep insight into a tournament after it
      has finished, but they require the data to be exported from the tournament
      page and uploaded to Listfortress. However, with the sunsetting of TTO and
      the switch to Longshanks, there is currently no way to export the
      tournament data from Longshanks. This means a chunk of the tournament data
      is missing from Listfortress.
    </Text>
    <Text size="large" prose>
      Pattern Analyzer tries to fill this gap by obtaining data directly from
      Longshanks (and other vendors) and allowing people to discover what squads
      are played and gain some additional insights into an X-Wing tournament
      while it is still in progress. And since Pattern Analyzer acquires all
      this data anyway, it can also provide an export for Listforstress, so that
      it stays up to date and other tools like MetaWing and PBM have information
      to consume.
    </Text>

    <Headline level="2" className="pt-10" id="about-the-data">
      About the Data
    </Headline>

    <Headline level="4">What is the “unknown” faction?</Headline>
    <Text size="large" prose>
      Some squad lists may have been entered in a format that can not be
      analyzed by Pattern Analyzer and will be not considered in most of the
      statistics. In other cases they will show up as “unknown” or “???” to
      indicate how much of the information could be used to generate the
      statistic.
    </Text>

    <Headline level="4">Terminology</Headline>
    <Text space="half" size="large" prose>
      Below you will find explanations of some commonly used terms:
    </Text>
    <List variant="spread" enumeration="enum">
      <List.Item>
        <Text space="half" size="large" prose>
          <strong>Percentile:</strong> The percentile indicates how well an
          entity (pilot, upgrade, ...) performs in comparison to other entities
          in the same set (single or multiple tournaments). It is calculated by
          averaging the results, and expressed as a percentage.
        </Text>
        <Text size="large" prose>
          For example, if a pilot makes 1st and 3rd place in a tournament with
          10 participants, her percentile will be 89% since there is one
          occurrence of the the pilot that is better than 100% of the field (1st
          place) and the occurrence (3rd place) is better then 78% of the field.
          Thus on average the pilot performed better than 89% of the field.
        </Text>
      </List.Item>
      <List.Item>
        <Text size="large" prose>
          <strong>Std. Deviation:</strong> The standard deviation measures how
          dispersed the performance (percentile) of an entity (pilot, upgrade,
          ...) is in relation to its mean. Low standard deviation means the
          results are clustered around the mean performance. On the other hand,
          high standard deviation indicates that the results are more spread
          out. Basically, a high standard deviation means a high variance in
          results and vice versa.
        </Text>
        <Text size="large" prose>
          If there is only one occurance of an entity, a &quot;-&quot; is
          displayed rather than the standard deviation of 0% to indicate that
          there can not be any deviation.
        </Text>
      </List.Item>
      <List.Item>
        <Text size="large" prose>
          <strong>Winrate:</strong> The winrate is expressed as a percentage and
          represents how much games an entity (pilot, upgrade,…) has won in
          comparison to the total games it appeared in. Sometimes round data is
          missing which causes an entity to have 0 games recorded. In this case
          a &quot;-&quot; is displayed to indicate the missing information.
        </Text>
      </List.Item>
      <List.Item>
        <Text size="large" prose>
          <strong>Frequency:</strong> The frequency is expressed as a percentage
          and represents how much games an entity (pilot, upgrade,…) appeared
          in. This is usually in relation to the faction (in case of pilots) or
          to the slot (in case of upgrades).
        </Text>
      </List.Item>
      <List.Item>
        <Text size="large" prose>
          <strong>Count:</strong> Since frequency is a relative value, the
          absolute number of occurrences is also presented.
        </Text>
      </List.Item>
      <List.Item>
        <Text size="large" prose>
          <strong>Score:</strong> The score value attempts to balance small
          sample sizes and their percentile. However, be aware that there is no
          elaborate science behind this number, even though it tries to quantify
          the percentile, and count of an entity. The goal of the score is to
          indicate whether a result is just a happy accident or if it is
          somewhat reliable because multiple people achieved a similar result.
          Essentially, it&quot;s a feel-good metric!
        </Text>
      </List.Item>
    </List>

    <Headline level="2" className="pt-10" id="credits">
      Credits
    </Headline>
    <List enumeration="enum">
      <List.Item>
        <Text size="large" prose>
          Data based on{' '}
          <Link href="https://github.com/danrs/xwing-data2">xwing-data2</Link>{' '}
          and <Link href="https://github.com/raithos/xwing">YASB</Link>
        </Text>
      </List.Item>
      <List.Item>
        <Text size="large" prose>
          X-Wing fonts by{' '}
          <Link href="https://github.com/raithos/xwing/tree/master/fonts">
            raithos
          </Link>{' '}
          (originally by geordan)
        </Text>
      </List.Item>
    </List>

    <Headline level="2" className="pt-10" id="support">
      Support
    </Headline>
    <Text size="large" prose>
      Pattern Analyzer is and will remain free. I don&apos;t have a Patreon, but
      if you&apos;re keen on supporting the project, you can treat me to a
      coffee or contribute to expanding my collection of plastic spaceships{' '}
      <Link href="https://paypal.me/sebsebald">here</Link>.
    </Text>
  </div>
);

export default About;
