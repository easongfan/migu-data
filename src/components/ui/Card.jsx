import React from 'react';
import clsx from 'clsx';
import './Card.css';

const Card = ({ children, className, title, action, ...props }) => {
    return (
        <div className={clsx('card glass-panel', className)} {...props}>
            {(title || action) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {action && <div className="card-action">{action}</div>}
                </div>
            )}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};

export default Card;
