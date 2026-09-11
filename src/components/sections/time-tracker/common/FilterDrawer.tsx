import { users } from 'data/users';
import FilterDrawerWrapper from './FilterDrawerWrapper';
import FilterFormGroup from './FilterFormGroup';
import FilterSelect from './FilterSelect';

const FilterDrawer = () => {
  return (
    <FilterDrawerWrapper>
      <FilterSelect
        label="Member"
        options={[
          { value: 1, label: users[0].name },
          { value: 2, label: users[1].name },
          { value: 3, label: users[2].name },
        ]}
      />

      <FilterSelect
        label="Team"
        options={[
          { value: 1, label: 'ThemeWagon' },
          { value: 2, label: 'MailBluster' },
          { value: 3, label: 'HyperNinja' },
        ]}
      />

      <FilterSelect
        label="Client"
        options={[
          { value: 1, label: 'Acme Corp' },
          { value: 2, label: 'ZenMobile' },
          { value: 3, label: 'Brightleaf Tech' },
        ]}
      />

      <FilterSelect
        label="Project"
        options={[
          { value: 1, label: 'Website Redesign' },
          { value: 2, label: 'Content Marketing' },
          { value: 3, label: 'Lead Gen Compaign' },
        ]}
      />

      <FilterFormGroup
        label="Billable"
        options={[
          { value: 'all', label: 'All' },
          { value: 'billable', label: 'Billable' },
          { value: 'non-billable', label: 'Non-Billable' },
        ]}
      />
    </FilterDrawerWrapper>
  );
};

export default FilterDrawer;
