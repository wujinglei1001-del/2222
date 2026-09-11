import { STATUS_OPTIONS } from '../common/constants';
import FromToSelectConditionFields from './FromToSelectConditionFields';

interface StatusChangesConditionFieldsProps {
  index: number;
}

const StatusChangesConditionFields = ({ index }: StatusChangesConditionFieldsProps) => (
  <FromToSelectConditionFields index={index} options={STATUS_OPTIONS} />
);

export default StatusChangesConditionFields;
