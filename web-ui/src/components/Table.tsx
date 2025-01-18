import React, { useEffect, useState } from 'react';

interface ColumnDefinition<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  minWidth?: string | number; // Add minWidth for mobile handling
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  className?: string;
}

interface Styles {
  [key: string]: React.CSSProperties;
}

const styles : Styles | any = {
  wrapper: {
    width: '100%',
    position: 'relative' as const,
    backgroundColor: 'rgb(26, 27, 38)',
    border: '1px solid rgba(96, 165, 250, 0.2)',
  },
  scrollContainer: {
    // Custom scrollbar styles
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(96, 165, 250, 0.3) transparent',
    '&::WebkitScrollbar': {
      height: '6px', // Horizontal scrollbar height
    },
    '&::WebkitScrollbarTrack': {
      background: 'rgba(30, 41, 59, 0.3)',
    },
    '&::WebkitScrollbarThumb': {
      backgroundColor: 'rgba(96, 165, 250, 0.3)',
      borderRadius: '3px',
    },
  },
  scrollIndicators: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #FF3EA5 0%, #60a5fa 100%)',
    transform: 'scaleX(0)',
    transformOrigin: '0 0',
    transition: 'transform 4s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.875rem',
  },
  headerCell: {
    backgroundColor: 'rgba(30, 41, 59, 1)',
    padding: '1rem',
    color: '#94a3b8',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    textAlign: 'left' as const,
    borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
    whiteSpace: 'nowrap' as const,
  },
  cell: {
    padding: '1rem',
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(96, 165, 250, 0.1)',
    fontFamily: "'Space Grotesk', sans-serif",
    whiteSpace: 'nowrap' as const,
  },
  row: {
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(96, 165, 250, 0.05)',
    },
  }
};

export function Table<T extends Record<string, any>>({ 
  data, 
  columns,
  className
}: TableProps<T>): JSX.Element {

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [_isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isScrollable = target.scrollWidth > target.clientWidth;
    const isScrolled = target.scrollLeft > 0;
    setShowScrollIndicator(isScrollable && !isScrolled);
  };

  const getValue = (row: T, column: ColumnDefinition<T>) => {
    const keys = String(column.key).split('.');
    let value = row as any;
    for (const key of keys) {
      value = value?.[key];
    }
    if (value === undefined && !column.key.toString().startsWith('_')) return '-';
    const renderValue = column.formatter ? column.formatter(value, row) : value;
    if (
      // if not react element and is object
      !React.isValidElement(renderValue) &&
      typeof renderValue === 'object') {
      return (
        <pre>
          {JSON.stringify(renderValue, null, 2)}
        </pre>
      )
    }
    return renderValue;
  };

  return (
    <div 
    className={className}
    style={styles.wrapper}>
      <div 
        style={styles.scrollContainer} 
        onScroll={handleScroll}
      >
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={String(column.key)} 
                  style={{
                    ...styles.headerCell,
                    textAlign: column.align || 'left',
                    width: column.width,
                    minWidth: column.minWidth || '120px', // Set minimum width for mobile
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            style={{
              overflowY: 'auto',
            }}
          >
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={styles.row}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    style={{
                      ...styles.cell,
                      textAlign: column.align || 'left',
                      minWidth: column.minWidth || '120px',
                    }}
                  >
                    {getValue(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div 
        style={{
          ...styles.scrollIndicator,
          opacity: showScrollIndicator ? 1 : 0,
        }} 
      />
    </div>
  );
}
