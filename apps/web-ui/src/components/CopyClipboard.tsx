
import { Copy, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';

const styles : any = {
  tokenAddress: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: '#8b5cf6',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    wordBreak: 'break-all',
    cursor: 'pointer',
  },
  copyButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#8b5cf6',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success(<span style={{ fontSize: '.8rem'}}>{`Copied ${text}`}</span>, {
    autoClose: 500,
    theme: 'dark',
  });
};

export function CopyClipboard({ content, display }: any) {
  display = display || content;
  return (
    <div style={styles.tokenAddress}>
      <button
        style={styles.copyButton}
        onClick={() => copyToClipboard(content)}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1
        }}>
          <div>{display}</div>
          <div>
            <Copy size={14} />
          </div>
        </div>
      </button>
    </div>
  )
}
