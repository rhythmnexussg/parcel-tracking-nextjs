'use client';

import { useEffect } from 'react';

export default function Contact() {
  useEffect(() => {
    window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfMZDY_D9gO2JPLYAnIeEqyyYeZI2VXDTnR12L4ihbz5hYwIA/viewform';
  }, []);

  return null;
}
