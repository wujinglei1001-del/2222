import { AutomationAction } from 'types/automations';
import { DESTRUCTIVE_ACTION_TYPES } from './common/actionRegistry';
import { ACTION_GROUPS, getActionTypeLabel } from './common/constants';
import GroupedSearchableSelect from './shared/GroupedSearchableSelect';

interface ActionDropdownProps {
  value: AutomationAction['type'];
  onChange?: (value: AutomationAction['type']) => void;
  excludedTypes?: AutomationAction['type'][];
}

const ActionDropdown = ({ value, onChange, excludedTypes = [] }: ActionDropdownProps) => (
  <GroupedSearchableSelect
    value={value}
    onChange={onChange}
    groups={ACTION_GROUPS}
    getLabel={getActionTypeLabel}
    excludedValues={excludedTypes}
    destructiveValues={DESTRUCTIVE_ACTION_TYPES}
    showSearchIcon
  />
);

export default ActionDropdown;
