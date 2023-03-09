import { Headline, Message, Text } from 'components';

export const AboutTheData = () => (
  <Message icon="none">
    <Message.Body>
      <Headline level="3">About the Data</Headline>
      <Headline level="4">What is the “unknown” faction?</Headline>
      <Text>
        Some squad lists may have been entered in a format that can not be
        analyzed by Pattern Analyzer and will be not considered in most of the
        statistics. In other cases they will show up as “unknown” to indicate
        how much of the information could be used to generate the statistic.
      </Text>
    </Message.Body>
  </Message>
);
