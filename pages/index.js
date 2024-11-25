import React from 'react';
import BookSearch from './bookList';
import {getServerSideProps} from '../utils/helper';

export default function Home() {
  return <BookSearch />;
}

export {getServerSideProps};