import React from 'react';
import clsx from 'clsx';
import './Badge.css';

const Badge = ({ children, variant = 'default', className }) => {
    return (
        <span className={clsx('badge-ui', `badge-${variant}`, className)}>
            <span className="badge-dot" />
            {children}
        </span>
    );
};

export default Badge;
