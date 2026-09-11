import { apiEndpoints } from 'routes/paths';
import { Key } from 'swr';
import useSWRMutation from 'swr/mutation';
import axiosFetcher from 'services/axios/axiosFetcher';
import { sendPasswordResetLinkFetcher } from 'services/swr/dummyFetcher';
import { ForgotPasswordFormValues } from 'components/sections/authentications/common/ForgotPasswordForm';
import { SetPasswordFormValues } from 'components/sections/authentications/default/SetPassworForm';

export interface User {
  id: number | string;
  name: string;
  email: string;
  avatar: null | string;
  type?: string;
  designation?: string;
}

export const useSendPasswordResetLink = () => {
  const mutation = useSWRMutation<{ message: string }, Error, Key, ForgotPasswordFormValues>(
    [apiEndpoints.forgotPassword, { method: 'post' }],
    // axiosFetcher,
    sendPasswordResetLinkFetcher,
  );

  return mutation;
};

export const useResetPassword = () => {
  const mutation = useSWRMutation<{ data: { message: string } }, Error, Key, SetPasswordFormValues>(
    [apiEndpoints.setPassword, { method: 'post' }],
    axiosFetcher,
  );

  return mutation;
};
