import React from 'react';
import styles from './GlassButton.module.css';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
  variant?: 'primary' | 'secondary';
}

export function GlassButton({
  children,
  as = 'button',
  href,
  variant = 'primary',
  className = '',
  ...props
}: GlassButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${className}`;

  if (as === 'a' && href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
