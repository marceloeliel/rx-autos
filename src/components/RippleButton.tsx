import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
}

interface BaseButtonProps {
  fullWidth?: boolean;
}

interface StyledButtonProps extends BaseButtonProps {
  variant?: string;
  disabled?: boolean;
}

const BaseButton = styled(motion.button)<BaseButtonProps>`
  padding: 8px 24px;
  border-radius: 4px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: none;
  background: none;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-width: 120px;
`;

const RippleEffect = styled(motion.span)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
`;

const StyledButton = styled(BaseButton)<StyledButtonProps>`
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #ff6b00;
          color: white;
          &:hover {
            background-color: #e65c00;
          }
          ${RippleEffect} {
            background: rgba(255, 255, 255, 0.5);
          }
        `;
      case 'secondary':
        return `
          background-color: #333;
          color: white;
          &:hover {
            background-color: #444;
          }
          ${RippleEffect} {
            background: rgba(255, 255, 255, 0.5);
          }
        `;
      case 'outline':
        return `
          background: none;
          border: 2px solid #ff6b00;
          color: #ff6b00;
          &:hover {
            background-color: #ff6b00;
            color: white;
          }
          ${RippleEffect} {
            background: rgba(255, 107, 0, 0.4);
          }
        `;
      default:
        return `
          background-color: #ff6b00;
          color: white;
          &:hover {
            background-color: #e65c00;
          }
          ${RippleEffect} {
            background: rgba(255, 255, 255, 0.5);
          }
        `;
    }
  }}
`;

export function RippleButton({ children, className, onClick, variant = 'primary', fullWidth, disabled }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples([...ripples, { x, y, id }]);
    
    if (onClick) {
      onClick(e);
    }

    setTimeout(() => {
      setRipples(ripples => ripples.filter(ripple => ripple.id !== id));
    }, 1000);
  };

  useEffect(() => {
    const timeouts = ripples.map((_, i) => {
      return setTimeout(() => {
        setRipples(prevRipples => prevRipples.filter((_, index) => index !== 0));
      }, 700);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [ripples]);

  return (
    <StyledButton className={className} onClick={handleClick} variant={variant} fullWidth={fullWidth} disabled={disabled}>
      {children}
      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </StyledButton>
  );
}

export default RippleButton; 