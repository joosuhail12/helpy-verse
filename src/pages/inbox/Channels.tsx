
import React from 'react';
import Inbox from '../Inbox';
import { useParams } from 'react-router-dom';

const Channels = () => {
  const { channelId } = useParams();
  console.log('Viewing channel:', channelId);
  
  return <Inbox />;
};

export default Channels;
