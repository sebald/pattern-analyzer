import { Headline, List, Message, Text } from 'components';

export const AboutTheData = () => (
  <Message icon="none">
    <Message.Body>
      <Headline level="2">About the Data</Headline>
      <Headline level="4">What is the “unknown” faction?</Headline>
      <Text>
        Some squad lists may have been entered in a format that can not be
        analyzed by Pattern Analyzer and will be not considered in most of the
        statistics. In other cases they will show up as “unknown” to indicate
        how much of the information could be used to generate the statistic.
      </Text>
      <Headline level="4">Terminology</Headline>
      <Text space="half">
        Below you will find explanations of some commonly used terms:
      </Text>
      <List variant="compact" enumeration="enum">
        <List.Item>
          <Text space="half">
            <strong>Percentile:</strong> The percentile indicates how well an
            entity (pilot, upgrade, ...) performs in comparison to other
            entities in the same set (single or multiple tournaments). It is
            calculated by averaging the results, and expressed as a percentage.
          </Text>
          <Text>
            For example, if a pilot makes 1st and 3rd place in a tournament with
            10 participants, her percentile will be 80% since there is one
            occurrence of the the pilot that is better than 90% of the field
            (1st place) and the occurrence (3rd place) is better then 70% of the
            field. Thus on average the pilot performed better than 80% of the
            field.
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Std. Deviation:</strong> The standard deviation measures how
            dispersed the performance (percentile) of an entity (pilot, upgrade,
            ...) is in relation to its mean. Low standard deviation means the
            results are clustered around the mean performance. On the other
            hand, high standard deviation indicates that the results are more
            spread out. Basically, a high standard deviation means a high
            variance in results and vice versa.
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Winrate:</strong> The winrate is expressed as a percentage
            and represents how much games an entity (pilot, upgrade,…) has won
            in comparison to the total games it appeared in.
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Frequency:</strong> The frequency is expressed as a
            percentage and represents how much games an entity (pilot,
            upgrade,…) appeared in. This is usually in relation to the faction
            (in case of pilots) or to the slot (in case of upgrades).
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Count:</strong> Because frequency is a relative number, the
            absolute amount of appearances is displayed in addition.
          </Text>
        </List.Item>
      </List>
    </Message.Body>
  </Message>
);
