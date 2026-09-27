import React from 'react';
import Card from '../components/common/Card';

export const History = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Equipment &amp; Repair History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Step 5 &amp; 6: Remember &amp; Prevent &bull; Track item lifecycles and proactive alerts.
        </p>
      </div>

      <Card title="Tracked Devices &amp; Maintenance Logs" subtitle="Scheduled for Phase 6 (Equipment Tracking & Maintenance Reminders)">
        <p style={{ color: 'var(--text-secondary)' }}>
          Every completed fix is saved to the item profile. FixIt tracks part replacements, calculates next recommended service dates,
          and sends notifications before issues re-occur.
        </p>
      </Card>
    </div>
  );
};

export default History;
