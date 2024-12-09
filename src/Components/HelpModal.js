import React from 'react';

const HelpModal = ({ show, onClose }) => {
  if (!show) return null;

  const commands = [
    { command: 'read more', action: 'Open the full article in a new tab.' },
    { command: 'next', action: 'Navigate to the next page of articles.' },
    { command: 'previous', action: 'Navigate to the previous page of articles.' },
    { command: 'move', action: 'Highlight the next news item.' },
    { command: 'back', action: 'Highlight the previous news item.' },
    { command: 'read news', action: 'Read all news items aloud sequentially.' },
    { command: 'read description X', action: 'Read the description of article X.' },
    { command: 'read article X', action: 'Read the title of article X.' },
    { command: 'go to [section]', action: 'Navigate to the specified section (e.g., sports, home).' },
    { command: 'stop reading', action: 'Stop reading aloud.' },
  ];

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Voice Command Help</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ul>
              {commands.map((cmd, index) => (
                <li key={index}>
                  <strong>{cmd.command}</strong>: {cmd.action}
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
