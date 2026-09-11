'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AutomationAction, AutomationCondition } from 'types/automations';
import * as yup from 'yup';
import { validateActionParams } from './common/actionUtils';
import { getConditionFieldVariant } from './common/conditionRegistry';
import { DEFAULT_ACTIONS, DEFAULT_CONDITIONS, isConditionFilterType } from './common/constants';

export interface AutomationFormValues {
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

const needsFromToValues = (condition: AutomationCondition) => {
  const variant = getConditionFieldVariant(condition.type);
  return variant === 'status_from_to' || variant === 'priority_from_to';
};

const needsDateOffset = (condition: AutomationCondition) =>
  getConditionFieldVariant(condition.type) === 'date_before_after';

const needsTargetDate = (condition: AutomationCondition) =>
  condition.type === 'start_date_before_after' ||
  condition.type === 'due_date_before_after' ||
  condition.type === 'start_date_is' ||
  condition.type === 'due_date_is';

const needsMultiSelectValue = (condition: AutomationCondition) => {
  if (isConditionFilterType(condition.type)) {
    return condition.type === 'assignee_is' || condition.type === 'label_is';
  }

  const variant = getConditionFieldVariant(condition.type);
  return variant === 'assignee' || variant === 'label';
};

const needsConditionalFilterValue = (condition: AutomationCondition) => {
  if (!isConditionFilterType(condition.type)) return false;
  if (condition.operator === 'is_set' || condition.operator === 'is_not_set') return false;
  if (condition.type === 'start_date_is' || condition.type === 'due_date_is') return false;
  return true;
};

const conditionSchema = yup.object({
  type: yup.string().required('Condition type is required'),
  field: yup.string().required('Field is required'),
  operator: yup.string().required('Operator is required'),
  value: yup
    .mixed<AutomationCondition['value']>()
    .test('not-empty', 'Value is required', function (value) {
      const condition = this.parent as AutomationCondition;

      if (
        needsFromToValues(condition) ||
        getConditionFieldVariant(condition.type) === 'date_before_after' ||
        getConditionFieldVariant(condition.type) === 'none' ||
        isConditionFilterType(condition.type)
      ) {
        if (needsConditionalFilterValue(condition)) {
          if (needsMultiSelectValue(condition)) {
            return Array.isArray(value) && value.length > 0;
          }
          if (typeof value === 'string') return value.trim().length > 0;
        }
        return true;
      }

      if (needsMultiSelectValue(condition)) {
        return Array.isArray(value) && value.length > 0;
      }

      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return false;
    })
    .required('Value is required'),
  fromValue: yup.string().test('required-if-from-to', 'From is required', function (value) {
    const condition = this.parent as AutomationCondition;
    if (!needsFromToValues(condition)) return true;
    return !!value && value.trim().length > 0;
  }),
  toValue: yup.string().test('required-if-from-to', 'To is required', function (value) {
    const condition = this.parent as AutomationCondition;
    if (!needsFromToValues(condition)) return true;
    return !!value && value.trim().length > 0;
  }),
  dateOffset: yup
    .string()
    .test('required-if-date-before-after', 'Offset is required', function (value) {
      const condition = this.parent as AutomationCondition;
      if (!needsDateOffset(condition)) return true;
      return !!value && value.trim().length > 0;
    }),
  dateOffsetUnit: yup.string().oneOf(['days', 'weeks']).notRequired(),
  dateRelation: yup.string().oneOf(['before', 'after']).notRequired(),
  targetDate: yup
    .string()
    .test('required-if-date-before-after', 'Target date is required', function (value) {
      const condition = this.parent as AutomationCondition;
      if (!needsTargetDate(condition)) return true;
      if (
        isConditionFilterType(condition.type) &&
        (condition.operator === 'is_set' || condition.operator === 'is_not_set')
      ) {
        return true;
      }
      return !!value && value.trim().length > 0;
    }),
});

const actionSchema = yup.object({
  type: yup.string().required('Action type is required'),
  params: yup
    .object()
    .required('Action params are required')
    .test('validate-params', 'Action params are invalid', function (params) {
      const action = this.parent as AutomationAction;
      return validateActionParams(action, params ?? {}, {
        basePath: this.path || '',
        createError: (error) => this.createError(error),
      });
    }),
});

export const automationFormSchema = yup.object({
  conditions: yup
    .array()
    .of(conditionSchema)
    .min(1, 'At least one condition is required')
    .required('Conditions are required'),
  actions: yup
    .array()
    .of(actionSchema)
    .min(1, 'At least one action is required')
    .required('Actions are required'),
}) as yup.ObjectSchema<AutomationFormValues>;

const useCreateAutomationForm = () => {
  const methods = useForm<AutomationFormValues>({
    resolver: yupResolver(automationFormSchema),
    defaultValues: {
      conditions: DEFAULT_CONDITIONS,
      actions: DEFAULT_ACTIONS,
    },
  });

  return { methods };
};

export default useCreateAutomationForm;
