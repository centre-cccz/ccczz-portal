import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
};

export default function Button({ children, onClick, startIcon, endIcon, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn ${className || ''}`.trim()}>
      {startIcon ? <span className="btn-icon btn-icon-start">{startIcon}</span> : null}
      <span className="btn-label">{children}</span>
      {endIcon ? <span className="btn-icon btn-icon-end">{endIcon}</span> : null}
    </button>
  );
}
