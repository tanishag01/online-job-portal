import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db } from './firebase.config';
import Navbar from './components/Navbar';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import JobCard from './components/JobCard';

const JOB_COLLECTION = 'jobs';
const DEFAULT_SORT_ORDER = 'desc';

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [customSearch, setCustomSearch] = useState(false);
  const [error, setError] = useState('');
  const [clearFields, setClearFields] = useState(false);

  const fetchJobs = async () => {
    setError('');
    try {
      const jobsRef = collection(db, JOB_COLLECTION);
      const q = query(jobsRef, orderBy('postedOn', DEFAULT_SORT_ORDER));
      const req = await getDocs(q);
      const jobsData = req.docs.map((job) => ({
        ...job.data(),
        id: job.id,
        postedOn: job.data().postedOn.toDate(),
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    }
  };

  const fetchJobsCustom = async (criteria) => {
    setError('');
    try {
      setCustomSearch(true);
      setSearchCriteria(criteria);
      const jobsRef = collection(db, JOB_COLLECTION);
      let q = jobsRef;

      Object.keys(criteria).forEach((key) => {
        if (criteria[key]) {
          q = query(q, where(key, '==', criteria[key]));
        }
      });

      if (q === jobsRef) {
        q = query(jobsRef, orderBy('postedOn', DEFAULT_SORT_ORDER));
      } else {
        q = query(q, orderBy('postedOn', DEFAULT_SORT_ORDER));
      }

      const req = await getDocs(q);
      const jobsData = req.docs.map((job) => ({
        ...job.data(),
        id: job.id,
        postedOn: job.data().postedOn.toDate(),
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching custom jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    }
  };

  const clearFilters = () => {
    setCustomSearch(false);
    setSearchCriteria({});
    setClearFields(true);
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (clearFields) {
      setClearFields(false);
    }
  }, [clearFields]);

  return (
    <div>
      <Navbar />
      <Header />
      <SearchBar fetchJobsCustom={fetchJobsCustom} clearFields={clearFields} />
      {customSearch && (
        <button onClick={clearFilters} className="flex ml-11 mb-2">
          <p className="bg-blue-500 px-10 py-2 rounded-md text-white z-10">
            Clear Filters
          </p>
        </button>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}

export default App;
