import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button.jsx';

export default function BookingForm({ onSubmit, defaultDate = new Date().toISOString().slice(0,10) }) {
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [duration, setDuration] = useState(1);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ date, startTime, endTime, duration });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Input placeholder="Start" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <Input placeholder="End" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      <div className="flex gap-2">
        <Input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Button type="submit">Check</Button>
      </div>
    </form>
  );
}


