import type { ConditionFilterType } from './common/constants';
import { CONDITION_FILTER_OPTIONS, getConditionFilterLabel } from './common/constants';
import GroupedSearchableSelect from './shared/GroupedSearchableSelect';

interface ConditionalFieldDropdownProps {
  value: ConditionFilterType;
  onChange?: (value: ConditionFilterType) => void;
  excludedTypes?: ConditionFilterType[];
}

const ConditionalFieldDropdown = ({
  value,
  onChange,
  excludedTypes = [],
}: ConditionalFieldDropdownProps) => (
  <GroupedSearchableSelect
    value={value}
    onChange={onChange}
    flatOptions={CONDITION_FILTER_OPTIONS}
    getLabel={getConditionFilterLabel}
    excludedValues={excludedTypes}
    hideSearch
  />
);

export default ConditionalFieldDropdown;
