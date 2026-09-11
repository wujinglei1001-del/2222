import FilterDrawerWrapper from '../common/FilterDrawerWrapper';
import FilterFormGroup from '../common/FilterFormGroup';
import FilterSelect from '../common/FilterSelect';

const TableFilter = () => {
  return (
    <FilterDrawerWrapper>
      <FilterSelect
        label="Project"
        options={[
          { value: 1, label: 'Website Redesign' },
          { value: 2, label: 'Content Marketing' },
          { value: 3, label: 'Lead Gen Compaign' },
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

      <FilterFormGroup
        label="Time Type"
        options={[
          { value: 'all', label: 'All' },
          { value: 'normal', label: 'Normal' },
          { value: 'idle', label: 'Idle' },
          { value: 'manual', label: 'Manual' },
        ]}
      />

      <FilterFormGroup
        label="Source"
        options={[
          { value: 'all', label: 'All' },
          { value: 'desktop', label: 'Desktop' },
          { value: 'mobile', label: 'Mobile' },
          { value: 'browser', label: 'Browser' },
        ]}
      />

      <FilterFormGroup
        label="Activity"
        options={[
          { value: 'all', label: 'All' },
          { value: '50-100', label: '50-100%' },
          { value: '20-50', label: '20-50%' },
          { value: '0-20', label: '0-20%' },
        ]}
      />
    </FilterDrawerWrapper>
  );
};

export default TableFilter;
