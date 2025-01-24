import { toast } from 'react-toastify';

export const useToast = () => {

  const showSuccessToast = (title: string, _message?: string) => {
    toast.success(title, { theme: 'dark', autoClose: 1000 });
  }

  const showErrorToast = (errorTitle: string, errorMessage?: string) => {
    toast.error(
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>{errorTitle}</div>
      {errorMessage && <div className="text-xs text-gray-400">{errorMessage}</div>}
    </div>, { theme: 'dark', autoClose: 1000 }
    );
  }

  return {
    showSuccessToast,
    showErrorToast
  }
}