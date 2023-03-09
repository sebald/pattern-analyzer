import { Headline, List, Message, Text } from 'components';

export const AboutTheData = () => (
  <Message icon="none">
    <Message.Body>
      <Headline level="3">About the Data</Headline>
      <Headline level="5">What is the “unknown” faction?</Headline>
      <Text>
        Some squad lists may have been entered in a format that can not be
        analyzed by Pattern Analyzer and will be not considered in most of the
        statistics. In other cases they will show up as “unknown” to indicate
        how much of the information could be used to generate the statistic.
      </Text>
      <Headline level="5">Terminology</Headline>
      <Text space="half">
        Below you will find explanations of some commonly used terms:
      </Text>
      <List variant="compact" enumeration="enum">
        <List.Item>
          <strong>Percentile:</strong> asd{' '}
        </List.Item>
      </List>
    </Message.Body>
  </Message>
);
