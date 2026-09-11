import { AutomationCondition } from 'types/automations';
import { CONDITION_TRIGGER_GROUPS, getConditionTriggerLabel } from './common/constants';
import GroupedSearchableSelect from './shared/GroupedSearchableSelect';

interface TriggerDropdownProps {
  value: AutomationCondition['type'];
  onChange?: (value: AutomationCondition['type']) => void;
  excludedTypes?: AutomationCondition['type'][];
}

const TriggerDropdown = ({ value, onChange, excludedTypes = [] }: TriggerDropdownProps) => (
  <GroupedSearchableSelect
    value={value}
    onChange={onChange}
    groups={CONDITION_TRIGGER_GROUPS}
    getLabel={getConditionTriggerLabel}
    excludedValues={excludedTypes}
    hideSearch
  />
);

export default TriggerDropdown;
