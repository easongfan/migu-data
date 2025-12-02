import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import clsx from 'clsx';
import './ProcessingNode.css';

const ProcessingNode = ({ id, type, label, x, y, onDrag, onConnectStart, onConnectEnd, onDelete, isSelected, onSelect }) => {
    const dragControls = useDragControls();

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={false}
            animate={{ x, y, opacity: 1, scale: 1 }}
            onDrag={(_, info) => onDrag(id, { x: x + info.delta.x, y: y + info.delta.y })}
            className={clsx('processing-node', `node-${type}`, { selected: isSelected })}
            onClick={() => onSelect(id)}
        >
            <div
                className="node-header"
                onPointerDown={(e) => dragControls.start(e)}
                style={{ cursor: 'grab' }}
            >
                <span className="node-label">{label}</span>
                <div className="node-actions">
                    <button className="node-action-btn"><Settings size={14} /></button>
                    <button className="node-action-btn" onClick={(e) => { e.stopPropagation(); onDelete(id); }}>
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className="node-body">
                <div className="node-content">
                    <span className="node-type">{type}</span>
                </div>
            </div>

            {/* Handles */}
            <div
                className="node-handle handle-input"
                onMouseUp={(e) => { e.stopPropagation(); onConnectEnd && onConnectEnd(id); }}
            />
            <div
                className="node-handle handle-output"
                onPointerDown={(e) => { e.stopPropagation(); onConnectStart && onConnectStart(id, e); }}
            />
        </motion.div>
    );
};

export default ProcessingNode;

