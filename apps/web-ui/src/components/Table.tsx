import React from 'react';
import { Spinner } from './Spinner';

interface ColumnDefinition<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  minWidth?: string | number; // Add minWidth for mobile handling
}

interface TableProps<T> {
  title?: string;
  data?: T[];
  columns: ColumnDefinition<T>[];
  isLoading?: boolean;
}

export function Table<T extends Record<string, any>>({ 
  title,
  data, 
  columns,
  isLoading
}: TableProps<T>): JSX.Element {

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

  if (isLoading || !data || !Array.isArray(data)) {
    return (
      <div className="rounded-l border border-slate-800 bg-slate-800/50 p-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <Spinner />
      </div>
    );
  }

  return (
    <div className="rounded-l border border-slate-800 overflow-hidden">
      {title && <div className="p-4 bg-slate-800/50">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>}
      <div 
        className="overflow-x-auto"
      >
        <table
          className="w-full"
        >
          <thead className="bg-slate-800/30">
            <tr>
              {columns.map((column, idx) => (
                <th 
                  key={String(column.key)} 
                  className={`${
                    idx === 0
                    ? 'text-left'
                    : 'text-center'
                  } text-sm text-slate-400 px-4 py-3`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
           className="divide-y divide-slate-800"
          >
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((column, idx) => (
                  <td
                    key={String(column.key)}
                    className={`${
                      idx === 0
                      ? 'text-left'
                      : 'text-center'
                    } px-4 py-4`}
                  >
                    <div className="font-medium">
                      {getValue(row, column)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
